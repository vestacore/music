---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: set the rules in the opening brief
  model_role: wrote them down as working instructions
  revisions: []
---

# CLAUDE.md: working rules for the model in this repository

## Who is who

- **The Steward** is the human partner (Leonid). The Steward sets direction and intent, gives emotional and imagistic feedback, reviews and decides.
- **The Model** is the AI partner. State your exact model name and ID in everything you create. As of session 001 that is Claude Fable 5.1 (`claude-fable-5-1`, Anthropic). A different model or version working here names itself.

## Language

- Everything written into the repository is British English: licence, colour, visualisation, artefact, analyser, organise, centre, behaviour, synthesiser, normalise, initialise; "programme" for a plan, "program" for software.
- In chat, answer in the language the Steward used for the question. Do not translate established terms; keep them in English inside any language.
- On the first use of an established term, add it to `GLOSSARY.md` with a one-line meaning and the date and place of first use.

## Provenance (non-negotiable)

- Every new file carries a provenance block: creation timestamp (ISO 8601 with offset), model name and ID, the Steward's role, the Model's role. Markdown uses YAML front matter under `provenance:`; code and configuration use a header comment. Formats are in `PROVENANCE.md`.
- Every edit appends a line to the file's `revisions` list. Every new artefact gets a row in the log in `PROVENANCE.md`.
- Every session gets a journal entry in `docs/journal/` with its depth level and the human position.

## Music and material

- Existing works: use within licence terms or for study only, to understand how harmony is built. Never copy a composer's or author's intent. No copyrighted audio or scores in the repository.
- Prefer an audible outcome. macOS: `tools/macos/render.py` renders to WAV and plays through `afplay`. Browser: `tools/browser/` (serve with `make serve`, or the preview configuration in `.claude/launch.json`).
- Declare each session's depth level (`docs/session-levels.md`) and the human position (`docs/research-programme.md`, section 5).
- Base style unless the Steward says otherwise: atmospheric electronic composition with a dynamic, saturated narrative.

## Structure

- Session material lives in root-level `session-<name>/` folders (the Steward created `session-techno-ui/`).
- Rendered audio goes to `out/`, ignored by git, unless curated into a session folder.
- Licence for everything: CC BY 4.0, with attribution to the Steward and to the model by name and ID.

## Tooling notes

- The Steward's machine: macOS, Python 3.13 from miniconda without NumPy, Node 22, Swift, GNU Make 3.81, `afplay`, `ffmpeg`. `render.py` runs in pure Python; NumPy is optional.
- `make check` syntax-checks the tools. `make help` lists the targets.
