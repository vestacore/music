---
provenance:
  created: 2026-10-30T11:51:52+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: brief ("real sound, playback on macOS")
  model_role: wrote the tool and this guide
  revisions: []
---

# macOS instrument: `render.py`

Additive synthesis of harmonic partials to a WAV file, played through the macOS command-line player `afplay`. Pure Python standard library; NumPy is used when present but is not needed.

## Use

```bash
python3 tools/macos/render.py --notes A2 --partials 1,0.5,0.33,0.25,0.2 --seconds 4 --play
```

| Option | Meaning |
|---|---|
| `--notes A2,C#3,E3` | pitches by name, 12-tone equal temperament (`--a4` sets the reference, default 440 Hz) |
| `--f0 110 --ratios 1,5/4,3/2` | pitches as frequency ratios over a fundamental (just intonation, or any ratio you like) |
| `--partials 1,1/2,1/3` | amplitude of harmonic 1, 2, 3, … of every pitch; the default is 1/n for eight harmonics |
| `--attack --decay --sustain --release` | linear ADSR envelope in seconds and level |
| `--seconds`, `--sr`, `--gain` | length, sample rate (48 000), peak level after normalisation (0.5) |
| `--out out/name.wav` | where to write; default `out/render-<timestamp>.wav` |
| `--play` | play through `afplay` when done |
| `--quiet` | skip the harmonic report |

The harmonic report lists every partial with its frequency and the nearest equal-tempered note with the deviation in cents. Partials at or above the Nyquist frequency are dropped and said so.

## Why offline rendering

Rendering to a file first keeps the instrument dependency-free and makes every sound reproducible from its command line, which matters for provenance. A real-time engine is planned (see `docs/research-programme.md`, section 3).
