---
session: 002
title: Techno UI
date: 2026-10-30
level: L2
human_position: Director
provenance:
  created: 2026-10-30T12:15:39+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: created the folder; brought the base (a track-to-page mapping from the Steward's portal spec) and asked for it to be developed into a techno image with shader backing
  model_role: developed the image into a score, built the audio engine and the shader demo, tested them
  revisions: []
---

# Session 002: Techno UI

**Level** L2, applied theory: rules of musical form are used to build, then checked by eye and ear. **Human position** Director: the Steward sets the image and judges it. **Date** 2026-10-30.

## The brief

In this folder we experiment with a visual, shader-backed musical image for an interface. The Steward brought a base: a mapping between a music track and a page, taken from the Steward's own portal specification (its section 9, "Page score"). In the base the beat is the 8 px unit of all spacing, the bar (32 px) separates sections, the phrase (64 px) separates the large parts of a page; four layers (lead, bass, hat, pad) sort every element by how loud it may be; sidechain, masking, breakdown, progressive layering and swing become rules; budgets and gates make the rules checkable; five page templates (action, analysis, reference, table, form) each take a track form.

The task: take the base and develop it into a **techno image**, with visual shader backing.

## What is here

| Path | What |
|---|---|
| [techno-score.md](techno-score.md) | the image in words: why techno, the grid, the layers, the dynamics, the track forms, the shader mapping, open points |
| [shader/index.html](shader/index.html) | the demo page: controls, legend, the two shaders |
| [shader/techno.js](shader/techno.js) | the synthesised techno track (kick, hats, bass, pad, lead) on a lookahead scheduler, the page layout, the live gates, the uniform bridge |

The demo draws an **Action** page with a fragment shader on the beat grid while a thirty-two-bar techno loop at 128 beats per minute plays. Every visual change is driven by the audio scheduler: the kick pulses the grid and ducks every block except the decision, the bass lights the rows, the hats flicker the meta, the pad breathes in the right column, the lead glows on the one decision button. Four gates from the base (beat grid, one lead, masking, budget) run live over the layout. A **clash** switch deliberately breaks two of them.

## Run

Open `shader/index.html` directly, or serve it:

```bash
make serve-techno
```

then visit http://localhost:8766 and press **Start** (browsers need a gesture before sound). In Claude Code the same server is the `techno-ui` preview in `.claude/launch.json`. Desktop only; it needs WebGL.

## Status

Built and tested on 2026-10-30; the journal entry [docs/journal/2026-10-30-s002-techno-ui.md](../docs/journal/2026-10-30-s002-techno-ui.md) records what was heard and seen. The Steward's judgement of the image, in the Director position, is the next step.
