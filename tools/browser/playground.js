// playground.js: the Harmonic Playground. Eight sine partials over one fundamental,
// a convolution "space", a slow breathing drift, a spectrum and waveform scope, and
// light (the page colour) coupled to pitch class and loudness.
//
// Provenance
//   created:     2026-10-30T11:51:52+02:00
//   model:       Claude Fable 5.1 (claude-fable-5-1, Anthropic)
//   steward:     Leonid: brief ("real sound in the browser", light coupled to music), review
//   model_role:  design and implementation
//   revisions:   none yet
// Licence: CC BY 4.0 (see LICENCE at the repository root).
'use strict';

const NUM_PARTIALS = 8;
const F_MIN = 27.5;            // A0
const OCTAVES = 6;             // the fundamental slider spans A0 to A6
const A4 = 440;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PRESETS = {
  'sine':       [1, 0, 0, 0, 0, 0, 0, 0],
  'one over n': [1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6, 1 / 7, 1 / 8],
  'odd only':   [1, 0, 1 / 3, 0, 1 / 5, 0, 1 / 7, 0],
  'warm':       [1, 0.6, 0.25, 0.1, 0.05, 0, 0, 0],
  'glassy':     [1, 0, 0, 0.5, 0, 0, 0.3, 0],
};

const el = (id) => document.getElementById(id);

const state = {
  f0: 110,                                   // A2
  amps: PRESETS['one over n'].slice(),
  on: Array(NUM_PARTIALS).fill(true),
  breathe: false,
  running: false,
};

let ctx = null;    // AudioContext, created on the first Start (browsers require a gesture)
let nodes = null;  // the audio graph

// ------------------------------------------------------------------ pitch helpers

const sliderToHz = (x) => F_MIN * Math.pow(2, x * OCTAVES);
const hzToSlider = (f) => Math.log2(f / F_MIN) / OCTAVES;

function describe(f) {
  const semis = 12 * Math.log2(f / A4);
  const n = Math.round(semis);
  const cents = Math.round((semis - n) * 100);
  const name = NOTE_NAMES[(((n + 9) % 12) + 12) % 12];
  const octave = 4 + Math.floor((n + 9) / 12);
  return `${f.toFixed(1)} Hz · ${name}${octave} ${cents >= 0 ? '+' : ''}${cents}c`;
}

const pitchClassHue = (f) => ((((12 * Math.log2(f / A4)) % 12) + 12) % 12) / 12 * 360;

// ------------------------------------------------------------------ audio graph

function makeImpulse(ac, seconds, curve) {
  // A decaying noise burst: the simplest convincing room.
  const length = Math.floor(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, curve);
    }
  }
  return buffer;
}

function buildGraph() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const sum = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const convolver = ctx.createConvolver();
  convolver.buffer = makeImpulse(ctx, 3.0, 3.0);
  const master = ctx.createGain();
  master.gain.value = parseFloat(el('master').value);
  const limiter = ctx.createDynamicsCompressor();  // ear safety, not an effect
  limiter.threshold.value = -6;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.8;

  sum.connect(dry).connect(master);
  sum.connect(convolver).connect(wet).connect(master);
  master.connect(limiter).connect(analyser).connect(ctx.destination);

  const oscs = [];
  const gains = [];
  for (let k = 1; k <= NUM_PARTIALS; k++) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = state.f0 * k;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(sum);
    osc.start();
    oscs.push(osc);
    gains.push(gain);
  }
  nodes = { sum, dry, wet, master, analyser, oscs, gains };
  setSpace(parseFloat(el('space').value));
  applyAll();
}

const glide = (param, value, seconds = 0.05) => param.setTargetAtTime(value, ctx.currentTime, seconds);

function applyAll(breathMod) {
  if (!nodes) return;
  const nyquist = ctx.sampleRate / 2;
  let total = 0;
  for (let i = 0; i < NUM_PARTIALS; i++) {
    const f = state.f0 * (i + 1);
    const level = state.on[i] && f < nyquist ? state.amps[i] * (breathMod ? breathMod[i] : 1) : 0;
    total += level;
    glide(nodes.oscs[i].frequency, f, 0.03);
    glide(nodes.gains[i].gain, level, 0.05);
  }
  glide(nodes.sum.gain, 1 / Math.max(1, total), 0.1);   // keep the sum of partials at unity
}

