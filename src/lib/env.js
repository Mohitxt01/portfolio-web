/* =========================================================
   ENV — capability detection.
   Ambition is only affordable if we know what the device can pay.
   ========================================================= */

export const isBrowser = typeof window !== 'undefined';

export function prefersReducedMotion() {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer() {
  if (!isBrowser) return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function isTouch() {
  if (!isBrowser) return false;
  return window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0;
}

let _gl = null;
/** Cached WebGL2 support probe. Creating contexts is not free — do it once. */
export function supportsWebGL2() {
  if (!isBrowser) return false;
  if (_gl !== null) return _gl;
  try {
    const c = document.createElement('canvas');
    _gl = !!c.getContext('webgl2');
  } catch {
    _gl = false;
  }
  return _gl;
}

/**
 * Device tier drives how much visual work we schedule.
 *   'high'   — full shader field, full particle counts, all parallax
 *   'medium' — shader at half resolution, reduced particles
 *   'low'    — static gradients, no continuous rAF work
 */
export function deviceTier() {
  if (!isBrowser) return 'low';
  if (prefersReducedMotion()) return 'low';
  if (!supportsWebGL2()) return 'low';

  const cores = navigator.hardwareConcurrency || 2;
  const mem = navigator.deviceMemory || navigator.deviceMemory === 0 ? navigator.deviceMemory : undefined;
  const ram = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : mem;
  const narrow = window.innerWidth < 768;
  const saveData = navigator.connection?.saveData === true;

  if (saveData) return 'low';
  if (cores <= 2) return 'low';
  if (narrow || cores <= 4 || (typeof ram === 'number' && ram <= 4)) return 'medium';
  return 'high';
}

/** Device pixel ratio clamped so a 3× phone does not render 9× the pixels. */
export function renderScale(tier = deviceTier()) {
  const dpr = isBrowser ? window.devicePixelRatio || 1 : 1;
  if (tier === 'high') return Math.min(dpr, 2);
  if (tier === 'medium') return Math.min(dpr, 1.25);
  return 1;
}

/** Subscribe to reduced-motion changes so the page responds without a reload. */
export function onReducedMotionChange(cb) {
  if (!isBrowser) return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e) => cb(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
