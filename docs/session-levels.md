---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: asked for sessions of different depth, from no theory to pure theory
  model_role: defined the levels and what each records
  revisions: []
---

# Session depth levels

Every session declares how much theory it will use. The level is a promise about method, not about quality: a Level 0 session that produces a shiver is as valid as a Level 3 derivation.

| Level | Name | Method | What we record |
|---|---|---|---|
| L0 | Sound-form play | Shape sound by ear and feel. No theory, no names for intervals or chords while working. | The parameters touched, the Steward's words (emotions, images, sensations), the renders. |
| L1 | Listening and naming | Still ear-first, but afterwards we name what we heard (intervals, partials, consonance) and check the names against the sound. | The listening notes, the names, where ear and name disagreed. |
| L2 | Applied theory | Use theory to build (scales, chords, voice leading, spectral design), then verify by ear. | The construction, the rule used, the ear's verdict. |
| L3 | Theoretical derivation | Find harmonics and relations through derivation alone (ratios, series, tuning arithmetic, spectral analysis), then render and listen. | The derivation step by step, the render, what listening added or contradicted. |
| infra | Infrastructure | No musical study; building or repairing the rig. | What changed in the tools and conventions. |

Mixed sessions name all levels used, in order, for example `L3 → L1`.

## Declaring the level

In the journal entry's front matter:

```yaml
level: L0
human_position: Director
```

and in the session folder's README if there is one.

## Choosing a level

- To feel the material before knowing it: L0.
- To build vocabulary from experience: L1.
- With a specific sound in mind and a rough idea why: L2.
- To know why before hearing: L3.
