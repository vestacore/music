// techno.js: a synthesised techno track (kick, hats, bass, pad, lead) on a lookahead
// scheduler, driving a fragment shader that draws an Action page on the beat grid.
// Session 002, Techno UI. Nothing is sampled; every sound is made at run time.
//
// Provenance
//   created:     2026-10-30T12:15:39+02:00
//   model:       Claude Fable 5.1 (claude-fable-5-1, Anthropic)
//   steward:     Leonid: the track-to-page base, the brief ("a techno image with shader backing"), review
//   model_role:  design and implementation (engine, arrangement, layout, gates, uniform bridge)
//   revisions:   none yet
// Licence: CC BY 4.0 (see LICENCE at the repository root).
'use strict';

// ------------------------------------------------------------------ the track

const STEPS_PER_BAR = 16;        // sixteenths
const LOOP_BARS = 32;
const LOOKAHEAD = 0.15;          // seconds scheduled ahead of the audio clock
const TICK_MS = 25;

// The Action template as an arrangement. Layer levels run 0 to 1; hue is the accent in degrees.
const SECTIONS = [
  { name: 'intro',     from: 0,  to: 4,  kick: 0, hat: 0.5, bass: 0, pad: 0.6, lead: 0, hue: 212 },
  { name: 'build',     from: 4,  to: 8,  kick: 1, hat: 0.8, bass: 0, pad: 0.7, lead: 0, hue: 190, riser: true },
  { name: 'drop',      from: 8,  to: 16, kick: 1, hat: 1,   bass: 1, pad: 0.5, lead: 1, hue: 26 },
  { name: 'breakdown', from: 16, to: 20, kick: 0, hat: 0.3, bass: 0, pad: 1,   lead: 1, hue: 282 },
  { name: 'drop',      from: 20, to: 28, kick: 1, hat: 1,   bass: 1, pad: 0.5, lead: 1, hue: 26 },
  { name: 'outro',     from: 28, to: 32, kick: 1, hat: 0.6, bass: 0, pad: 0.3, lead: 0, hue: 212 },
];
const sectionAt = (bar) => SECTIONS.find((s) => bar >= s.from && bar < s.to) || SECTIONS[0];

// Patterns over one bar of sixteenths.
const BASS_ROOT = 33;                                             // A1, 55 Hz
const BASS_PATTERN = [null, 0, null, 0, null, 0, null, 12, null, 0, null, 0, null, 0, 7, 0];
const HAT_ACCENT = [0.15, 0.3, 0.8, 0.3, 0.15, 0.3, 0.8, 0.3, 0.15, 0.3, 0.8, 0.3, 0.15, 0.3, 0.8, 0.45];
const LEAD_DROP = { 0: 64, 3: 67, 6: 69 };                        // E4 G4 A4 on the first bar of each phrase
const LEAD_BREAK = { 0: 69, 8: 67 };                              // A4 G4 on every bar of the breakdown
const PAD_CHORD = [45, 48, 52, 55];                               // A2 C3 E3 G3

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// ------------------------------------------------------------------ the page
// Rectangles in CSS pixels from the page origin, on the 8 px beat (the 4 px half-beat is allowed).
// layer: how loud it may be. block: which of the first screen's blocks it belongs to.
// enter: the bar at which it arrives. clash: only present when the clash switch is on.

