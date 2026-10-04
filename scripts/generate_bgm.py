"""Generate four original, loop-friendly underscore tracks for the web game."""
from pathlib import Path
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'audio'
OUT.mkdir(parents=True, exist_ok=True)
SR, DURATION = 32000, 32.0
N = int(SR * DURATION)
T = np.arange(N) / SR
RNG = np.random.default_rng(20261004)

def tone(freq, phase=0.0):
    freq = round(freq * DURATION) / DURATION
    return np.sin(2 * np.pi * freq * T + phase)

def circular_decay(start, decay=2.4):
    d = (T - start) % DURATION
    return np.exp(-d / decay) * (d < min(decay * 5, DURATION))

def soft_note(freq, start, level=1.0, decay=2.2):
    d = (T - start) % DURATION
    attack = np.minimum(d / 0.025, 1.0)
    body = tone(freq) + .38 * tone(freq * 2, .4) + .12 * tone(freq * 3, 1.1)
    return level * circular_decay(start, decay) * attack * body

def smooth_noise(width=1200):
    noise = RNG.normal(0, 1, N)
    kernel = np.hanning(width); kernel /= kernel.sum()
    return np.convolve(noise, kernel, mode='same')

def compose(kind):
    configs = {
        'inquiry': ([55.0, 65.41, 73.42], .65, .75, [(220,0),(261.63,4),(246.94,8),(196,12),(220,16),(293.66,20),(246.94,24),(196,28)]),
        'pressure': ([49.0, 58.27, 65.41], .9, .5, [(196,0),(207.65,4),(174.61,8),(155.56,12),(196,16),(233.08,20),(174.61,24),(146.83,28)]),
        'truth': ([55.0, 73.42, 82.41], .72, .82, [(220,0),(277.18,4),(329.63,8),(246.94,12),(220,16),(293.66,20),(369.99,24),(329.63,28)]),
        'aftermath': ([65.41, 82.41, 98.0], .5, .9, [(261.63,0),(329.63,4),(392,8),(293.66,12),(261.63,16),(349.23,20),(392,24),(329.63,28)])
    }
    roots, pulse, brightness, notes = configs[kind]
    left = sum(.11 * tone(f, i * .7) for i, f in enumerate(roots))
    right = sum(.11 * tone(f, i * .7 + .3) for i, f in enumerate(roots))
    for i, (freq, start) in enumerate(notes):
        note = soft_note(freq, start, .11 * brightness, 2.0 if kind == 'pressure' else 2.7)
        if i % 2: left += note * .72; right += note
        else: left += note; right += note * .72
    for start in np.arange(0, DURATION, 2.0):
        d = (T - start) % DURATION
        tick = np.exp(-d / .055) * np.sin(2 * np.pi * 1150 * d) * (d < .22)
        left += .010 * pulse * tick; right += .008 * pulse * tick
    air = smooth_noise(); air /= max(np.max(np.abs(air)), 1e-9)
    left += .012 * air; right += .012 * np.roll(air, 341)
    stereo = np.column_stack((left, right)); stereo -= stereo.mean(axis=0)
    stereo *= .72 / max(np.max(np.abs(stereo)), 1e-9)
    ramp = np.linspace(0, 1, 160)
    stereo[:160] *= ramp[:, None]; stereo[-160:] *= ramp[::-1, None]
    return (stereo * 32767).astype('<i2')

def write_track(name):
    wav_path, mp3_path = OUT / f'bgm-{name}.wav', OUT / f'bgm-{name}.mp3'
    with wave.open(str(wav_path), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(compose(name).tobytes())
    subprocess.run([r'D:\Python\Scripts\ffmpeg.exe', '-y', '-loglevel', 'error', '-i', str(wav_path), '-codec:a', 'libmp3lame', '-b:a', '96k', str(mp3_path)], check=True)
    wav_path.unlink(); print(mp3_path.name, mp3_path.stat().st_size)

if __name__ == '__main__':
    for track in ('inquiry', 'pressure', 'truth', 'aftermath'): write_track(track)