function setSpace(x) {
  if (!nodes) return;
  glide(nodes.dry.gain, 1 - 0.6 * x, 0.1);
  glide(nodes.wet.gain, 0.8 * x, 0.1);
}

async function togglePower() {
  if (!ctx) {
    buildGraph();
    await ctx.resume();
    state.running = true;
  } else if (ctx.state === 'running') {
    await ctx.suspend();
    state.running = false;
  } else {
    await ctx.resume();
    state.running = true;
  }
  const button = el('power');
  button.textContent = state.running ? 'Stop' : 'Start';
  button.classList.toggle('on', state.running);
  button.setAttribute('aria-pressed', String(state.running));
  updateReadout();
}

// ------------------------------------------------------------------ controls

function buildControls() {
  const box = el('partials');
  for (let i = 0; i < NUM_PARTIALS; i++) {
    const row = document.createElement('label');
    row.className = 'partial';
    row.innerHTML =
      `<input type="checkbox" data-on="${i}" checked>` +
      `<span class="k">${i + 1}</span>` +
      `<input type="range" min="0" max="1" step="0.01" data-amp="${i}" value="${state.amps[i].toFixed(2)}">` +
      `<span class="freq" data-freq="${i}"></span>`;
    box.appendChild(row);
  }
  box.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.amp !== undefined) state.amps[Number(t.dataset.amp)] = parseFloat(t.value);
    if (t.dataset.on !== undefined) state.on[Number(t.dataset.on)] = t.checked;
    applyAll();
    updateReadout();
  });

  const presets = el('presets');
  for (const name of Object.keys(PRESETS)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = name;
    b.addEventListener('click', () => setPreset(name));
    presets.appendChild(b);
  }

  const f0 = el('f0');
  f0.value = hzToSlider(state.f0);
  f0.addEventListener('input', (e) => setF0(sliderToHz(parseFloat(e.target.value))));
  el('master').addEventListener('input', (e) => { if (nodes) glide(nodes.master.gain, parseFloat(e.target.value)); });
  el('space').addEventListener('input', (e) => setSpace(parseFloat(e.target.value)));
  el('breathe').addEventListener('change', (e) => { state.breathe = e.target.checked; if (!state.breathe) applyAll(); });
  el('power').addEventListener('click', togglePower);
  document.addEventListener('keydown', onKey);
  updateReadout();
}

function setF0(f) {
  state.f0 = Math.min(Math.max(f, F_MIN), F_MIN * Math.pow(2, OCTAVES));
  el('f0').value = hzToSlider(state.f0);
  applyAll();
  updateReadout();
}

function setPreset(name) {
  state.amps = PRESETS[name].slice();
  state.on = Array(NUM_PARTIALS).fill(true);
  document.querySelectorAll('[data-amp]').forEach((s) => { s.value = state.amps[Number(s.dataset.amp)]; });
  document.querySelectorAll('[data-on]').forEach((c) => { c.checked = true; });
  applyAll();
  updateReadout();
}

function onKey(e) {
  // Leave the keys alone while a control has focus; the browser handles them there.
  if (e.target.closest && e.target.closest('input, button, select, textarea')) return;
  if (e.code === 'Space') { e.preventDefault(); togglePower(); return; }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    const step = (e.shiftKey ? 12 : 1) * (e.key === 'ArrowUp' ? 1 : -1);
    setF0(state.f0 * Math.pow(2, step / 12));
    return;
  }
  if (/^[1-8]$/.test(e.key)) {
    const i = Number(e.key) - 1;
    state.on[i] = !state.on[i];
    document.querySelector(`[data-on="${i}"]`).checked = state.on[i];
    applyAll();
    updateReadout();
  }
}

