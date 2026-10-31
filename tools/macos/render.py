#!/usr/bin/env python3
"""render.py: additive synthesis of harmonic partials to a WAV file, with optional
playback through the macOS command-line player ``afplay``.

Pure standard library. NumPy is used automatically when it is installed (faster
for long renders) but is not required.

Examples
--------
A2 with the first five harmonics at 1/n amplitudes, four seconds, then play it::

    python3 tools/macos/render.py --notes A2 --partials 1,0.5,0.33,0.25,0.2 --seconds 4 --play

A just-intonation major triad as frequency ratios over 110 Hz::

    python3 tools/macos/render.py --f0 110 --ratios 1,5/4,3/2 --partials 1,0.4,0.2 --seconds 6 --play

An equal-tempered chord by note names with a slow envelope, written to a named file::

    python3 tools/macos/render.py --notes C3,G3,E4 --attack 1.5 --release 2 --out out/pad.wav

Provenance
----------
    created:     2026-10-30T11:51:52+02:00
    model:       Claude Fable 5.1 (claude-fable-5-1, Anthropic)
    steward:     Leonid: brief ("real sound, playback on macOS"), review
    model_role:  design and implementation
    revisions:   none yet

Licence: CC BY 4.0 (see LICENCE at the repository root).
"""
from __future__ import annotations

import argparse
import math
import platform
import shutil
import struct
import subprocess
import sys
import time
import wave
from fractions import Fraction
from pathlib import Path

try:  # optional accelerator
    import numpy as np
except ImportError:  # pragma: no cover
    np = None

A4_DEFAULT = 440.0
DEFAULT_PARTIALS = "1,1/2,1/3,1/4,1/5,1/6,1/7,1/8"
NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
SEMITONE_OF_LETTER = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}


# ------------------------------------------------------------------------------ pitch

def note_to_hz(name: str, a4: float = A4_DEFAULT) -> float:
    """Convert a note name such as ``A2``, ``C#4`` or ``Bb3`` to hertz (12-tone equal temperament)."""
    text = name.strip()
    if len(text) < 2 or text[0].upper() not in SEMITONE_OF_LETTER:
        raise ValueError(f"not a note name: {name!r}")
    letter, rest = text[0].upper(), text[1:]
    accidental = 0
    while rest and rest[0] in "#b♯♭":
        accidental += 1 if rest[0] in "#♯" else -1
        rest = rest[1:]
    try:
        octave = int(rest)
    except ValueError:
        raise ValueError(f"not a note name: {name!r}") from None
    semitones_from_a4 = SEMITONE_OF_LETTER[letter] + accidental + 12 * (octave - 4)
    return a4 * 2.0 ** (semitones_from_a4 / 12.0)


def describe_hz(hz: float, a4: float = A4_DEFAULT) -> str:
    """Nearest equal-tempered note and the deviation in cents, for example ``E4 -14c``."""
    semitones = 12.0 * math.log2(hz / a4)
    nearest = round(semitones)
    cents = (semitones - nearest) * 100.0
    name = NOTE_NAMES[(nearest + 9) % 12]
    octave = 4 + (nearest + 9) // 12
    return f"{name}{octave} {cents:+.0f}c"


def parse_numbers(text: str) -> list[float]:
    """Parse ``1,0.5,1/3`` into floats; plain fractions are allowed."""
    values: list[float] = []
    for item in text.split(","):
        item = item.strip()
        if item:
            values.append(float(Fraction(item)))
    return values


# --------------------------------------------------------------------------- envelope

def adsr(n: int, sr: int, attack: float, decay: float, sustain: float, release: float) -> list[float]:
    """A linear attack-decay-sustain-release envelope with exactly ``n`` samples."""
    a, d, r = (max(0, int(x * sr)) for x in (attack, decay, release))
    if a + d + r > n:  # squeeze proportionally into the available length
        scale = n / (a + d + r)
        a, d, r = int(a * scale), int(d * scale), int(r * scale)
    s = n - a - d - r
    env: list[float] = []
    env.extend(i / a for i in range(a))
    env.extend(1.0 + (sustain - 1.0) * i / d for i in range(d))
    env.extend([sustain] * s)
    env.extend(sustain * (1.0 - i / r) for i in range(r))
    return env


# ---------------------------------------------------------------------------- synthesis

def components(freqs: list[float], partials: list[float], sr: int) -> list[tuple[float, float]]:
    """Every (frequency, amplitude) sine to render, dropping anything at or above Nyquist."""
    nyquist = sr / 2.0
    out: list[tuple[float, float]] = []
    for f in freqs:
        for k, amp in enumerate(partials, start=1):
            if amp > 0 and f * k < nyquist:
                out.append((f * k, amp))
    return out


