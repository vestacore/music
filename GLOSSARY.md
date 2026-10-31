---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: rule that untranslated terms are recorded and explained at first use
  model_role: compiled the entries
  revisions:
    - at: 2026-10-30T12:19:44+02:00
      model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
      steward_role: session 002 brief
      model_role: added 41 terms of the techno image and the shader
---

# Glossary

Established terms are not translated. Each is entered here on first use with a one-line meaning and where it first appeared. Keep the list alphabetical. "s001" means session 001 (see `docs/journal/`).

| Term | Meaning | First used |
|---|---|---|
| additive synthesis | Building a sound by adding sine waves (partials) of chosen frequencies and amplitudes. | 2026-10-30 · s001 · `tools/macos/render.py` |
| ADSR envelope | Attack, decay, sustain, release: the shape of a note's loudness over time. | 2026-10-30 · s001 · `tools/macos/render.py` |
| afplay | The command-line audio player built into macOS; our default playback path. | 2026-10-30 · s001 · `tools/macos/render.py` |
| AudioContext | The Web Audio API object that owns the audio graph and its clock in the browser. | 2026-10-30 · s001 · `tools/browser/playground.js` |
| bar | Four beats, one cycle of the kick pattern; on the page the 32 px gap between sections. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| beat | The basic pulse; in techno the kick on every beat; on the page the 8 px unit of all spacing. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| beating (acoustic) | The slow pulsing heard when two tones a few hertz apart sound together; the clash switch produces it on purpose. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| BPM | Beats per minute, the tempo; the demo runs at 128. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| breakdown | The section where the kick and bass leave and the pads and the figure are exposed; on the page the completed collapsed, air before the main figure. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| build (build-up) | The section before a drop that adds tension; here the kick enters and a riser climbs. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| CC BY 4.0 | Creative Commons Attribution 4.0 International: reuse of any kind is allowed with credit. | 2026-10-30 · s001 · `LICENCE` |
| cent | One hundredth of a semitone; used to say how far a frequency sits from the nearest note. | 2026-10-30 · s001 · `tools/macos/render.py` |
| clash | Project term: the demo's deliberate violation of the one-lead and masking gates, two decisions side by side and two leads four hertz apart. | 2026-10-30 · s002 · `session-techno-ui/shader/index.html` |
| convolution reverb | Reverberation made by convolving the signal with an impulse response; here a synthetic decaying noise burst behind the "space" control. | 2026-10-30 · s001 · `tools/browser/playground.js` |
| cue point | A marked position in a track; on the page a navigation marker in a reference template. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| design token | A named value shared by design and code, such as `--beat: 8px`. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| Director / Follower / Duet | The three positions of the human relative to the Model: steering by feedback, being led, or trading the lead. | 2026-10-30 · s001 · `docs/research-programme.md` |
| drone | A long sustained tone or chord over which other material moves. | 2026-10-30 · s001 · `docs/journal/2026-10-30-s001-rigging.md` |
| drop | The moment the full groove lands after a build or a breakdown; on the page the role's decisions. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| equal temperament (12-TET) | Tuning that divides the octave into twelve equal semitones, each a ratio of 2^(1/12). | 2026-10-30 · s001 · `tools/macos/render.py` |
| equaliser (EQ) | Tone control by frequency band; on the page the filters above a table. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| four-on-the-floor | A kick on every beat of the bar, the pulse of techno and house. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| fragment shader | The shader that computes the colour of every pixel; here it draws the page. | 2026-10-30 · s002 · `session-techno-ui/shader/index.html` |
| frequency masking | One sound hiding another in the same band; on the page two accents side by side. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| frontman | The visible leading performer. "AI as frontman" means the Model takes that role in performance and composition. | 2026-10-30 · s001 · `README.md` |
| fundamental (f0) | The lowest partial of a harmonic tone; the pitch we hear. | 2026-10-30 · s001 · `tools/macos/render.py` |
| gate | A rule made testable: a check a page must pass. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| GLSL | The OpenGL Shading Language, in which the shaders are written (GLSL ES 1.00 for WebGL 1). | 2026-10-30 · s002 · `session-techno-ui/shader/index.html` |
| groove | The running pattern of kick, hats and bass once established; on the page the attention rows. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| harmonic / partial / overtone | A partial is any sine component of a sound; a harmonic is a partial at an integer multiple of f0; an overtone is any partial above the fundamental. | 2026-10-30 · s001 · `tools/macos/render.py` |
| harmonic series | The set f0, 2·f0, 3·f0, … of integer multiples of a fundamental. | 2026-10-30 · s001 · `tools/macos/render.py` |
| hi-hat (closed, open) | The high metallic ticking of the drum kit; here filtered noise, short when closed and longer when open. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| intro / outro | The opening and closing sections of a track; on the page the state line and the links. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| just intonation | Tuning by small whole-number frequency ratios (3/2, 5/4, …) rather than by equal semitones. | 2026-10-30 · s001 · `tools/macos/render.py` (`--ratios`) |
| kick (kick drum) | The low drum on the beat; here a sine wave with a falling pitch and a click. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| layer (lead, bass, hat, pad) | The four loudness roles of the page from the base, named after the sounds of a track. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| light dynamics | Project term: time-varying light (colour, brightness, movement) coupled to music. | 2026-10-30 · s001 · `README.md` |
| limiter | A compressor with a high ratio that stops peaks exceeding a threshold; used for ear safety in the playground, not as an effect. | 2026-10-30 · s001 · `tools/browser/playground.js` |
| lookahead scheduler | Scheduling audio events a fraction of a second ahead of the audio clock from a timer, so that timing does not depend on the page's main thread. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| loop | A repeating cell; here one bar of sixteenths, and the whole arrangement of thirty-two bars. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| mix | The balance of the layers against each other. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| narrative (plot) | The dramatic arc of a piece: states, transitions, tension and release across time. The Steward's word is «сюжет». | 2026-10-30 · s001 · `README.md` |
| Nyquist frequency | Half the sample rate; partials at or above it cannot be represented and are dropped. | 2026-10-30 · s001 · `tools/macos/render.py` |
| pad | A soft, sustained, often chordal synthesiser texture. | 2026-10-30 · s001 · `docs/journal/2026-10-30-s001-rigging.md` |
| page score | The Steward's term (партитура страницы): the tokens and gates by which the page templates are built. | 2026-10-30 · s002 · `session-techno-ui/README.md` |
| PCM / WAV | Pulse-code modulation: audio as a sequence of integer samples. WAV is the container file we write. | 2026-10-30 · s001 · `tools/macos/render.py` |
| period | Project term: the four-bar unit of the block budget, distinguished from the two-bar `--phrase` token. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| phrase | Eight beats, two bars, in the base token (64 px between the large parts of a page); in techno often four bars, hence "period". | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| progressive layering | Adding one layer at a time; on the page one new element type per section. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| provenance | The record of origin of an artefact: which model or person made it, when, and in which role. | 2026-10-30 · s001 · `PROVENANCE.md` |
| rig / rigging | The standard scaffolding of the project: documents, conventions, tools and checks that every session relies on. The Steward's word is «обвязка». | 2026-10-30 · s001 · `README.md` |
| riser | A rising noise sweep that leads into a drop; here a band-pass sweep over two bars. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| RMS | Root mean square: a loudness estimate over a window of samples; drives the page brightness in the playground. | 2026-10-30 · s001 · `tools/browser/playground.js` |
| sample rate | Samples per second of digital audio; 48 000 Hz by default here. | 2026-10-30 · s001 · `tools/macos/render.py` |
| session level (L0 to L3) | How much theory a session uses, from none (L0) to pure derivation (L3). | 2026-10-30 · s001 · `docs/session-levels.md` |
| shader | A small program that runs on the graphics processor for every vertex or pixel. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| sidechain (ducking) | Lowering one signal whenever another sounds; here bass and pads under the kick; on the page everything quieter beside a decision. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| sixteenth (step) | A quarter of a beat; the resolution of the patterns and the scheduler. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| stab | A short, sharp note or chord hit, the usual form of a techno lead. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| Steward | The human partner's role name: sets direction, gives feedback, reviews, decides. | 2026-10-30 · s001 · `README.md` |
| swing | Delaying the offbeat sixteenths by a fraction of a step; the kick never moves. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| techno | A dance music on a fixed four-on-the-floor kick with few layers, arranged by subtraction and addition. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| template (page template) | One of the five page forms of the base: action, analysis, reference, table, form. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| timbre | Tone colour: what makes two sounds of the same pitch and loudness differ; largely the partial structure and the envelope. | 2026-10-30 · s001 · `docs/research-programme.md` |
| track form | The order of sections in a track; on the page the order in which blocks are allowed to appear. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| uniform | A value passed from the page's script into a shader, constant across one frame. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
| velocity | The strength of a single hit. | 2026-10-30 · s002 · `session-techno-ui/shader/techno.js` |
| vertex shader | The shader that places geometry; here one full-screen triangle. | 2026-10-30 · s002 · `session-techno-ui/shader/index.html` |
| Web Audio API | The browser's built-in interface for synthesising and processing sound. | 2026-10-30 · s001 · `tools/browser/` |
| WebGL | The browser's interface to the graphics processor. | 2026-10-30 · s002 · `session-techno-ui/techno-score.md` |
