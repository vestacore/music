---
provenance:
  created: 2026-10-30T12:15:39+02:00
  model: Claude Fable 5.1 (claude-fable-5-1, Anthropic)
  steward: Leonid
  steward_role: brought the base (a track-to-page mapping from the Steward's portal spec, section 9 "Page score") and asked for it to be developed into a techno image with shader backing
  model_role: developed the image, wrote this score, built the demo that plays and draws it
  revisions: []
---

# The page as a techno track

*Session 002, Techno UI. A score: how the base mapping between a track and a page becomes a techno image, and how the demo in `shader/` backs it with sound and light.*

## 0. The base

The Steward's portal spec maps a track onto a page. The **beat** is the 8 px unit of all spacing; the **bar** (four beats, 32 px) separates sections; the **phrase** (eight beats, 64 px) separates the large parts of a page. Four **layers** (lead, bass, hat, pad) sort every element by how loud it may be. **Masking**, **sidechain**, **breakdown**, **progressive** layering and **swing** become rules; budgets and gates make the rules checkable. Five templates (action, analysis, reference, table, form) each take a track form.

This document keeps every token and gate of the base and gives them a genre. The base is a metaphor from music in general; techno makes it exact.

## 1. Why techno

Techno is the strictest of the dance musics, and strictness is what an interface needs.

- **A fixed grid.** The kick falls on every beat, four to the bar, for the whole track. Nothing is placed off the grid, and the ear stops hearing the grid as a thing and starts hearing everything else against it. A page with every offset on the 8 px beat behaves the same way: the grid disappears and the content stands on it.
- **Few layers.** A techno track is kick, hats, bass, pad and one lead: five sounds, each in its own band. A page is a state line, rows, meta, surfaces and one decision.
- **Change by subtraction and addition.** A techno arrangement does not modulate. It removes the kick and brings it back, adds one layer at a time, drops. A page unfolds the same way: one new element type per section, the completed collapsed, the figure given air.
- **Loudness by ducking, not by adding.** The lead sits on top because everything else ducks under it on every kick, not because it is louder. On a page a decision stands out because the rest is quieter, not because it shouts.
- **Repetition with permitted variation.** The loop repeats; swing moves only the offbeat sixteenths; a fill is allowed every second bar. On a page rows keep one shape, and variation is allowed in three named places.

**The look that follows.** A dark ground. A grid that is felt, not seen. Ink in two weights: the rows and the meta. Surfaces without edges. One accent, on one element. Motion only as pulse and duck, never as slide or bounce.

## 2. Time becomes space: the grid

| In the track | Token | Value | On the page | Gate |
|---|---|---|---|---|
| half-beat (the offbeat sixteenth) | `--half-beat` | 4 px | the smallest permitted offset, for small things | every `margin`, `gap` and `padding` is a multiple of 4 px; a value off the grid is "off the beat" |
| beat (the kick) | `--beat` | 8 px | the unit of all spacing | as above |
| bar (four kicks) | `--bar` | 32 px | the gap between sections | as above |
| phrase (two bars, eight beats) | `--phrase` | 64 px | the gap between the large parts of a page | as above |
| body line | line height | 16 / 24 px: three beats | the text of rows | font tokens |
| caption line | line height | 12.5 / 16 px: two beats | meta and captions | font tokens |

```css
:root {
  --half-beat: 4px;
  --beat: 8px;
  --bar: 32px;     /* 4 beats */
  --phrase: 64px;  /* 8 beats, 2 bars */
}
```

**A note on counting.** The base calls 64 px a phrase of eight beats, which is two bars, and elsewhere speaks of a phrase of four bars when it sets the budget of a block. In techno the two-bar cell is the smallest unit of variation (the hat fill every second bar) and the four-bar unit is the phrase proper. The demo keeps the spacing token as it is (64 px, two bars) and calls the four-bar budget unit a **period**. Whether the spec renames one of them is the Steward's decision (section 8).

In the demo the kick pulses the grid: on every beat the 8, 32 and 64 px lines brighten and fade, so the grid can be seen to be the beat.

## 3. The mix: layers

Every element on the page belongs to exactly one layer. The layer says how loud it may be, how it is drawn and which gate watches it.

| Layer | In the track | On the page | Treatment | Gate |
|---|---|---|---|---|
| **kick** | the pulse on every beat; not a sound you listen to but the thing everything is placed against | not an element: the grid itself | the grid lines; in the demo they pulse with the kick | the grid gate above |
| **lead** | the stab or hook: one figure per phrase, on top of the mix | the key figure, or the one dark decision button | the only accent colour, full contrast, the only glow | at most one lead in the first screen |
| **bass** | the rolling line between the kicks: the body of the track | the main flow: row headings and row text | ink at middle weight, equal heights, one row shape per section | one row template per section |
| **hat** | the ticking top end: offbeat, quiet, constant | meta, captions, "Decided by", numbers | small and muted; monospace only for API values | monospace only inside `code` and API values |
| **pad** | the wash under everything: slow, wide, without edges | the right column, surfaces, backgrounds | no borders, no accents, low contrast | no dark buttons in the right column |

In sound each layer owns a band: the kick 45 to 150 Hz, the bass 55 to 600 Hz, the pad 200 to 1 500 Hz, the lead 300 to 3 000 Hz, the hats above 7 kHz. The page's layers own contrast bands the same way: pad lowest, hat low, bass middle, lead highest. Two elements in the same band at the same place blur each other (section 4, masking).

## 4. Dynamics

| In the track | Rule on the page | In the demo |
|---|---|---|
| **Sidechain.** Bass and pads duck under every kick; the lead does not duck. | If a role has decisions, everything else is quieter: rows not for this role and the right column lose contrast while the decision is on screen. | On every kick every block except the decision dips and recovers within a third of a second; the decision holds. |
| **Frequency masking.** Two sounds in one band blur; two leads a few hertz apart beat against each other. | Two tiles side by side, or two dark buttons in one line, are forbidden. | The **clash** switch places a second decision button beside the first and adds a second lead four hertz off: you hear the beating, you see the interference between the two blocks, and the masking and one-lead gates turn red. |
| **Breakdown.** Kick and bass out, pads swell, the figure alone with air around it. | The completed is collapsed; air before the main figure. | Bars 17 to 20: the rows collapse to a trace, the aside swells, the lead figure plays alone. |
| **Progressive layering.** One new layer per section. | Each section introduces at most one new element type. | Intro: the state line and the aside. Build: meta. Drop: the decision, then the rows one by one. Outro: the links. |
| **Swing.** Only the offbeat sixteenths move; the kick never does. | Variation only in the right column, the figure tile and the decision button. | The swing slider moves the hats and the bass offbeats; the grid stays where it is. |
| **Budget.** A four-bar period. | Three to five items visible, then "show more"; up to four blocks in the first screen. | The page shows five rows and four blocks; the budget gate counts them. |

## 5. Track forms for the five templates

| Template | Form | Sections in order | Example pages |
|---|---|---|---|
| **Action** | intro, drop, groove, outro | the state in one line (intro) → the role's decisions (drop) → the attention rows (groove) → activity and links (outro) | Home |
| **Analysis** | drop first | the main figure at once (drop) → its breakdown, phrase by phrase | Insights, Balances |
| **Reference** | steady groove, no drop | even rows; navigation by phrase markers, like cue points in a track | reference, chapters, codes |
| **Table** | one loop | rows of one shape repeating; the filters on top as the equaliser | Orders, statements |
| **Form** | call and response | the fields on the left ask, the preview on the right answers | Support, sign-in |

The demo plays the **Action** form as a thirty-two-bar loop at 128 beats per minute:

| Bars | Section | Layers | On the page |
|---|---|---|---|
| 1 to 4 | intro | pad, hats | the state line; the aside at low level |
| 5 to 8 | build | + kick; a riser in the last two bars | meta captions appear; the grid begins to pulse |
| 9 to 16 | drop | + bass, + lead | the decision button lands on the first beat; the rows arrive one by one |
| 17 to 20 | breakdown | kick and bass out; pad swells; lead alone | the rows collapse; the aside swells; the figure has air |
| 21 to 28 | drop | all layers | the full page |
| 29 to 32 | outro | bass and lead out; pad fades | the rows and the decision leave; the links remain |

## 6. The shader backing

`shader/index.html` draws the page with a fragment shader on the beat grid and plays the track with a synthesised engine on the Web Audio API. Nothing is sampled: every sound is made at run time, and every visual change is driven by the audio scheduler through uniforms.

| Track event | Uniform | What moves |
|---|---|---|
| kick | `u_kick` (a decaying envelope), `u_duck` (the sidechain gain) | the grid brightens; every block but the decision dips |
| closed and open hat | `u_hat`, `u_ohat` | the meta marks flicker |
| bass note | `u_bass` | the rows brighten; a sixteenth-note scan runs along them |
| lead stab | `u_lead` | the decision button glows and casts light |
| pad level | `u_pad` | the aside and the background wash breathe |
| riser | `u_riser` | a scan line climbs the page in the last two bars of the build |
| position in the loop | `u_pos`, `u_hue` | the section's accent hue, the presence of each block, the scan |
| clash | `u_clash` | a second decision button and interference between the two |

The layout is a list of rectangles in CSS pixels, each with a layer, a block and a bar of entry. The engine turns the position in the loop into a presence for every rectangle, and the shader draws each by its layer. Four gates run live over the same list: **beat grid** (every coordinate a multiple of 4), **one lead** (at most one visible), **masking** (no two leads adjacent), **budget** (three to five rows, at most four blocks). The clash switch is the only way to fail them, on purpose.

How to read it: start it and watch the grid before anything else arrives; notice that the decision button never dips while everything around it does; wait for the breakdown and see how much the rows were carrying; switch on the clash and listen before you look.

## 7. From image to code

What a product would take from this session, cheapest first:

1. The four spacing tokens and the two line heights, as CSS custom properties.
2. Layer classes (`lead`, `bass`, `hat`, `pad`) or a `data-layer` attribute on elements, so that gates can see them.
3. The gates as checks over rendered HTML: offsets on the grid, one lead in the first screen, no adjacent accents, no dark buttons in the right column, monospace only inside `code`. The demo's gate code is the seed.
4. The track form per template, as the order in which blocks are allowed to appear.

## 8. Open points for the Steward

- Phrase versus period: rename `--phrase` (two bars), rename the four-bar budget unit, or keep both names.
- Should the kick be a visible token (the grid shown in a debug mode), or stay implicit?
- The accent hue per section: the demo shifts it (cold in the intro, warm in the drop, violet in the breakdown); a product would keep one.
- Does the clash belong in the spec as a negative example?