def render(comps: list[tuple[float, float]], env: list[float], sr: int, peak: float) -> list[float]:
    """Sum the sines, apply the envelope and normalise so that the loudest sample equals ``peak``."""
    n = len(env)
    if np is not None:
        t = np.arange(n, dtype=np.float64) / sr
        signal = np.zeros(n)
        for f, amp in comps:
            signal += amp * np.sin(2.0 * np.pi * f * t)
        signal *= np.asarray(env)
        top = float(np.max(np.abs(signal))) or 1.0
        return (signal * (peak / top)).tolist()
    signal = [0.0] * n
    for f, amp in comps:
        w = 2.0 * math.pi * f / sr
        signal = [s + amp * math.sin(w * i) for i, s in enumerate(signal)]
    signal = [s * e for s, e in zip(signal, env)]
    top = max(abs(s) for s in signal) or 1.0
    scale = peak / top
    return [s * scale for s in signal]


def write_wav(path: Path, samples: list[float], sr: int) -> None:
    """Write 16-bit mono PCM."""
    path.parent.mkdir(parents=True, exist_ok=True)
    ints = (int(max(-1.0, min(1.0, s)) * 32767) for s in samples)
    frames = struct.pack(f"<{len(samples)}h", *ints)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        wav.writeframes(frames)


def play(path: Path) -> int:
    """Play through afplay on macOS; elsewhere just say where the file is."""
    if platform.system() != "Darwin" or shutil.which("afplay") is None:
        print(f"afplay is not available here; open {path} with a player of your choice.", file=sys.stderr)
        return 1
    return subprocess.run(["afplay", str(path)], check=False).returncode


# --------------------------------------------------------------------------------- cli

def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        description="Additive synthesis of harmonic partials to WAV, with optional playback through afplay.",
        epilog="Pitch sources combine: --notes gives equal-tempered pitches, --ratios gives multiples of --f0.",
    )
    p.add_argument("--notes", help="comma-separated note names, e.g. A2 or C3,G3,E4 (12-tone equal temperament)")
    p.add_argument("--f0", type=float, help="fundamental in Hz for --ratios")
    p.add_argument("--ratios", help="comma-separated frequency ratios over --f0, e.g. 1,5/4,3/2")
    p.add_argument("--a4", type=float, default=A4_DEFAULT, help="reference pitch for note names (default 440)")
    p.add_argument("--partials", default=DEFAULT_PARTIALS,
                   help="amplitudes of harmonics 1,2,3,… of every pitch (default 1/n for eight)")
    p.add_argument("--seconds", type=float, default=4.0, help="length (default 4)")
    p.add_argument("--sr", type=int, default=48000, help="sample rate (default 48000)")
    p.add_argument("--attack", type=float, default=0.4, help="seconds (default 0.4)")
    p.add_argument("--decay", type=float, default=0.3, help="seconds (default 0.3)")
    p.add_argument("--sustain", type=float, default=0.8, help="level 0 to 1 (default 0.8)")
    p.add_argument("--release", type=float, default=0.8, help="seconds (default 0.8)")
    p.add_argument("--gain", type=float, default=0.5, help="peak amplitude 0 to 1 after normalisation (default 0.5)")
    p.add_argument("--out", help="output WAV path (default out/render-<timestamp>.wav)")
    p.add_argument("--play", action="store_true", help="play the result with afplay (macOS)")
    p.add_argument("--quiet", action="store_true", help="do not print the harmonic report")
    args = p.parse_args(argv)

    freqs: list[float] = []
    if args.notes:
        freqs += [note_to_hz(n, args.a4) for n in args.notes.split(",") if n.strip()]
    if args.ratios:
        if args.f0 is None:
            p.error("--ratios needs --f0")
        freqs += [args.f0 * r for r in parse_numbers(args.ratios)]
    if not freqs:
        freqs = [note_to_hz("A2", args.a4)]
    partials = parse_numbers(args.partials)
    if not partials:
        p.error("--partials must list at least one amplitude")
    if args.seconds <= 0 or args.sr <= 0:
        p.error("--seconds and --sr must be positive")

    n = int(args.seconds * args.sr)
    env = adsr(n, args.sr, args.attack, args.decay, args.sustain, args.release)
    comps = components(freqs, partials, args.sr)
    started = time.perf_counter()
    samples = render(comps, env, args.sr, max(0.0, min(1.0, args.gain)))
    elapsed = time.perf_counter() - started
    out = Path(args.out) if args.out else Path("out") / f"render-{time.strftime('%Y%m%d-%H%M%S')}.wav"
    write_wav(out, samples, args.sr)

    if not args.quiet:
        engine = "NumPy" if np is not None else "pure Python"
        print(f"Harmonic report  (A4 = {args.a4:g} Hz, {args.sr} Hz, {args.seconds:g} s, {engine}, {elapsed:.2f} s)")
        for f in freqs:
            print(f"  fundamental {f:10.3f} Hz   {describe_hz(f, args.a4)}")
            for k, amp in enumerate(partials, start=1):
                if amp <= 0:
                    continue
                fk = f * k
                note = describe_hz(fk, args.a4) if fk < args.sr / 2 else "at or above Nyquist, dropped"
                print(f"    partial {k:2d}  {fk:10.3f} Hz   amp {amp:5.3f}   {note}")
        print(f"Wrote {out}  ({len(samples)} samples, 16-bit mono PCM)")
    if args.play:
        return play(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