const PAGE_W = 896;
const PAGE_H = 480;
const LAYER_ID = { state: 1, lead: 2, bass: 3, hat: 4, pad: 5, link: 6 };
const LAYOUT = [
  { layer: 'state', block: 'state',  x: 64,  y: 64,  w: 512, h: 24,  enter: 0,    text: 'Two decisions are waiting for you' },
  { layer: 'hat',   block: 'state',  x: 64,  y: 96,  w: 160, h: 12,  enter: 4,    text: 'updated 2 min ago' },
  { layer: 'lead',  block: 'decide', x: 64,  y: 128, w: 176, h: 40,  enter: 8,    text: 'Approve' },
  { layer: 'lead',  block: 'decide', x: 256, y: 128, w: 176, h: 40,  enter: 8,    text: 'Reject all', clash: true },
  { layer: 'bass',  block: 'rows',   x: 64,  y: 200, w: 400, h: 24,  enter: 10,   text: 'Order 1042 · needs your sign-off' },
  { layer: 'bass',  block: 'rows',   x: 64,  y: 240, w: 400, h: 24,  enter: 10.5, text: 'Payout 88 · check the limit' },
  { layer: 'bass',  block: 'rows',   x: 64,  y: 280, w: 400, h: 24,  enter: 11,   text: 'Vendor Acme · renewal due' },
  { layer: 'bass',  block: 'rows',   x: 64,  y: 320, w: 400, h: 24,  enter: 11.5, text: 'Report Q3 · review' },
  { layer: 'bass',  block: 'rows',   x: 64,  y: 360, w: 400, h: 24,  enter: 12,   text: 'Ticket 77 · answer' },
  { layer: 'hat',   block: 'rows',   x: 480, y: 204, w: 96,  h: 16,  enter: 10,   text: 'Decided by Finance' },
  { layer: 'hat',   block: 'rows',   x: 480, y: 244, w: 96,  h: 16,  enter: 10.5, text: 'Decided by Ops' },
  { layer: 'hat',   block: 'rows',   x: 480, y: 284, w: 96,  h: 16,  enter: 11,   text: 'you' },
  { layer: 'hat',   block: 'rows',   x: 480, y: 324, w: 96,  h: 16,  enter: 11.5, text: 'Decided by Legal' },
  { layer: 'hat',   block: 'rows',   x: 480, y: 364, w: 96,  h: 16,  enter: 12,   text: 'you' },
  { layer: 'link',  block: 'rows',   x: 64,  y: 400, w: 96,  h: 16,  enter: 12,   text: 'show more' },
  { layer: 'pad',   block: 'aside',  x: 640, y: 128, w: 256, h: 160, enter: 0,    text: 'Activity' },
  { layer: 'pad',   block: 'aside',  x: 640, y: 320, w: 256, h: 96,  enter: 0,    text: 'Balances' },
  { layer: 'link',  block: 'aside',  x: 640, y: 440, w: 64,  h: 16,  enter: 28,   text: 'Orders' },
  { layer: 'link',  block: 'aside',  x: 712, y: 440, w: 64,  h: 16,  enter: 28,   text: 'Support' },
  { layer: 'link',  block: 'aside',  x: 784, y: 440, w: 64,  h: 16,  enter: 28,   text: 'Help' },
];

// ------------------------------------------------------------------ engine state

let ctx = null;
let bus = null;
let noiseBuffer = null;
const transport = { running: false, step: 0, nextTime: 0, timer: null, bpm: 128, swing: 0.08 };
const queue = { steps: [], kick: [], hat: [], ohat: [], bass: [], lead: [], riser: [] };
const mutes = { lead: false, bass: false, hat: false, pad: false };
let clash = false;

const stepDur = () => 60 / transport.bpm / 4;
const barDur = () => (60 / transport.bpm) * 4;

// ------------------------------------------------------------------ voices

function buildEngine() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain();
  master.gain.value = 0;
  const limiter = ctx.createDynamicsCompressor();   // ear safety at the end of the chain
  limiter.threshold.value = -8;
  limiter.knee.value = 2;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.2;
  const drums = ctx.createGain();                    // kick and hats
  const duck = ctx.createGain();                     // the sidechain: bass and pad pass through it
  const music = ctx.createGain();                    // the lead and the riser do not duck
  drums.connect(master);
  duck.connect(master);
  music.connect(master);
  master.connect(limiter).connect(ctx.destination);

  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  bus = { master, drums, duck, music };
  startPad();
}

