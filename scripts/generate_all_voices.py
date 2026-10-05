"""Generate natural, character-consistent static voice takes for the full game."""
from __future__ import annotations

import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfiltfilt

from generate_act1_voices import FFMPEG, FFPROBE, RUNTIME, SR, normalize, read_wav, run, write_wav

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'audio' / 'voices'
WORK = ROOT / '.voice-work-all'
MANIFEST = ROOT / 'src' / 'data' / 'generated-voice-takes.js'
REPORT = ROOT / 'assets' / 'audio' / 'full-voice-report.json'

# The four revised profiles match the approved v4 auditions. Other recurring
# characters use separate voices so a listener can identify them without UI.
PROFILES = {
    '林知夏': ('zh-CN-XiaoxiaoNeural', 8, '+0Hz'),
    '梁一舟': ('en-US-BrianMultilingualNeural', 18, '+2Hz'),
    '宋岚': ('en-US-EmmaMultilingualNeural', 14, '-1Hz'),
    '沈舟': ('zh-CN-YunyangNeural', 7, '-1Hz'),
    '许橙': ('zh-CN-XiaoxiaoNeural', 10, '+3Hz'),
    '姜宁': ('zh-CN-XiaoyiNeural', 9, '-5Hz'),
    '周衡': ('zh-CN-YunxiNeural', 11, '-3Hz'),
    '陆鸣': ('zh-CN-YunjianNeural', 10, '+1Hz'),
    '唐遇': ('en-US-WilliamMultilingualNeural', 16, '+4Hz'),
}

# Nodes that visibly combine narration and quoted speech. These overrides keep
# the spoken content aligned with the screen while assigning the right actor.
MIXED = {
    'c03': [
        ('宋岚', '就是这里。他没有回避误差控制，还把计算步骤写了出来。会后那张分析图，也确实帮我排除过一次实验偏差。'),
        ('林知夏', '这段是5月留下的同期录像。'),
    ],
    'q03voices': [
        ('林知夏', '第1期实习生许橙说：'),
        ('许橙', '我拿到过工资，也被移出过群。'),
        ('林知夏', '宋岚老师的研究生姜宁说：'),
        ('姜宁', '我见过他本人，也听过他说漏嘴。'),
        ('林知夏', '宋岚老师说：'),
        ('宋岚', '他的分析帮过我，也可能骗了我。'),
    ],
    'q04intro': [
        ('许橙', '第1期实习工资来自恒微科技，第2期实习招募缴费却进了星桥。群里的合作函确实盖着章，可右下角像被裁掉了一行。'),
        ('林知夏', '我带着截图离开活动室，陆鸣已在社团档案室等我。'),
    ],
    'q08intro': [
        ('林知夏', '证据墙刚整理完，周衡主动约我到校外咖啡馆。他把退款清单推过来。'),
        ('周衡', '许橙的2800元、宋老师的7.56万元，我可以让财务退。你把旧片撤掉，大家体面收场。'),
    ],
    'm01': [
        ('林知夏', '发布准备到一半，梁一舟突然来电。'),
        ('梁一舟', '学姐，沈舟刚和我视频。他会挥手、会转头，群里那次宣讲真是本人吧？'),
        ('林知夏', '录屏中的动作没有明显破绽。'),
    ],
    'm01c': [
        ('沈舟', '那天人多，我穿深色外套吧？改天请你吃饭。'),
        ('林知夏', '答案模糊，却足以让人继续相信。'),
    ],
    'q11intro': [
        ('林知夏', '身份核验结束后，我逐一回访当事人，确认公开视频范围。姜宁说：'),
        ('姜宁', '我想让后来的人知道风险，但我不想把自己交给围观的人。如果我不授权，请连声音都不要放。'),
    ],
    'q12intro': [
        ('林知夏', '23点，第2期实习招募距离关单只剩1小时，科研检测尾款也在被连续催缴。宋岚关掉来电。'),
        ('宋岚', '教授职称可以下次再申报，论文可以延期。来路不明的数据一旦写进去，我解释不清。'),
    ],
}


def story_rows() -> list[dict]:
    js = """
import story from './src/data/story.js';
import { presentNode } from './src/data/player-copy.js';
const rows = Object.values(story.nodes).filter(node => node.audioId).map(node => {
  const shown = presentNode(node);
  return { id: node.id, speaker: shown.speaker || '', text: shown.text || '' };
});
process.stdout.write(JSON.stringify(rows));
"""
    raw = subprocess.check_output(
        ['node', '--input-type=module', '-e', js], cwd=ROOT, encoding='utf-8'
    )
    return json.loads(raw)


def canonical_speaker(label: str) -> str:
    for name in PROFILES:
        if name in label:
            return name
    return '林知夏'


def split_long(text: str) -> list[tuple[str, float]]:
    text = re.sub(r'\s+', ' ', text).strip().strip('“”\"')
    sentences = [part.strip() for part in re.split(r'(?<=[。！？；])', text) if part.strip()]
    result: list[tuple[str, float]] = []
    for sentence in sentences or [text]:
        if len(sentence) <= 46:
            parts = [sentence]
        else:
            pieces = [part for part in re.split(r'(?<=[，：])', sentence) if part]
            parts, current = [], ''
            for piece in pieces:
                if current and len(current) + len(piece) > 38:
                    parts.append(current); current = piece
                else:
                    current += piece
            if current: parts.append(current)
        for part in parts:
            part = part.strip().strip('“”\"')
            if not part or not re.search(r'[\w\u4e00-\u9fff]', part):
                continue
            end = part[-1:] if part else ''
            gap = .10 if end in '？！' else .13 if end in '。；' else .075
            result.append((part, gap))
    if result:
        result[-1] = (result[-1][0], 0)
    return result


