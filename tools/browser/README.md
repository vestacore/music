---
provenance:
  created: 2026-10-30T11:51:52+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: brief ("real sound in the browser", light dynamics coupled to music)
  model_role: wrote the playground and this guide
  revisions: []
---

# Browser instrument: the Harmonic Playground

A single page on the Web Audio API, no build step and no dependencies. Eight sine partials over one fundamental, presets, a slow "breathe" drift, a convolution space, a spectrum and waveform scope, and the page's light coupled to the music: hue follows the pitch class of the fundamental, brightness follows loudness.

## Run

Open `tools/browser/index.html` directly in a modern browser, or serve the folder:

```bash
make serve
```

then visit http://localhost:8765. In Claude Code the same server is the `browser-playground` preview in `.claude/launch.json`.

## Controls

| Control | Effect |
|---|---|
| Start / Stop, or <kbd>Space</kbd> | creates the AudioContext on first use (browsers need a gesture), then pauses and resumes |
| f0 slider, <kbd>↑</kbd> <kbd>↓</kbd> | fundamental from A0 (27.5 Hz) to A6 (1760 Hz); arrows step a semitone, with <kbd>Shift</kbd> an octave |
| partial rows, keys <kbd>1</kbd> to <kbd>8</kbd> | amplitude of each harmonic and an on/off toggle; the readout shows each partial's frequency and nearest equal-tempered note with the deviation in cents |
| presets | sine, one over n, odd only, warm, glassy |
| breathe | slow independent drift of the partial levels, periods of 10 to 25 seconds |
| space | mix of a synthetic convolution reverb |
| master | output level; a limiter sits after it for ear safety |

## Signal path

partials → sum (normalised to unity) → dry and convolution space → master → limiter → analyser → output.

## Light

The first coupling of light to music in this project, deliberately crude: pitch class to hue, RMS loudness to brightness. The research programme (section 6) says where it goes next.