function noise(t, o) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  let node = src;
  if (o.hp) {
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = o.hp;
    node.connect(f);
    node = f;
  }
  if (o.bp) {
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.5;
    f.frequency.setValueAtTime(o.bp[0], t);
    f.frequency.exponentialRampToValueAtTime(o.bp[1], t + o.decay);
    node.connect(f);
    node = f;
  }
  const g = ctx.createGain();
  if (o.rise) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vel, t + o.decay);
    g.gain.setValueAtTime(0.0001, t + o.decay + 0.001);
  } else {
    g.gain.setValueAtTime(o.vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.decay);
  }
  node.connect(g).connect(o.bus || bus.drums);
  src.start(t, Math.random());
  src.stop(t + o.decay + 0.05);
}

function kick(t, vel) {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(175, t);
  o.frequency.exponentialRampToValueAtTime(47, t + 0.07);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o.connect(g).connect(bus.drums);
  o.start(t);
  o.stop(t + 0.42);
  noise(t, { hp: 1800, decay: 0.014, vel: vel * 0.45 });     // the click
}

function hat(t, vel, open) {
  noise(t, { hp: open ? 6500 : 7500, decay: open ? 0.22 : 0.04, vel: vel * (open ? 0.45 : 0.55) });
}

function bassNote(t, midi, dur) {
  const f = mtof(midi);
  const saw = ctx.createOscillator();
  saw.type = 'sawtooth';
  saw.frequency.value = f;
  const sub = ctx.createOscillator();
  sub.type = 'square';
  sub.frequency.value = f / 2;
  const subGain = ctx.createGain();
  subGain.gain.value = 0.35;
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.Q.value = 7;
  filt.frequency.setValueAtTime(1100, t);
  filt.frequency.exponentialRampToValueAtTime(160, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.42, t + 0.004);
  g.gain.setValueAtTime(0.42, t + dur * 0.55);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  saw.connect(filt);
  sub.connect(subGain).connect(filt);
  filt.connect(g).connect(bus.duck);
  saw.start(t); sub.start(t);
  saw.stop(t + dur + 0.03); sub.stop(t + dur + 0.03);
}

function leadStab(t, midi, offsetHz) {
  const f = mtof(midi) + offsetHz;
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.Q.value = 4;
  filt.frequency.setValueAtTime(3200, t);
  filt.frequency.exponentialRampToValueAtTime(500, t + 0.35);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  for (const [type, mult, cents] of [['sawtooth', 1, -6], ['sawtooth', 1, 6], ['square', 0.5, 0]]) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f * mult;
    o.detune.value = cents;
    o.connect(filt);
    o.start(t);
    o.stop(t + 0.5);
  }
  filt.connect(g).connect(bus.music);
}

function startPad() {
  const padGain = ctx.createGain();
  padGain.gain.value = 0;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 700;
  padFilter.Q.value = 0.8;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(padFilter.frequency);
  lfo.start();
  for (const m of PAD_CHORD) {
    for (const cents of [-9, 0, 9]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = mtof(m);
      o.detune.value = cents;
      const g = ctx.createGain();
      g.gain.value = 0.045;
      o.connect(g).connect(padFilter);
      o.start();
    }
  }
  padFilter.connect(padGain).connect(bus.duck);
  bus.padGain = padGain;
}

function riser(t, dur) {
  noise(t, { bp: [200, 6000], decay: dur, vel: 0.3, rise: true, bus: bus.music });
  queue.riser.push({ start: t, dur });
}

function duckAt(t) {
  const g = bus.duck.gain;
  g.cancelScheduledValues(t);
  g.setValueAtTime(1, t);
  g.linearRampToValueAtTime(0.18, t + 0.012);
  g.linearRampToValueAtTime(1, t + 0.3);
}

// ------------------------------------------------------------------ the scheduler

