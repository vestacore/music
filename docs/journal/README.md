---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: requirement that every aspect of the research is dated and attributed
  model_role: designed the journal format
  revisions: []
---

# Session journal

One entry per working session, named `YYYY-MM-DD-sNNN-<slug>.md`. The Model writes the entry during or right after the session; the Steward reviews it. Entries are never rewritten after review; corrections are appended under "Revisions".

## Template

```markdown
---
session: 002
title: <short title>
date: YYYY-MM-DD
level: L0 | L1 | L2 | L3 | infra | mixed such as "L3 → L1"
human_position: Director | Follower | Duet | none
provenance:
  created: <ISO 8601 with offset>
  model: <model name (model ID, maker)>
  steward: <name>
  steward_role: <what the Steward did in this session>
  model_role: <what the Model did in this session>
  revisions: []
---

# Session NNN: <title>

## Intent
## What happened
## What we heard
## What we derived
## The Steward's words and the Model's changes   (side by side, when the position is Director or Duet)
## Decisions
## Artefacts   (files, renders, with paths)
## Next
```
