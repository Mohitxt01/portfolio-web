/* =========================================================
   AUDIO — UI sound design, synthesised not sampled.

   Every sound is generated from oscillators at call time, so the
   whole sound system adds zero bytes of assets to the page. Off by
   default; the AudioContext is not even created until the user
   opts in, which also sidesteps autoplay policy entirely.
   ========================================================= */

let ctx = null;
let master = null;
let enabled = false;

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  // Deliberately quiet. UI sound should be felt, not heard.
  master.gain.value = 0.05;
  master.connect(ctx.destination);
  return ctx;
}

export function setAudioEnabled(on) {
  enabled = !!on;
  if (enabled) {
    const c = ensureContext();
    // Browsers start contexts suspended until a gesture; the toggle IS the gesture.
    if (c?.state === 'suspended') c.resume();
  }
}

export function isAudioEnabled() {
  return enabled;
}

/**
 * One synthesised blip.
 * @param {number} freq      base frequency in Hz
 * @param {number} dur       seconds
 * @param {OscillatorType} type
 * @param {number} gain      peak gain before master
 * @param {number} glideTo   optional target frequency for a pitch sweep
 */
function blip(freq, dur, type = 'sine', gain = 1, glideTo = null) {
  if (!enabled) return;
  const c = ensureContext();
  if (!c || c.state !== 'running') return;

  const t = c.currentTime;
  const osc = c.createOscillator();
  const env = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);

  // Fast attack, exponential decay — reads as a "tick" rather than a "beep".
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(env);
  env.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/* ---------- the palette of UI sounds ---------- */

export const sfx = {
  /** Pointer crossing an interactive element. Barely there by design. */
  hover: () => blip(2100, 0.035, 'sine', 0.25),
  /** Confirmed activation. */
  click: () => blip(760, 0.07, 'triangle', 0.6, 420),
  /** Panel or overlay opening. */
  open: () => blip(420, 0.14, 'sine', 0.5, 880),
  /** Panel or overlay closing. */
  close: () => blip(680, 0.12, 'sine', 0.45, 300),
  /** Terminal keystroke. */
  key: () => blip(1500 + Math.random() * 400, 0.022, 'square', 0.14),
  /** Something succeeded — a rising two-note figure. */
  success: () => {
    blip(660, 0.1, 'sine', 0.5);
    setTimeout(() => blip(990, 0.16, 'sine', 0.45), 70);
  },
  /** Something was rejected. */
  error: () => blip(180, 0.18, 'sawtooth', 0.3, 110),
  /** Preloader completion swell. */
  boot: () => {
    [330, 440, 660, 880].forEach((f, i) => setTimeout(() => blip(f, 0.22, 'sine', 0.3), i * 85));
  },
};

/** Release audio resources (used on unmount / HMR). */
export function teardownAudio() {
  enabled = false;
  if (ctx) {
    ctx.close();
    ctx = null;
    master = null;
  }
}