function scheduleStep(index, time) {
  const bar = Math.floor(index / STEPS_PER_BAR) % LOOP_BARS;
  const s = index % STEPS_PER_BAR;
  const sec = sectionAt(bar);
  const swung = s % 2 === 1 ? time + transport.swing * stepDur() : time;   // only the offbeat sixteenths move
  queue.steps.push({ index, time });

  if (s === 0 && bar === sec.from) {                                        // a section begins
    bus.padGain.gain.setTargetAtTime(mutes.pad ? 0 : sec.pad * 0.9, time, 0.5);
    if (sec.riser) riser(time + barDur() * 2, barDur() * 2);
  }
  if (sec.kick && s % 4 === 0) {                                            // four to the bar; never muted
    kick(time, 1);
    duckAt(time);
    queue.kick.push(time);
  }
  if (!mutes.hat && sec.hat > 0) {
    if (sec.hat >= 0.8) {
      hat(swung, HAT_ACCENT[s] * sec.hat, false);
      queue.hat.push(swung);
      if (sec.hat >= 1 && s % 4 === 2) { hat(swung, 0.4, true); queue.ohat.push(swung); }
    } else if (s % 4 === 2) {
      hat(swung, 0.6 * sec.hat, false);
      queue.hat.push(swung);
    }
  }
  if (!mutes.bass && sec.bass && BASS_PATTERN[s] !== null) {
    bassNote(swung, BASS_ROOT + BASS_PATTERN[s], stepDur() * 0.9);
    queue.bass.push(swung);
  }
  if (!mutes.lead && sec.lead) {
    const motif = sec.name === 'breakdown' ? LEAD_BREAK : ((bar - sec.from) % 2 === 0 ? LEAD_DROP : null);
    if (motif && motif[s] !== undefined) {
      leadStab(swung, motif[s], 0);
      if (clash) leadStab(swung, motif[s], 4);                              // four hertz off: beating
      queue.lead.push(swung);
    }
  }
}

function tick() {
  while (transport.nextTime < ctx.currentTime + LOOKAHEAD) {
    scheduleStep(transport.step, transport.nextTime);
    transport.step += 1;
    transport.nextTime += stepDur();
  }
  transport.timer = setTimeout(tick, TICK_MS);
}

async function start() {
  if (!ctx) buildEngine();
  await ctx.resume();
  for (const k of Object.keys(queue)) queue[k].length = 0;
  bus.master.gain.cancelScheduledValues(ctx.currentTime);
  bus.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.05);
  transport.step = 0;
  transport.nextTime = ctx.currentTime + 0.15;
  transport.running = true;
  tick();
}

function stop() {
  clearTimeout(transport.timer);
  transport.running = false;
  bus.master.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
  setTimeout(() => { if (!transport.running) ctx.suspend(); }, 300);
}

// ------------------------------------------------------------------ the gates

function evaluateGates() {
  const visible = LAYOUT.filter((b) => !b.clash || clash);
  const grid = LAYOUT.every((b) => [b.x, b.y, b.w, b.h].every((v) => v % 4 === 0));
  const leads = visible.filter((b) => b.layer === 'lead');
  const oneLead = leads.length <= 1;
  const masking = !leads.some((a) => leads.some((b) =>
    a !== b && Math.abs(a.y - b.y) < a.h && b.x >= a.x + a.w && b.x - (a.x + a.w) <= 32));
  const rows = visible.filter((b) => b.layer === 'bass').length;
  const blocks = new Set(visible.map((b) => b.block)).size;
  const budget = rows >= 3 && rows <= 5 && blocks <= 4;
  return { grid, oneLead, masking, budget };
}

function showGates() {
  const g = evaluateGates();
  const set = (id, ok) => {
    const e = document.getElementById(id);
    e.classList.toggle('ok', ok);
    e.classList.toggle('fail', !ok);
  };
  set('gateGrid', g.grid);
  set('gateLead', g.oneLead);
  set('gateMask', g.masking);
  set('gateBudget', g.budget);
}

// ------------------------------------------------------------------ the image

const el = (id) => document.getElementById(id);
const canvas = el('gl');
const stage = el('stage');
let glx = null;
const origin = { x: 0, y: 0 };
const levels = { kick: 0, hat: 0, bass: 0, pad: 0, lead: 0 };
let hue = SECTIONS[0].hue;
let lastFrame = performance.now();
const rectData = new Float32Array(24 * 4);
const layerData = new Float32Array(24);
const alphaData = new Float32Array(24);
const labels = [];

function compile(gl, type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
  return sh;
}