def planned_segments(row: dict) -> list[dict]:
    blocks = MIXED.get(row['id']) or [(canonical_speaker(row['speaker']), row['text'])]
    segments = []
    for speaker, block in blocks:
        for text, gap in split_long(block):
            segments.append({'speaker': speaker, 'text': text, 'gap': gap})
        if segments:
            segments[-1]['gap'] = .11
    if segments:
        segments[-1]['gap'] = 0
    return segments


async def synthesize_segment(edge_tts, semaphore, take_id: str, index: int, segment: dict) -> None:
    speaker = segment['speaker']
    voice, base_rate, pitch = PROFILES[speaker]
    # Questions are kept a touch slower, while short notices can move faster.
    delta = -1 if segment['text'].endswith(('？', '?')) else (1 if len(segment['text']) < 15 else 0)
    rate = f'{base_rate + delta:+d}%'
    folder = WORK / take_id
    folder.mkdir(parents=True, exist_ok=True)
    mp3, wav = folder / f'{index:02d}.mp3', folder / f'{index:02d}.wav'
    async with semaphore:
        if not mp3.exists() or mp3.stat().st_size < 1000:
            print(f'TTS {take_id} {index:02d} {speaker} {voice} {rate}', flush=True)
            for attempt in range(6):
                try:
                    await edge_tts.Communicate(segment['text'], voice, rate=rate, pitch=pitch).save(str(mp3))
                    if mp3.stat().st_size >= 1000:
                        break
                except Exception:
                    mp3.unlink(missing_ok=True)
                    if attempt == 5:
                        raise
                    await asyncio.sleep(2.0 * (attempt + 1))
        run(FFMPEG, '-y', '-v', 'error', '-i', mp3, '-ar', SR, '-ac', 1, wav)


async def synthesize_all(rows: list[dict], plans: dict[str, list[dict]]) -> None:
    sys.path.insert(0, str(RUNTIME))
    import edge_tts
    semaphore = asyncio.Semaphore(2)
    jobs = []
    for row in rows:
        for index, segment in enumerate(plans[row['id']], 1):
            jobs.append(synthesize_segment(edge_tts, semaphore, row['id'], index, segment))
    await asyncio.gather(*jobs)


def polish(samples: np.ndarray) -> np.ndarray:
    # Gentle speech cleanup: remove rumble and brittle web-TTS edge, then add
    # a tiny amount of saturation. No reverb or pitch shifting is introduced.
    sos = butter(2, [70, 9800], btype='bandpass', fs=SR, output='sos')
    shaped = sosfiltfilt(sos, samples)
    return np.tanh(shaped * 1.035) / np.tanh(1.035)


def build_all(rows: list[dict], plans: dict[str, list[dict]]) -> list[dict]:
    OUT.mkdir(parents=True, exist_ok=True)
    report = []
    for row in rows:
        segments = plans[row['id']]
        parts = [np.zeros(int(.04 * SR))]
        for index, segment in enumerate(segments, 1):
            parts.append(read_wav(WORK / row['id'] / f'{index:02d}.wav'))
            if segment['gap']:
                parts.append(np.zeros(int(segment['gap'] * SR)))
        parts.append(np.zeros(int(.14 * SR)))
        samples, lufs, peak = normalize(polish(np.concatenate(parts)))
        wav = WORK / row['id'] / 'final.wav'
        mp3 = OUT / f"{row['id']}.mp3"
        write_wav(wav, samples)
        run(FFMPEG, '-y', '-v', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', mp3)
        duration = float(subprocess.check_output([
            str(FFPROBE), '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'csv=p=0', str(mp3)
        ], text=True).strip())
        speakers = list(dict.fromkeys(segment['speaker'] for segment in segments))
        report.append({
            'id': row['id'], 'speaker': ' / '.join(speakers), 'durationMs': round(duration * 1000),
            'lufs': round(lufs, 2), 'truePeakDb': round(peak, 2), 'segments': len(segments),
        })
        print(f"BUILT {row['id']} {duration:.2f}s", flush=True)
    return report


def write_outputs(report: list[dict]) -> None:
    lines = ['// Generated static takes. Do not edit durations by hand.', 'export const generatedTakes = {']
    for item in report:
        lines.append(
            f"  {item['id']}: {{ speaker: '{item['speaker']}', "
            f"src: './assets/audio/voices/{item['id']}.mp3?v=4', durationMs: {item['durationMs']} }},"
        )
    lines.extend(['}', ''])
    MANIFEST.write_text('\n'.join(lines), encoding='utf-8')
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')


if __name__ == '__main__':
    WORK.mkdir(exist_ok=True)
    rows = story_rows()
    plans = {row['id']: planned_segments(row) for row in rows}
    print(f'PLAN {len(rows)} takes / {sum(map(len, plans.values()))} segments', flush=True)
    asyncio.run(synthesize_all(rows, plans))
    report = build_all(rows, plans)
    write_outputs(report)
    print(f'DONE {len(report)} takes', flush=True)
