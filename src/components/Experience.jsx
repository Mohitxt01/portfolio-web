import { useEffect, useRef } from 'react';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { useCounter } from '../hooks/useInteractions.js';
import { useLineReveal } from '../hooks/useReveal.js';
import { ROLES } from '../data/content.js';
import '../styles/experience.css';

/* A metric value is only countable when it is a bare number with an
   optional % / + suffix. '2L+', '4–5×' and 'OCR' are prose and must
   render verbatim instead of being coerced to NaN. */
function parseMetric(raw) {
  const m = /^(\d+(?:\.\d+)?)([%+]?)$/.exec(String(raw).trim());
  if (!m) return null;
  return { n: parseFloat(m[1]), suffix: m[2] };
}

function Metric({ value, label, sub }) {
  const parsed = parseMetric(value);
  // The hook is called unconditionally (rules of hooks); it no-ops when
  // the ref is never attached to an element.
  const counterRef = useCounter(parsed ? parsed.n : 0, { suffix: parsed ? parsed.suffix : '' });

  return (
    <div className="exp__metric">
      <span className="exp__metric-val display" ref={parsed ? counterRef : null}>
        {value}
      </span>
      <span className="exp__metric-label mono">{label}</span>
      <span className="exp__metric-sub">{sub}</span>
    </div>
  );
}

export default function Experience() {
  const { reduced } = useApp();
  const titleRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);

  useLineReveal(titleRef);

  useEffect(() => {
    const scope = timelineRef.current;
    const path = progressRef.current;
    if (!scope || !path) return;

    if (reduced) {
      // Still, complete state: full rail, every node lit.
      gsap.set(path, { drawSVG: '100%' });
      scope.querySelectorAll('.exp__dot').forEach((d) => d.classList.add('is-lit'));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(path, { drawSVG: '0%' });

      /* The rail draws across the span where the timeline actually
         occupies the viewport: from its top crossing 72% of the screen
         to its bottom crossing 78% — so the line finishes slightly
         before the last card leaves, never after. */
      gsap.to(path, {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top 72%',
          end: 'bottom 78%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray('.exp__dot', scope).forEach((dot) => {
        ScrollTrigger.create({
          trigger: dot,
          start: 'top 68%',
          onEnter: () => dot.classList.add('is-lit'),
          onLeaveBack: () => dot.classList.remove('is-lit'),
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="section exp" id="experience">
      <div className="shell">
        <SectionHeader num="02" label="Experience" />
        <SectionTitle className="exp__title">
          <span ref={titleRef}>
            A year of <Accent volt>shipping</Accent> real things.
          </span>
        </SectionTitle>

        <div className="exp__timeline" ref={timelineRef}>
          <div className="exp__rail" aria-hidden="true">
            <svg
              className="exp__rail-svg"
              viewBox="0 0 4 1000"
              preserveAspectRatio="none"
              focusable="false"
            >
              <path className="exp__rail-track" d="M2 0 L2 1000" />
              <path
                ref={progressRef}
                className="exp__rail-progress"
                d="M2 0 L2 1000"
              />
            </svg>
          </div>

          <ol className="exp__list">
            {ROLES.map((role) => (
              <li className="exp__item" key={role.id}>
                <span className="exp__dot" aria-hidden="true">
                  <span className="exp__dot-core" />
                </span>

                <article className="exp__card panel reveal" data-reveal-stagger>
                  <header className="exp__card-head">
                    <p className="exp__range mono reveal">
                      <span>{role.from}</span>
                      <span className="exp__range-sep" aria-hidden="true">
                        —
                      </span>
                      <span>{role.to}</span>
                    </p>
                    <h3 className="exp__role display reveal">{role.role}</h3>
                    <p className="exp__org reveal">
                      <span className="exp__org-mark" aria-hidden="true" />
                      {role.org}
                    </p>
                  </header>

                  <p className="exp__summary lead reveal">{role.summary}</p>

                  <div className="exp__metrics reveal">
                    {role.metrics.map((m) => (
                      <Metric key={m.label} {...m} />
                    ))}
                  </div>

                  <ul className="exp__bullets reveal">
                    {role.bullets.map((b) => (
                      <li className="exp__bullet" key={b}>
                        <span className="exp__bullet-mark mono" aria-hidden="true">
                          ▸
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="exp__stack reveal" aria-label={`Stack used at ${role.org}`}>
                    {role.stack.map((s) => (
                      <li className="exp__chip mono" key={s}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