function initGL() {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) throw new Error('WebGL is not available in this browser.');
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, el('vert').textContent));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, el('frag').textContent));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (const name of ['u_res', 'u_dpr', 'u_origin', 'u_time', 'u_pos', 'u_hue', 'u_kick', 'u_hat', 'u_ohat',
    'u_bass', 'u_lead', 'u_pad', 'u_duck', 'u_riser', 'u_clash', 'u_grid', 'u_count', 'u_rect', 'u_layer', 'u_alpha']) {
    u[name] = gl.getUniformLocation(prog, name);
  }
  LAYOUT.forEach((b, i) => {
    rectData.set([b.x, b.y, b.w, b.h], i * 4);
    layerData[i] = LAYER_ID[b.layer];
  });
  gl.uniform1i(u.u_count, LAYOUT.length);
  gl.uniform4fv(u.u_rect, rectData);
  gl.uniform1fv(u.u_layer, layerData);
  glx = { gl, u };
}

function buildLabels() {
  const box = el('labels');
  for (const b of LAYOUT) {
    const d = document.createElement('div');
    d.className = `label layer-${b.layer}`;
    d.textContent = b.text;
    box.appendChild(d);
    labels.push(d);
  }
}

function resize() {
  const r = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  origin.x = Math.max(0, Math.floor((r.width - PAGE_W) / 2 / 8) * 8);
  origin.y = Math.max(0, Math.floor((r.height - PAGE_H) / 2 / 8) * 8);
  LAYOUT.forEach((b, i) => {
    const s = labels[i].style;
    s.left = `${origin.x + b.x}px`;
    s.top = `${origin.y + b.y}px`;
    s.width = `${b.w}px`;
    s.height = `${b.h}px`;
  });
}

// How present a block is, 0 to 1, from the position in the loop and the layer levels.
function presence(b, pos) {
  if (b.clash && !clash) return 0;
  if (mutes[b.layer]) return 0;
  let a = b.enter === 0 ? 1 : clamp01((pos - b.enter) / 0.5);     // arrives over half a bar
  if (b.layer === 'bass') a *= Math.max(0.12, levels.bass);        // collapsed, not gone, in the breakdown
  if (b.layer === 'lead') a *= levels.lead;
  if (b.layer === 'hat') a *= 0.4 + 0.6 * levels.hat;
  if (b.layer === 'pad') a *= 0.5 + 0.5 * levels.pad;
  return a;
}

// Age of the most recent scheduled hit that has already sounded, or Infinity.
function age(times, now) {
  while (times.length > 1 && times[1] <= now) times.shift();
  return times.length && times[0] <= now ? now - times[0] : Infinity;
}
const decay = (a, tau) => (a === Infinity ? 0 : Math.exp(-a / tau));

