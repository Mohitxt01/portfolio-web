import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

/**
 * Owns the scroll pipeline for the whole app. Mount exactly once.
 *
 * Responsibilities:
 *  - Lenis smooth scroll, wired into ScrollTrigger as the scroller proxy
 *  - publishes `--scroll-vel` (-1..1) and `--scroll-progress` (0..1) as CSS vars
 *  - exposes window.__lenis so nav / palette / terminal can scrollTo()
 *
 * @param {boolean} active  false during the preloader, and when reduced-motion is on
 * @param {(v:number)=>void} [onVelocity]  receives normalised velocity each tick
 */
export default function useSmoothScroll(active, onVelocity) {
  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion: no inertia, no velocity theatre. Native scroll,
    // ScrollTrigger still works, CSS vars stay at rest.
    if (reduced) {
      document.documentElement.style.setProperty('--scroll-vel', '0');
      const onNative = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--scroll-progress', p.toFixed(4));
      };
      onNative();
      window.addEventListener('scroll', onNative, { passive: true });
      return () => window.removeEventListener('scroll', onNative);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices have their own excellent inertia; overriding it
      // always feels worse than leaving it alone.
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    window.__lenis = lenis;

    const root = document.documentElement;

    lenis.on('scroll', ({ velocity, progress }) => {
      ScrollTrigger.update();

      // Lenis velocity is in px/frame and can spike hard on a trackpad
      // flick. Normalise to roughly -1..1 so CSS and the shader can
      // consume it without each re-deriving a magic divisor.
      const v = Math.max(-1, Math.min(1, (velocity || 0) / 28));
      root.style.setProperty('--scroll-vel', v.toFixed(4));
      root.style.setProperty('--scroll-progress', (progress || 0).toFixed(4));
      onVelocity?.(v);
    });

    // Drive Lenis from GSAP's ticker rather than a second rAF loop, so
    // scroll and animation advance on the same frame — no 1-frame jitter.
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    lenis.on('scroll', ScrollTrigger.update);
    window.addEventListener('resize', refresh);

    // Fonts landing late changes every measured offset on the page.
    document.fonts?.ready.then(refresh);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', refresh);
      lenis.destroy();
      delete window.__lenis;
      root.style.setProperty('--scroll-vel', '0');
    };
  }, [active, onVelocity]);
}

/** Scroll to an element id, through Lenis when it is running. */
export function scrollToId(id, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.25 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
