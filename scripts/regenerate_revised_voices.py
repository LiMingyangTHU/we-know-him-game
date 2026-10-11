"""Regenerate only changed story takes, preserving all approved older recordings."""
from __future__ import annotations

import asyncio
import json
import re
from pathlib import Path

import generate_all_voices as voices

TAKE_IDS = {
    'q06a', 'q06a_early', 'q06b_early', 'q08b', 'q10intro',
    'q10a', 'q10b', 'm01', 'q11intro', 'q11a', 'q11a_anon',
}


def main() -> None:
    voices.WORK = voices.ROOT / '.voice-work-revision-v1'
    voices.WORK.mkdir(exist_ok=True)
    rows = [row for row in voices.story_rows() if row['id'] in TAKE_IDS]
    missing = TAKE_IDS - {row['id'] for row in rows}
    if missing:
        raise RuntimeError(f'No voiced story nodes for: {sorted(missing)}')
    plans = {row['id']: voices.planned_segments(row) for row in rows}
    asyncio.run(voices.synthesize_all(rows, plans))
    report = voices.build_all(rows, plans)

    manifest = voices.MANIFEST.read_text(encoding='utf-8')
    for item in report:
        take_id = item['id']
        line = (
            f"  {take_id}: {{ speaker: '{item['speaker']}', "
            f"src: './assets/audio/voices/{take_id}.mp3?v=9', "
            f"durationMs: {item['durationMs']} }},"
        )
        pattern = rf'^  {re.escape(take_id)}: .*,$'
        if re.search(pattern, manifest, flags=re.MULTILINE):
            manifest = re.sub(pattern, lambda _: line, manifest, count=1, flags=re.MULTILINE)
        else:
            manifest = manifest.replace('\n}', f'\n{line}\n}}', 1)
    voices.MANIFEST.write_text(manifest, encoding='utf-8')

    prior = json.loads(voices.REPORT.read_text(encoding='utf-8'))
    updated = {item['id']: item for item in report}
    merged = [updated.pop(item['id'], item) for item in prior]
    merged.extend(updated.values())
    voices.REPORT.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Regenerated {len(report)} changed takes.')


if __name__ == '__main__':
    main()
