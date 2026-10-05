"""Generate reviewed static voice takes for act 1 with Edge neural TTS."""
from __future__ import annotations

import asyncio
import json
import math
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter1d
from scipy.signal import lfilter, resample_poly

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT.parents[1] / '角色自然化_第三版' / '_tts_runtime'
FFMPEG = Path(r'D:\Python\Scripts\ffmpeg.exe')
FFPROBE = Path(r'D:\Python\Scripts\ffprobe.exe')
OUT = ROOT / 'assets' / 'audio' / 'voices'
WORK = ROOT / '.voice-work-act1'
MANIFEST = ROOT / 'src' / 'data' / 'generated-voice-takes.js'
REPORT = ROOT / 'assets' / 'audio' / 'act1-voice-report.json'
SR = 24_000

TAKES = {
    'a01': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('导出进度停在87%。', '+3%', .24),
        ('我正要重启软件，手机在桌边亮了一下。', '+3%', .34),
        ('陌生新生发来的封面，正是我4个月前剪过的那条片子。', '+1%', 0),
    ]),
    'a01b': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('头像没见过。', '+4%', .24),
        ('对方发来的封面，我却一眼认出——那是我5月拍的片子，只是标题变了。', '+2%', 0),
    ]),
    'a02': ('梁一舟', 'zh-CN-YunjianNeural', [
        ('学姐，能帮我看看是真的吗？', '+6%', .25),
        ('他们说今晚零点锁本批名额，校友推荐价2800元。', '+5%', 0),
    ]),
    'a02b': ('梁一舟', 'zh-CN-YunjianNeural', [
        ('我已经填到最后一步了。', '+5%', .23),
        ('室友说名额过点就没，可我越看，越觉得哪里不对。', '+3%', 0),
    ]),
    'a03': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('我翻回群公告，才理清两件事。', '+4%', .23),
        ('第1期实习，是春季举办的免费线下项目。有学生真正到岗，也收到了恒微科技发放的工资。', '+4%', .28),
        ('第2期实习招募，是6月以后才出现的收费项目。要先交2800元名额费。', '+4%', .28),
        ('现在，群里把第1期实习的旧片改名，放在第2期实习付款页旁边。', '+3%', .25),
        ('却没有说明，新项目是否仍由原企业授权。', '+1%', 0),
    ]),
    'a04': ('梁一舟', 'zh-CN-YunjianNeural', [
        ('我不是信这张广告图，我是信你当时拍到的工资。', '+5%', .24),
        ('群里还转了沈舟学长的宣讲视频——就是5月论坛里，回答技术问题的那位校友。', '+4%', .28),
        ('那次出镜，也是他本人吧？', '+2%', 0),
    ]),
    'a05': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('片子是我拍的。先别付钱。', '+5%', .2),
        ('把报名页从头到尾录下来，给我几个小时。', '+4%', 0),
    ]),
    'a06': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('镜头里的工资和讲座都是真的，但它们只能证明，第1期实习发生过。', '+3%', .26),
        ('第2期实习招募，是一个新的收费项目。', '+3%', .22),
        ('在企业确认之前，旧片不能替它证明，岗位和授权真实存在。', '+1%', 0),
    ]),
    'q01': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('梁一舟说，第2期实习的早鸟批次，今晚零点截止。', '+4%', .24),
        ('我手里的旧片，只能证明第1期实习发过工资。现在，应该怎么做？', '+2%', 0),
    ]),
    'b1a': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('临时提醒已发布。', '+5%', .18),
        ('旧片已注明，本片仅记录第1期实习。材料也已经报送校方。', '+4%', .23),
        ('梁一舟回复了，退出付款页的截图。', '+2%', 0),
    ]),
    'b1a2': ('周衡', 'zh-CN-YunyangNeural', [
        ('媒体博眼球而已。', '+1%', 0),
    ]),
    'b1a3': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('梁一舟暂时安全了，但收费页，仍在群里传播。', '+3%', .25),
        ('就在这时，宋岚老师来电，也问起片中的沈舟。', '+2%', .3),
        ('同一条旧片，正把我带向另一笔，更大的钱。', '+0%', 0),
    ]),
    'b1b': ('林知夏', 'zh-CN-XiaoxiaoNeural', [
        ('完整报名页、宣讲视频和收款户名，已经保存。', '+4%', .22),
        ('梁一舟暂时没有付款。', '+3%', .22),
        ('录屏刚结束，宋岚老师来电，也问起片中的沈舟——这次牵涉的金额，是13.8万元。', '+1%', 0),
    ]),
}


def run(*args) -> None:
    subprocess.run([str(x) for x in args], check=True)


async def synth_one(edge_tts, text: str, voice: str, rate: str, path: Path) -> None:
    for attempt in range(3):
        try:
            pitch = '-2Hz' if voice in {'zh-CN-YunjianNeural', 'zh-CN-YunyangNeural'} else '+0Hz'
            await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(path))
            if path.stat().st_size > 1000:
                return
        except Exception:
            path.unlink(missing_ok=True)
            if attempt == 2:
                raise
            await asyncio.sleep(1.5 * (attempt + 1))