function frame(nowMs) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (nowMs - lastFrame) / 1000);
  lastFrame = nowMs;
  const now = ctx ? ctx.currentTime - (ctx.outputLatency || 0) : 0;

  // position in the loop
  let pos = 0;
  if (transport.running && queue.steps.length) {
    while (queue.steps.length > 1 && queue.steps[1].time <= now) queue.steps.shift();
    const s = queue.steps[0];
    if (s.time <= now) pos = ((s.index + (now - s.time) / stepDur()) / STEPS_PER_BAR) % LOOP_BARS;
  }
  const sec = sectionAt(Math.floor(pos));

  // layer levels and the accent follow the section
  const k = 1 - Math.exp(-dt / 0.25);
  for (const L of ['kick', 'hat', 'bass', 'pad', 'lead']) levels[L] += ((transport.running ? sec[L] : 0) - levels[L]) * k;
  const dh = ((sec.hue - hue + 540) % 360) - 180;
  hue = (hue + dh * (1 - Math.exp(-dt / 0.6)) + 360) % 360;

  // envelopes from the hits that have sounded
  const kickAge = age(queue.kick, now);
  const env = {
    kick: decay(kickAge, 0.12),
    duck: kickAge === Infinity ? 1 : (kickAge < 0.012 ? 1 - 0.82 * (kickAge / 0.012) : Math.min(1, 0.18 + 0.82 * ((kickAge - 0.012) / 0.288))),
    hat: decay(age(queue.hat, now), 0.05),
    ohat: decay(age(queue.ohat, now), 0.18),
    bass: decay(age(queue.bass, now), 0.1),
    lead: decay(age(queue.lead, now), 0.3),
    riser: 0,
  };
  while (queue.riser.length && queue.riser[0].start + queue.riser[0].dur < now) queue.riser.shift();
  if (queue.riser.length && queue.riser[0].start <= now) env.riser = clamp01((now - queue.riser[0].start) / queue.riser[0].dur);

  // presence of every block, for the shader and for the labels
  LAYOUT.forEach((b, i) => {
    const a = presence(b, pos);
    alphaData[i] = a;
    labels[i].style.opacity = (b.layer === 'lead' ? a : a * (0.5 + 0.5 * env.duck)).toFixed(3);
  });

  if (glx) {
    const { gl, u } = glx;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.u_res, canvas.width, canvas.height);
    gl.uniform1f(u.u_dpr, window.devicePixelRatio || 1);
    gl.uniform2f(u.u_origin, origin.x, origin.y);
    gl.uniform1f(u.u_time, (nowMs / 1000) % 1000);
    gl.uniform1f(u.u_pos, pos);
    gl.uniform1f(u.u_hue, hue);
    gl.uniform1f(u.u_kick, env.kick);
    gl.uniform1f(u.u_hat, env.hat);
    gl.uniform1f(u.u_ohat, env.ohat);
    gl.uniform1f(u.u_bass, env.bass);
    gl.uniform1f(u.u_lead, env.lead);
    gl.uniform1f(u.u_pad, levels.pad);
    gl.uniform1f(u.u_duck, env.duck);
    gl.uniform1f(u.u_riser, env.riser);
    gl.uniform1f(u.u_clash, clash ? 1 : 0);
    gl.uniform1f(u.u_grid, levels.kick);
    gl.uniform1fv(u.u_alpha, alphaData);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  el('section').textContent = transport.running ? sec.name : 'stopped';
  el('bar').textContent = `bar ${Math.floor(pos) + 1} of ${LOOP_BARS}`;
  document.documentElement.style.setProperty('--accent', `hsl(${hue.toFixed(0)} 78% 56%)`);
}

// ------------------------------------------------------------------ controls

async function togglePower() {
  if (transport.running) stop(); else await start();
  const b = el('power');
  b.textContent = transport.running ? 'Stop' : 'Start';
  b.classList.toggle('on', transport.running);
  b.setAttribute('aria-pressed', String(transport.running));
}

function wireControls() {
  el('power').addEventListener('click', togglePower);
  el('tempo').addEventListener('input', (e) => { transport.bpm = Number(e.target.value); el('tempoOut').textContent = e.target.value; });
  el('swing').addEventListener('input', (e) => { transport.swing = Number(e.target.value) / 100; el('swingOut').textContent = `${e.target.value}%`; });
  document.querySelectorAll('[data-layer]').forEach((c) => c.addEventListener('change', (e) => {
    const L = e.target.dataset.layer;
    mutes[L] = !e.target.checked;
    if (L === 'pad' && bus) bus.padGain.gain.setTargetAtTime(mutes.pad ? 0 : sectionAt(Math.floor(transport.step / STEPS_PER_BAR) % LOOP_BARS).pad * 0.9, ctx.currentTime, 0.3);
  }));
  el('clash').addEventListener('change', (e) => { clash = e.target.checked; showGates(); });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, button, select, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); togglePower(); }
  });
}

// ------------------------------------------------------------------ go

buildLabels();
wireControls();
showGates();
try {
  initGL();
} catch (err) {
  const box = el('error');
  box.style.display = 'block';
  box.textContent = `The shader could not start: ${err.message}`;
}
resize();
if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
window.addEventListener('resize', resize);
requestAnimationFrame(frame);

// For inspection from the console or a test harness.
window.technoUI = { transport, queue, levels, mutes, LAYOUT, SECTIONS, evaluateGates, get clash() { return clash; }, get ctx() { return ctx; } };
