---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: brief, principles, direction, review
  model_role: structure, drafting, implementation
  revisions:
    - at: 2026-10-30T12:19:44+02:00
      model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
      steward_role: opened session 002 (Techno UI)
      model_role: added the Sessions table
---

# Vestacore Music

*A human–AI research studio for sound, harmony and light.*

This repository is an open notebook and toolkit. A human, **the Steward**, and an AI model study how harmony is put together by working with real sound: we render it, play it, listen, write down what we hear and what we derive, and keep an exact record of who did what and when. The work is published under a Creative Commons licence so that others can follow the path, reuse the tools and check the reasoning.

> Working title. The name follows the repository path (`vestacore/music`) and may change.

## Principles

1. **Real sound first.** Every idea should end in something audible. We write our own small programs for playback on macOS and in the browser rather than reasoning about notation alone.
2. **Study, do not copy.** Existing musical works are used only within their licence terms or for study, as a way of understanding how harmony is assembled. We never try to reproduce a composer's or author's intent, and no copyrighted audio or scores enter this repository.
3. **Many depths.** Some sessions play with the form of sound and avoid theory altogether; others look for harmonics through purely theoretical derivation. Each session declares its depth level up front (see [docs/session-levels.md](docs/session-levels.md)).
4. **Transparent authorship.** Every artefact records which model created it, exactly when, and what the Steward and the Model each contributed (see [PROVENANCE.md](PROVENANCE.md)).
5. **One written voice.** Everything in the repository is written in British English. Established terms are not translated; on first use they are entered in [GLOSSARY.md](GLOSSARY.md) with a brief explanation.

## Research directions

- **Harmony and harmonics.** How partials, intervals, tuning and voice movement create tension and release; heard first and then derived, or derived first and then heard.
- **Real-sound tooling.** Small, dependency-light instruments: an additive synthesiser for macOS and a Web Audio playground for the browser, growing as the study needs them.
- **Light dynamics.** Colour, brightness and movement of light coupled to the music, from a tinted page in the browser to room lighting and 3D scenes.
- **Dynamic AI interfaces.** Interfaces that reshape themselves around the musical moment instead of presenting fixed controls.
- **AI as frontman.** The Model as the visible performer and composer, with the human taking different positions: the **Director**, who steers through emotional feedback and imagery; the **Follower**, who is led into a musical contour the Model unfolds; and the **Duet**, where the lead passes back and forth.
- **VR, light and 3D.** Immersive settings where sound, light and space are composed together.

The directions are expanded in [docs/research-programme.md](docs/research-programme.md).

## Base style

Atmospheric electronic composition with a dynamic, saturated narrative: pieces that travel, with a plot, built from evolving timbres and harmonic tension rather than from loops alone. Other styles will follow; this is the starting ground.

## Repository layout

```
.
├── README.md                  this file
├── LICENCE                    CC BY 4.0 notice and attribution
├── CITATION.cff               how to cite
├── CLAUDE.md                  working rules for the model
├── GLOSSARY.md                untranslated terms, first use, one-line meanings
├── PROVENANCE.md              who, what, when for every artefact
├── Makefile                   convenience targets (make help)
├── docs/
│   ├── research-programme.md  directions, human positions, roadmap
│   ├── session-levels.md      depth levels L0 to L3
│   └── journal/               one entry per session
├── tools/
│   ├── macos/                 render.py: additive synthesis to WAV, playback with afplay
│   └── browser/               Harmonic Playground on the Web Audio API
├── session-<name>/            material of one session (for example session-techno-ui/)
└── out/                       rendered audio, not tracked
```

## Sessions

| Session | Where | Level | Position | What |
|---|---|---|---|---|
| 001 | [docs/journal/2026-10-30-s001-rigging.md](docs/journal/2026-10-30-s001-rigging.md) | infra | Director | the rig: documents, conventions, the two instruments |
| 002 | [session-techno-ui/](session-techno-ui/) | L2 | Director | the page as a techno track: a score and a shader demo driven by a synthesised loop |

## Getting started

### macOS: render and play a harmonic tone

Needs only Python 3 and the built-in `afplay`. NumPy is used automatically when installed but is not required.

```bash
python3 tools/macos/render.py --notes A2 --partials 1,0.5,0.33,0.25,0.2 --seconds 4 --play
```

A just-intonation major triad built from frequency ratios over 110 Hz:

```bash
python3 tools/macos/render.py --f0 110 --ratios 1,5/4,3/2 --partials 1,0.4,0.2 --seconds 6 --play
```

The script prints a harmonic report (each partial's frequency and nearest equal-tempered note) and writes a WAV file to `out/`. Details in [tools/macos/README.md](tools/macos/README.md).

### Browser: the Harmonic Playground

Open [tools/browser/index.html](tools/browser/index.html) in a modern browser, or serve it locally:

```bash
make serve
```

Press **Start**, move the fundamental, shape the first eight partials, and watch the page's light follow pitch and loudness. Details in [tools/browser/README.md](tools/browser/README.md).

### Convenience targets

```bash
make help
```

## Conventions

- **Language.** British English in every file, commit message and comment. Conversation with the Steward happens in whichever language the Steward uses.
- **Glossary.** A term kept untranslated is entered in `GLOSSARY.md` when first used, with the date and place of first use.
- **Provenance.** Markdown files carry a YAML provenance block; code and configuration carry a provenance header comment; `PROVENANCE.md` keeps the running log. Timestamps are ISO 8601 with offset.
- **Sessions.** Each working session gets a journal entry in `docs/journal/` naming its depth level and the human position. Material specific to a session lives in a root-level folder named `session-<name>/`.
- **Rendered audio** goes to `out/`, which git ignores, unless a render is curated into a session folder.

## Authorship and attribution

| Role | Who | Contribution |
|---|---|---|
| The Steward | Leonid (surname and GitHub handle to be confirmed before publication) | Vision, principles, direction, emotional and imagistic feedback, review, decisions |
| The Model | Claude Fable 5.1 (`claude-fable-5-1`), Anthropic | Structure, drafting, implementation and derivations, as recorded per artefact |

Each file states its own creators and their roles. Where a later model or version contributes, the file's revision list and `PROVENANCE.md` say so.

## Licence

This work is licensed under the [Creative Commons Attribution 4.0 International licence (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). You may share and adapt it for any purpose, provided you give appropriate credit, link to the licence and indicate any changes. See [LICENCE](LICENCE) for the notice and the attribution we ask for.

The licence covers text, sound, images and code alike. Creative Commons does not recommend its licences for software; the Steward chose a single licence deliberately so that every part of the research is credited the same way. This may be revisited.

## How to cite

See [CITATION.cff](CITATION.cff). In prose:

> Leonid (the Steward) and Claude Fable 5.1 (Anthropic). *Vestacore Music: a human–AI research studio for sound, harmony and light.* 2026. Licensed CC BY 4.0.
