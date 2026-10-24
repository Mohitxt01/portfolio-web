/* =========================================================
   SKILLS — domain selector + filtered skill cloud.
   Filtering is a real FLIP: survivors travel from their old
   rect to their new one, leavers scale out, arrivals fade up.
   ========================================================= */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { SKILL_DOMAINS } from '../data/content.js';
import '../styles/skills.css';

const ALL_CHIPS = SKILL_DOMAINS.flatMap((d) =>
  d.skills.map((name) => ({ key: `${d.id}:${name}`, name, domain: d.id, accent: d.accent }))
);

const ALL_BLURB =
  'Everything at once — the backend, the intelligence layer, the data underneath, and the surface on top.';

const OPTIONS = [{ id: 'all', label: 'All', accent: 'lime' }, ...SKILL_DOMAINS];

export default function Skills() {
  const { reduced, play } = useApp();
  const [active, setActive] = useState('all');

  const cloudRef = useRef(null);
  const blurbRef = useRef(null);
  const selectorRef = useRef(null);

  const chipEls = useRef(new Map());
  const prevRects = useRef(new Map());
  const transitioning = useRef(false);
  const firstPaint = useRef(true);

  const visible = useMemo(
    () => (active === 'all' ? ALL_CHIPS : ALL_CHIPS.filter((c) => c.domain === active)),
    [active]
  );

  const blurb = useMemo(() => {
    if (active === 'all') return ALL_BLURB;
    return SKILL_DOMAINS.find((d) => d.id === active)?.blurb || ALL_BLURB;
  }, [active]);

  /* ---------------- selection ---------------- */

  const select = useCallback(
    (id) => {
      if (id === active) return;
      play('click');

      if (reduced) {
        setActive(id);
        return;
      }
      if (transitioning.current) return;

      // Snapshot every current rect BEFORE React re-renders — this is the
      // "first" half of the FLIP and it cannot be recovered afterwards.
      const rects = new Map();
      chipEls.current.forEach((el, key) => {
        if (el) rects.set(key, el.getBoundingClientRect());
      });
      prevRects.current = rects;

      const nextKeys = new Set(
        (id === 'all' ? ALL_CHIPS : ALL_CHIPS.filter((c) => c.domain === id)).map((c) => c.key)
      );
      const leaving = [];
      chipEls.current.forEach((el, key) => {
        if (el && !nextKeys.has(key)) leaving.push(el);
      });

      if (!leaving.length) {
        setActive(id);
        return;
      }

      transitioning.current = true;
      gsap.to(leaving, {
        autoAlpha: 0,
        scale: 0.86,
        duration: 0.24,
        ease: 'power2.in',
        stagger: { each: 0.008, from: 'random' },
        onComplete: () => {
          transitioning.current = false;
          setActive(id);
        },
      });
    },
    [active, reduced, play]
  );

  /* ---------------- FLIP: last → invert → play ---------------- */

  useLayoutEffect(() => {
    if (reduced) return;
    if (firstPaint.current) {
      firstPaint.current = false;
      prevRects.current = new Map();
      return;
    }

    const prev = prevRects.current;
    const arrivals = [];

    chipEls.current.forEach((el, key) => {
      if (!el) return;
      const before = prev.get(key);
      if (!before) {
        arrivals.push(el);
        return;
      }
      const now = el.getBoundingClientRect();
      const dx = before.left - now.left;
      const dy = before.top - now.top;
      gsap.set(el, { autoAlpha: 1, scale: 1 });
      if (dx || dy) {
        gsap.fromTo(
          el,
          { x: dx, y: dy },
          { x: 0, y: 0, duration: 0.62, ease: 'volt', overwrite: 'auto' }
        );
      } else {
        gsap.set(el, { x: 0, y: 0 });
      }
    });

    if (arrivals.length) {
      gsap.fromTo(
        arrivals,
        { autoAlpha: 0, scale: 0.9, y: 12 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          x: 0,
          duration: 0.52,
          ease: 'volt',
          stagger: { each: 0.016, from: 'start' },
          overwrite: 'auto',
        }
      );
    }

    prevRects.current = new Map();
  }, [active, reduced]);

  /* ---------------- blurb swap ---------------- */

  useEffect(() => {
    const el = blurbRef.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }
    const tw = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'swift' }
    );
    return () => tw.kill();
  }, [active, reduced]);

  /* Arrow keys walk the selector without needing Tab for every option. */
  const onSelectorKey = (e) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    const btns = Array.from(selectorRef.current?.querySelectorAll('button') || []);
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    btns[(i + dir + btns.length) % btns.length]?.focus();
  };

  return (
    <section className="section skills" id="skills">
      <div className="shell">
        <SectionHeader num="05" label="Toolkit" />
        <SectionTitle>
          The <Accent volt>tools</Accent> I reach for.
        </SectionTitle>

        <div className="skills__bar reveal">
          <div
            className="skills__select"
            ref={selectorRef}
            role="group"
            aria-label="Filter by domain"
            onKeyDown={onSelectorKey}
          >
            {OPTIONS.map((o) => (
              <button
                type="button"
                key={o.id}
                className={`skills__opt${active === o.id ? ' is-active' : ''}`}
                style={{ '--opt-accent': `var(--accent-${o.accent})` }}
                aria-pressed={active === o.id}
                onClick={() => select(o.id)}
                onPointerEnter={() => play('hover')}
                data-cursor="hover"
                data-cursor-snap=""
              >
                <span className="skills__optdot" aria-hidden="true" />
                {o.label}
              </button>
            ))}
          </div>

          <p className="skills__count mono" aria-live="polite">
            <span className="skills__countnum">{visible.length}</span> technologies ·{' '}
            {active === 'all' ? SKILL_DOMAINS.length : 1}{' '}
            {active === 'all' ? 'domains' : 'domain'}
          </p>
        </div>

        <p className="skills__blurb lead" ref={blurbRef}>
          {blurb}
        </p>

        <ul className="skills__cloud" ref={cloudRef}>
          {visible.map((c) => (
            <li
              className="skills__chip"
              key={c.key}
              ref={(el) => {
                if (el) chipEls.current.set(c.key, el);
                else chipEls.current.delete(c.key);
              }}
              style={{ '--chip-accent': `var(--accent-${c.accent})` }}
              data-cursor="hover"
            >
              <span className="skills__chipdot" aria-hidden="true" />
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
