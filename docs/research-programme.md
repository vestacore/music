---
provenance:
  created: 2026-10-30T11:49:25+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: set every direction in the opening brief
  model_role: organised them into a programme and a roadmap
  revisions: []
---

# Research programme

What we are studying, how, and in what order. A living document: changes are recorded in its provenance block.

## 1. Purpose

To understand how harmony is put together, by making sound and listening to it, with a human and an AI model working as partners whose contributions are each recorded. Harmony is taken broadly: the relations between simultaneous and successive pitches, the inner structure of a single tone (its partials), tuning, and the way tension and release unfold across a piece.

## 2. Material and its use

Existing music is a teacher, not a quarry.

- We may listen to and analyse any existing work within the terms of its licence, or for study: tracing how its harmony is built, by ear and by derivation.
- We describe what we learn in our own words and re-create *principles* in original material. We do not reproduce melodies, progressions, arrangements, samples or stems, and we never attempt to copy the composer's or author's intent.
- No copyrighted audio or scores are committed to this repository. Analyses refer to works by title and author.

## 3. Real sound

Every study ends in something audible, made with our own instruments.

| Path | Instrument | State |
|---|---|---|
| macOS | `tools/macos/render.py`: additive synthesis of partials and chords to WAV, playback through `afplay` | working since session 001 |
| Browser | `tools/browser/`: the Harmonic Playground on the Web Audio API | working since session 001 |
| Later | a real-time engine (Swift with AVAudioEngine, or AudioWorklet in the browser); MIDI in and out; OSC or Art-Net for lights | planned |

## 4. Depth levels

Sessions differ in how much theory they use, from pure sound-form play to pure derivation. The levels are defined in [session-levels.md](session-levels.md) and declared in every journal entry.

## 5. Positions of the human and the Model

The Model may act as **frontman**: the visible performer and composer. The Steward then takes one of three positions, and part of the research is to learn what each position affords.

| Position | The Steward | The Model | What we study |
|---|---|---|---|
| Director | Steers through emotional feedback and imagery ("colder", "a corridor opening", "pressure in the chest") | Translates the words into sound and reports what it changed | The mapping from feeling and image to musical parameter; how stable it is; whether it can be learnt |
| Follower | Is led into a musical contour the Model unfolds; reports what the journey felt like | Composes and performs the contour, choosing its turns | How a listener follows an unfolding form; which turns carry and which lose them |
| Duet | The lead passes back and forth | The lead passes back and forth | Hand-over: how two agents keep one line |

In every session we write down the Steward's words and the Model's parameter changes side by side, so that the mapping between them becomes data.

## 6. Light dynamics

Light is the second instrument.

1. **Now.** The Harmonic Playground tints the page by pitch class (hue) and loudness (brightness): a first, deliberately crude coupling, to test whether colour helps hearing.
2. **Next.** Palettes tied to harmonic function and tension rather than to pitch class alone; light that anticipates as well as follows.
3. **Later.** Room lighting over DMX or Art-Net, 3D scenes and VR, where sound, light and space are composed together.

## 7. Dynamic AI interfaces

An interface that reshapes itself around the musical moment: controls appear when they matter and withdraw when they do not; the Steward's feedback changes not only the sound but the surface through which the sound is touched. The Harmonic Playground is deliberately static; it is the baseline against which dynamic interfaces will be measured.

## 8. Style base

Atmospheric electronic composition with a dynamic, saturated narrative. In practice: slow harmonic motion over long time scales, timbres that evolve, a plot with states and transitions rather than a loop. Other styles will be visited; this is where the vocabulary is first built.

## 9. Roadmap

- **Near (sessions 2 to 5).** Hear the harmonic series. Compare just intonation with equal temperament by ear. Build a first sixty-second sketch with a three-state plot. Run a first Director session and record the feedback mapping.
- **Mid.** A real-time engine. Light palettes tied to tension. A first dynamic-interface prototype.
- **Far.** 3D and VR scenes. A performance with the Model as frontman.

## 10. Open questions

- Which of the Steward's words map reliably onto which parameters, and which do not map at all?
- Does light help or distract when learning to hear partials?
- Where does equal temperament stop being good enough for atmospheric material?
- What should the Model record about its own choices so that a performance can be reproduced?
