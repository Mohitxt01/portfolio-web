import { useEffect } from 'react';
import { gsap, SplitText } from '../lib/gsap.js';

/**
 * Global scroll-reveal pass.
 *
 * Any element with `.reveal` fades and rises into place once. Add
 * `data-reveal-stagger` to a parent to stagger its `.reveal` children
 * as one group instead of triggering each independently.
 *
 * Mount once from App, after the preloader has handed off.
 */
export default function useReveal(active) {
  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
      return;
    }

    const ctx = gsap.context(() => {
      // Grouped staggers first, and mark their children so the
      // individual pass below does not claim them twice.
      gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
        const items = group.querySelectorAll('.reveal');
        if (!items.length) return;
        items.forEach((el) => el.setAttribute('data-revealed-by-group', ''));

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.075,
          ease: 'volt',
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        });
      });

      gsap.utils
        .toArray('.reveal')
        .filter((el) => !el.hasAttribute('data-revealed-by-group'))
        .forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'volt',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
    });

    return () => ctx.revert();
  }, [active]);
}

/**
 * Split a heading into lines and mask-reveal them upward.
 * Pass a ref to the heading element.
 */
export function useLineReveal(ref, { active = true, start = 'top 85%' } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = 1;
      return;
    }

    let split;
    const ctx = gsap.context(() => {
      // SplitText needs final metrics; fonts must have landed first.
      split = new SplitText(el, { type: 'lines', linesClass: 'split-line' });
      gsap.set(el, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 118,
        duration: 1.15,
        stagger: 0.09,
        ease: 'volt',
        scrollTrigger: { trigger: el, start, once: true },
      });
    });

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [ref, active, start]);
}

/* Re-export so callers do not need a second import for the split type. */
export { SplitText } from '../lib/gsap.js';
