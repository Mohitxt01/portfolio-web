/* =========================================================
   CURSOR — dot + difference-blended ring.
   Velocity stretch, contextual states, magnetic snap.

   Node split is deliberate: the outer ring node owns position and
   the press `scale`, the inner node owns the velocity `scaleX/scaleY`
   and rotation. Putting both on one node would make the two quickTo
   chains overwrite each other every frame.
   ========================================================= */

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import '../styles/cursor.css';

const STATES = {
  idle: { w: 32, h: 32, r: 999, label: '' },
  hover: { w: 54, h: 54, r: 999, label: '' },
  view: { w: 92, h: 92, r: 999, label: 'VIEW' },
  link: { w: 52, h: 52, r: 999, label: '↗' },
  text: { w: 3, h: 30, r: 2, label: '' },
};

export default function Cursor() {
  const { fine, reduced } = useApp();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const shapeRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const shape = shapeRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !shape) return;

    const html = document.documentElement;
    html.classList.add('custom-cursor');

    // x/y carry raw pointer coordinates; the centring offset lives in the
    // same transform so no CSS translate can fight GSAP.
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200, autoAlpha: 0 });
    gsap.set(shape, { width: STATES.idle.w, height: STATES.idle.h, borderRadius: STATES.idle.r });

    const dx = gsap.quickTo(dot, 'x', { duration: 0.02, ease: 'none' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.02, ease: 'none' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' });
    const sx = gsap.quickTo(shape, 'scaleX', { duration: 0.3, ease: 'power3.out' });
    const sy = gsap.quickTo(shape, 'scaleY', { duration: 0.3, ease: 'power3.out' });
    const srot = gsap.quickTo(shape, 'rotation', { duration: 0.25, ease: 'power3.out' });

    let px = -200;
    let py = -200;
    let lastX = px;
    let lastY = py;
    let speed = 0;
    let angle = 0;
    let snapEl = null;
    let state = 'idle';
    let visible = false;

    const setShape = (w, h, r) =>
      gsap.to(shape, {
        width: w,
        height: h,
        borderRadius: r,
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });

    const applyState = (next) => {
      if (next === state) return;
      state = next;
      snapEl = null;
      const s = STATES[next] || STATES.idle;
      if (label) label.textContent = s.label;
      shape.dataset.state = next;
      setShape(s.w, s.h, s.r);
    };

    const applySnap = (el) => {
      if (snapEl === el) return;
      snapEl = el;
      state = 'snap';
      const rect = el.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(el).borderRadius) || 8;
      shape.dataset.state = 'snap';
      if (label) label.textContent = '';
      setShape(rect.width + 12, rect.height + 12, radius + 6);
    };

    /* ---------- pointer tracking ---------- */

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, overwrite: 'auto' });
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
    };

    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      dx(px);
      dy(py);
      show();
    };

    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.16, overwrite: 'auto' });
    const onUp = () =>
      gsap.to(ring, { scale: 1, duration: 0.36, ease: 'back.out(2)', overwrite: 'auto' });

    /* ---------- delegated state detection ---------- */

    const resolve = (target) => {
      if (!(target instanceof Element)) return;

      const snap = target.closest('[data-cursor-snap]');
      if (snap) {
        applySnap(snap);
        return;
      }

      const tagged = target.closest('[data-cursor]');
      if (tagged) {
        const v = tagged.getAttribute('data-cursor');
        applyState(STATES[v] ? v : 'hover');
        return;
      }
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        applyState('text');
        return;
      }
      if (target.closest('a, button, [role="button"], summary')) {
        applyState('hover');
        return;
      }
      applyState('idle');
    };

    const onOver = (e) => resolve(e.target);
    const onOut = (e) => {
      // pointerout fires constantly while traversing nested nodes — re-resolve
      // against what we moved INTO rather than blindly resetting.
      if (e.relatedTarget instanceof Element) resolve(e.relatedTarget);
      else applyState('idle');
    };

    /* ---------- per-frame: snap target + velocity stretch ---------- */

    const tick = () => {
      let tx = px;
      let ty = py;

      if (snapEl) {
        // Exactly one rect per frame, and only while snapped.
        const r = snapEl.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      }

      rx(tx);
      ry(ty);

      const vx = px - lastX;
      const vy = py - lastY;
      lastX = px;
      lastY = py;

      const raw = Math.min(Math.hypot(vx, vy) / 42, 1);
      // Asymmetric smoothing: snap into the stretch, relax out of it.
      speed += (raw - speed) * (raw > speed ? 0.45 : 0.1);
      if (raw > 0.02) angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      if (snapEl || state === 'text') {
        sx(1);
        sy(1);
        srot(0);
      } else {
        sx(1 + speed * 0.5);
        sy(1 - speed * 0.3);
        srot(angle);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    window.addEventListener('blur', hide);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      window.removeEventListener('blur', hide);
      gsap.killTweensOf([dot, ring, shape]);
      html.classList.remove('custom-cursor');
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__dot" ref={dotRef} />
      <div className="cursor__ring" ref={ringRef}>
        <div className="cursor__shape" ref={shapeRef} data-state="idle">
          <span className="cursor__label mono" ref={labelRef} />
        </div>
      </div>
    </div>
  );
}