function updateReadout() {
  el('f0out').textContent = describe(state.f0);
  document.querySelectorAll('[data-freq]').forEach((span) => {
    const f = state.f0 * (Number(span.dataset.freq) + 1);
    span.textContent = ctx && f >= ctx.sampleRate / 2 ? 'above Nyquist' : describe(f);
  });
}

// ------------------------------------------------------------------ scope and light

const canvas = el('scope');
const g = canvas.getContext('2d');
let freqData = null;
let timeData = null;

function resize() {
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * devicePixelRatio));
  canvas.height = Math.max(1, Math.round(r.height * devicePixelRatio));
}

const breath = Array.from({ length: NUM_PARTIALS }, (_, i) => ({
  rate: 0.04 + 0.06 * ((i * 0.618) % 1),      // cycles per second: periods of 10 to 25 s
  phase: Math.random() * 2 * Math.PI,
}));

function light(hue, glow) {
  document.documentElement.style.setProperty('--accent', `hsl(${hue.toFixed(0)} 70% 60%)`);
  document.body.style.backgroundColor = `hsl(${hue.toFixed(0)} 30% ${(5 + 14 * glow).toFixed(1)}%)`;
}

function frame(ms) {
  requestAnimationFrame(frame);
  const t = ms / 1000;
  if (state.breathe && nodes && state.running) {
    applyAll(breath.map((b) => 0.55 + 0.45 * Math.sin(2 * Math.PI * b.rate * t + b.phase)));
  }
  draw();
}

function draw() {
  const W = canvas.width;
  const H = canvas.height;
  const dpr = devicePixelRatio;
  g.clearRect(0, 0, W, H);
  const hue = pitchClassHue(state.f0);

  if (!nodes || !state.running) {
    light(hue, 0);
    g.fillStyle = 'rgba(255,255,255,0.45)';
    g.font = `${14 * dpr}px ui-sans-serif, system-ui, sans-serif`;
    g.textAlign = 'center';
    g.fillText(nodes ? 'Paused' : 'Press Start (or Space) to begin', W / 2, H / 2);
    return;
  }

  const an = nodes.analyser;
  if (!freqData) {
    freqData = new Uint8Array(an.frequencyBinCount);
    timeData = new Uint8Array(an.fftSize);
  }
  an.getByteFrequencyData(freqData);
  an.getByteTimeDomainData(timeData);

  let acc = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128;
    acc += v * v;
  }
  const rms = Math.sqrt(acc / timeData.length);
  light(hue, Math.min(1, rms * 4));

  // Spectrum on a logarithmic frequency axis, 20 Hz to 10 kHz.
  const fLo = 20;
  const fHi = 10000;
  const binHz = ctx.sampleRate / an.fftSize;
  const specH = H * 0.62;
  const bar = 2 * dpr;
  g.fillStyle = `hsla(${hue}, 70%, 62%, 0.85)`;
  for (let x = 0; x < W; x += bar) {
    const f = fLo * Math.pow(fHi / fLo, x / W);
    const bin = Math.min(freqData.length - 1, Math.round(f / binHz));
    const v = freqData[bin] / 255;
    g.fillRect(x, specH - v * specH, bar, v * specH);
  }
  // Partial markers under the spectrum.
  for (let k = 1; k <= NUM_PARTIALS; k++) {
    const f = state.f0 * k;
    if (f < fLo || f > fHi) continue;
    const x = Math.log(f / fLo) / Math.log(fHi / fLo) * W;
    const active = state.on[k - 1] && state.amps[k - 1] > 0;
    g.fillStyle = active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)';
    g.fillRect(x - dpr, specH + 6 * dpr, 2 * dpr, 8 * dpr);
  }
  // Waveform.
  g.strokeStyle = `hsla(${hue}, 60%, 85%, 0.9)`;
  g.lineWidth = 1.5 * dpr;
  g.beginPath();
  const mid = H * 0.84;
  const amp = H * 0.13;
  for (let i = 0; i < timeData.length; i++) {
    const x = i / timeData.length * W;
    const y = mid + ((timeData[i] - 128) / 128) * amp;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
}

// ------------------------------------------------------------------ go

buildControls();
resize();
if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
window.addEventListener('resize', resize);
requestAnimationFrame(frame);