async def synthesize_all() -> None:
    sys.path.insert(0, str(RUNTIME))
    import edge_tts
    for take_id, (_, voice, segments) in TAKES.items():
        folder = WORK / take_id
        folder.mkdir(parents=True, exist_ok=True)
        for index, (text, rate, _) in enumerate(segments, 1):
            mp3, wav = folder / f'{index:02d}.mp3', folder / f'{index:02d}.wav'
            if not mp3.exists() or mp3.stat().st_size <= 1000:
                print(f'TTS {take_id} {index}/{len(segments)} {voice} {rate}', flush=True)
                await synth_one(edge_tts, text, voice, rate, mp3)
            run(FFMPEG, '-y', '-v', 'error', '-i', mp3, '-ar', SR, '-ac', 1, wav)


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path), 'rb') as handle:
        assert handle.getframerate() == SR and handle.getnchannels() == 1
        return np.frombuffer(handle.readframes(handle.getnframes()), dtype='<i2').astype(np.float64) / 32768


def write_wav(path: Path, samples: np.ndarray) -> None:
    pcm = (np.clip(samples, -1, 1) * 32767).astype('<i2')
    with wave.open(str(path), 'wb') as handle:
        handle.setnchannels(1); handle.setsampwidth(2); handle.setframerate(SR)
        handle.writeframes(pcm.tobytes())


def integrated_lufs(samples: np.ndarray) -> float:
    x = resample_poly(samples, 2, 1)
    x = lfilter([1.53512486, -2.69169619, 1.19839281], [1, -1.69065929, .73248077], x)
    x = lfilter([1, -2, 1], [1, -1.99004745, .99007225], x)
    block, hop = 19_200, 4_800
    energies = np.array([np.mean(x[i:i+block] ** 2) for i in range(0, max(1, len(x)-block+1), hop)])
    loudness = -.691 + 10*np.log10(np.maximum(energies, 1e-15))
    absolute = energies[loudness > -70]
    if not len(absolute): return -70
    gate = -.691 + 10*math.log10(float(np.mean(absolute))) - 10
    gated = energies[(loudness > -70) & (loudness > gate)]
    return -.691 + 10*math.log10(float(np.mean(gated)))


def lookahead_limit(samples: np.ndarray, ceiling: float) -> np.ndarray:
    envelope = maximum_filter1d(np.abs(samples), size=max(3, int(.008*SR)), mode='nearest')
    desired = np.minimum(1, ceiling / np.maximum(envelope, 1e-9))
    gain = np.empty_like(desired)
    current, release = 1.0, math.exp(-1/(.08*SR))
    for index, value in enumerate(desired):
        current = value if value < current else release*current + (1-release)*value
        gain[index] = current
    return samples * gain


def normalize(samples: np.ndarray) -> tuple[np.ndarray, float, float]:
    target, ceiling = -16.0, 10**(-1.5/20)
    result = samples.copy()
    for _ in range(3):
        result *= 10**((target-integrated_lufs(result))/20)
        result = lookahead_limit(result, ceiling*.985)
    peak = float(np.max(np.abs(resample_poly(result, 4, 1))))
    if peak > ceiling: result *= ceiling/peak
    return result, integrated_lufs(result), 20*math.log10(max(float(np.max(np.abs(resample_poly(result,4,1)))),1e-12))


def build_takes() -> list[dict]:
    OUT.mkdir(parents=True, exist_ok=True)
    report = []
    for take_id, (speaker, voice, segments) in TAKES.items():
        parts = [np.zeros(int(.09*SR))]
        for index, (_, _, gap) in enumerate(segments, 1):
            parts.append(read_wav(WORK/take_id/f'{index:02d}.wav'))
            if gap: parts.append(np.zeros(int(gap*SR)))
        parts.append(np.zeros(int(.24*SR)))
        normalized, lufs, peak = normalize(np.concatenate(parts))
        wav, mp3 = WORK/take_id/'final.wav', OUT/f'{take_id}.mp3'
        write_wav(wav, normalized)
        run(FFMPEG, '-y', '-v', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', mp3)
        duration = float(subprocess.check_output([str(FFPROBE), '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)], text=True).strip())
        report.append({'id': take_id, 'speaker': speaker, 'voice': voice, 'durationMs': round(duration*1000), 'lufs': round(lufs,2), 'truePeakDb': round(peak,2), 'segments': len(segments)})
        print(f'BUILT {take_id} {duration:.2f}s {lufs:.2f} LUFS {peak:.2f} dBTP', flush=True)
    return report


def write_manifest(report: list[dict]) -> None:
    lines = ['// Generated static takes. Do not edit durations by hand.', 'export const generatedTakes = {']
    for item in report:
        revision = '?v=2' if item['id'] in {'a02', 'a02b', 'a04'} else ''
        lines.append(f"  {item['id']}: {{ speaker: '{item['speaker']}', src: './assets/audio/voices/{item['id']}.mp3{revision}', durationMs: {item['durationMs']} }},")
    lines += ['}', '']
    MANIFEST.write_text('\n'.join(lines), encoding='utf-8')
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')


if __name__ == '__main__':
    WORK.mkdir(exist_ok=True)
    asyncio.run(synthesize_all())
    write_manifest(build_takes())
