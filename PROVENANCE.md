---
provenance:
  created: 2026-10-30T11:53:53+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: requirement that every aspect of the research names its model, its time and both roles
  model_role: defined the formats and keeps the log
  revisions:
    - at: 2026-10-30T12:19:44+02:00
      model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
      steward_role: attribution requirement
      model_role: added the rows of session 002
---

# Provenance

Every artefact in this repository says which model or person made it, exactly when, and in which role. This file defines the formats and keeps the running log. The Steward is the human partner; the Model is the AI partner, always named with its exact model ID.

## Formats

### Markdown

YAML front matter at the top of the file:

```yaml
---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: brief, direction, review
  model_role: structure, drafting, implementation
  revisions: []
---
```

### Code, configuration and scripts

A header comment in the file's own comment syntax with the same fields:

```text
Provenance
  created:     2026-10-30T11:51:52+02:00
  model:       Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward:     Leonid: brief, review
  model_role:  design and implementation
  revisions:   none yet
```

Files whose format allows no comments (JSON) are attributed in the log below only.

### Revisions

Every later change appends an entry to the file's `revisions` list and a row to the log:

```yaml
revisions:
  - at: 2026-11-03T10:12:00+02:00
    model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
    steward_role: asked for a slower attack
    model_role: changed the default envelope
```

### Rules

- Timestamps are ISO 8601 with offset, to the second, in the Steward's local time.
- The model is named in full with the ID its maker publishes. A different model or version names itself.
- Roles are a few words describing what was actually done, not titles.
- A curated render is accompanied by the command line that produced it.
- Human-made artefacts are logged too, with the Model's role given as none.

## Log

| Created | Artefact | Made by | Steward role | Model role | Note |
|---|---|---|---|---|---|
| 2026-10-30T11:23:19+02:00 | `session-techno-ui/` | the Steward | created the folder before the brief | none | first session folder; contents pending |
| 2026-10-30T11:49:25+02:00 | `README.md` | Claude Fable 5.1 (claude-fable-5-1) | brief, principles, direction, review | structure, drafting | project overview, conventions, licence, attribution |
| 2026-10-30T11:49:25+02:00 | `LICENCE` | Claude Fable 5.1 (claude-fable-5-1) | licence choice, attribution requirement | wording | CC BY 4.0 notice |
| 2026-10-30T11:49:25+02:00 | `CLAUDE.md` | Claude Fable 5.1 (claude-fable-5-1) | set the rules in the brief | wrote them as working instructions | rules for the model |
| 2026-10-30T11:49:25+02:00 | `CITATION.cff` | Claude Fable 5.1 (claude-fable-5-1) | attribution requirement | drafting | citation metadata; names to be completed |
| 2026-10-30T11:53:53+02:00 | `.gitignore` | Claude Fable 5.1 (claude-fable-5-1) | brief | implementation | ignores out/, caches, local settings |
| 2026-10-30T11:49:25+02:00 | `.claude/launch.json` | Claude Fable 5.1 (claude-fable-5-1) | brief | implementation | browser preview server; JSON, attributed here only |
| 2026-10-30T11:49:25+02:00 | `GLOSSARY.md` | Claude Fable 5.1 (claude-fable-5-1) | rule: record and explain terms at first use | compiled the entries | untranslated terms |
| 2026-10-30T11:49:25+02:00 | `docs/research-programme.md` | Claude Fable 5.1 (claude-fable-5-1) | set every direction | organised them into a programme | directions, positions, roadmap |
| 2026-10-30T11:49:25+02:00 | `docs/session-levels.md` | Claude Fable 5.1 (claude-fable-5-1) | asked for sessions of different depth | defined the levels | L0 to L3 and infra |
| 2026-10-30T11:49:25+02:00 | `docs/journal/README.md` | Claude Fable 5.1 (claude-fable-5-1) | attribution requirement | designed the journal format | journal template |
| 2026-10-30T11:49:25+02:00 | `docs/journal/2026-10-30-s001-rigging.md` | Claude Fable 5.1 (claude-fable-5-1) | opening brief, decisions on roles and naming | built and tested the rig, wrote the entry | session 001 |
| 2026-10-30T11:51:52+02:00 | `tools/macos/render.py` | Claude Fable 5.1 (claude-fable-5-1) | brief: real sound on macOS | design and implementation | additive synthesis to WAV, afplay |
| 2026-10-30T11:51:52+02:00 | `tools/macos/README.md` | Claude Fable 5.1 (claude-fable-5-1) | brief | wrote the guide | usage of render.py |
| 2026-10-30T11:51:52+02:00 | `tools/browser/index.html` | Claude Fable 5.1 (claude-fable-5-1) | brief: real sound in the browser, light with music | design and implementation | Harmonic Playground page |
| 2026-10-30T11:51:52+02:00 | `tools/browser/playground.js` | Claude Fable 5.1 (claude-fable-5-1) | brief: real sound in the browser, light with music | design and implementation | Web Audio graph, scope, light |
| 2026-10-30T11:51:52+02:00 | `tools/browser/README.md` | Claude Fable 5.1 (claude-fable-5-1) | brief | wrote the guide | usage of the playground |
| 2026-10-30T11:51:52+02:00 | `Makefile` | Claude Fable 5.1 (claude-fable-5-1) | brief | implementation | tone, chord, series, web, serve, check, clean |
| 2026-10-30T11:53:53+02:00 | `PROVENANCE.md` | Claude Fable 5.1 (claude-fable-5-1) | attribution requirement | formats and log | this file |
| 2026-10-30T12:15:39+02:00 | `session-techno-ui/README.md` | Claude Fable 5.1 (claude-fable-5-1) | created the folder; session 002 brief: the base and "a techno image with shader backing" | wrote the session brief | session 002 |
| 2026-10-30T12:15:39+02:00 | `session-techno-ui/techno-score.md` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief: the base and "a techno image with shader backing" | developed the image into a score | the techno image in words, tokens and gates |
| 2026-10-30T12:15:39+02:00 | `session-techno-ui/shader/index.html` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief: the base and "a techno image with shader backing" | design and implementation | demo page, controls, vertex and fragment shaders |
| 2026-10-30T12:15:39+02:00 | `session-techno-ui/shader/techno.js` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief: the base and "a techno image with shader backing" | design and implementation | synthesised techno engine, layout, gates, uniform bridge |
| 2026-10-30T12:19:44+02:00 | `docs/journal/2026-10-30-s002-techno-ui.md` | Claude Fable 5.1 (claude-fable-5-1) | brief, decisions | built and tested, wrote the entry | session 002 journal |
| 2026-10-30T12:19:44+02:00 | `Makefile` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief | revision: techno and serve-techno targets | revision |
| 2026-10-30T12:19:44+02:00 | `.claude/launch.json` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief | revision: techno-ui preview on port 8766 | revision; JSON, attributed here only |
| 2026-10-30T12:19:44+02:00 | `GLOSSARY.md` | Claude Fable 5.1 (claude-fable-5-1) | session 002 brief | revision: 41 terms added | revision |
| 2026-10-30T12:19:44+02:00 | `README.md` | Claude Fable 5.1 (claude-fable-5-1) | opened session 002 | revision: Sessions table | revision |
| 2026-10-30T12:19:44+02:00 | `PROVENANCE.md` | Claude Fable 5.1 (claude-fable-5-1) | attribution requirement | revision: rows for session 002 | revision |
