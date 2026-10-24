/* =========================================================
   Small interaction hooks shared across sections.
   ========================================================= */

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../lib/gsap.js';

/* ---------------------------------------------------------
   useInView — one-shot or continuous visibility
   --------------------------------------------------------- */
export function useInView({ threshold = 0.25, once = true, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}

/* ---------------------------------------------------------
   useMagnetic — element leans toward the pointer, then springs back
   --------------------------------------------------------- */
export function useMagnetic({ strength = 0.3, scale = 1, disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const to = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      to((e.clientX - (r.left + r.width / 2)) * strength);
      toY((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onEnter = () => scale !== 1 && gsap.to(el, { scale, duration: 0.4, ease: 'power3.out' });
    const onLeave = () => {
      to(0);
      toY(0);
      if (scale !== 1) gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, scale, disabled]);

  return ref;
}

/* ---------------------------------------------------------
   useSpotlight — writes --px/--py for `.panel-lit` surfaces
   --------------------------------------------------------- */
export function useSpotlight() {
  const onMove = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', `${e.clientX - r.left}px`);
    el.style.setProperty('--py', `${e.clientY - r.top}px`);
  }, []);
  return onMove;
}

/* ---------------------------------------------------------
   useCounter — counts a number up when it scrolls into view

   Returns a ref for the display element. Writes textContent
   directly so React never re-renders 60× per second.
   --------------------------------------------------------- */
export function useCounter(target, { suffix = '', duration = 1.9, decimals = null } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Infer decimals from the source value (99.9 -> 1dp, 100 -> 0dp)
    // so callers do not have to specify it.
    const dp = decimals ?? (Number.isInteger(target) ? 0 : 1);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      el.textContent = target.toFixed(dp) + suffix;
      return;
    }

    el.textContent = (0).toFixed(dp) + suffix;

    const obj = { v: 0 };
    let tween;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        tween = gsap.to(obj, {
          v: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.v.toFixed(dp) + suffix;
          },
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [target, suffix, duration, decimals]);

  return ref;
}

/* ---------------------------------------------------------
   useCopy — copy to clipboard with a resolved/failed signal
   --------------------------------------------------------- */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);
  return { copied, copy };
}

/* ---------------------------------------------------------
   useLocalTime — live clock in a fixed zone (for the "available" chip)
   --------------------------------------------------------- */
export function useLocalTime(timeZone = 'Asia/Kolkata') {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}
