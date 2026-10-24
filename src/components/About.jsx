import { useEffect, useRef, useState } from 'react';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { useSpotlight } from '../hooks/useInteractions.js';
import { useLineReveal } from '../hooks/useReveal.js';
import { PERSON, PILLARS, FACTS, NOW, PHILOSOPHY } from '../data/content.js';
import '../styles/about.css';

/* ---------------------------------------------------------
   The code card. A real-looking source file beats a stock
   photo, and it tilts toward the pointer so it reads as an
   object sitting on the page rather than an image of one.
   --------------------------------------------------------- */
function CodeCard({ reduced }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rx = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      // Normalise pointer position to -0.5..0.5 within the card, then
      // map to a shallow tilt. Anything past ~10deg starts to look like
      // a gimmick rather than depth.
      ry(((e.clientX - r.left) / r.width - 0.5) * 14);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(card);
    };
  }, [reduced]);

  return (
    <div className="code" ref={wrapRef}>
      <div className="code__card" ref={cardRef}>
        <div className="code__bar">
          <span className="code__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="code__file mono">~/engineer.ts</span>
          <span className="code__badge mono">TS</span>
        </div>
        <pre className="code__body mono" aria-label="A TypeScript object describing Mohit Tantway">
          <code>
            <span className="c-kw">const</span> <span className="c-var">mohit</span>
            {' = {'}
            {'\n  '}
            <span className="c-prop">name</span>
            {': '}
            <span className="c-str">'Mohit Tantway'</span>
            {',\n  '}
            <span className="c-prop">role</span>
            {': '}
            <span className="c-str">'Full-Stack · Systems'</span>
            {',\n  '}
            <span className="c-prop">stack</span>
            {': ['}
            {'\n    '}
            <span className="c-str">'NestJS'</span>
            {', '}
            <span className="c-str">'Kafka'</span>
            {', '}
            <span className="c-str">'Redis'</span>
            {',\n    '}
            <span className="c-str">'Next.js'</span>
            {', '}
            <span className="c-str">'LangChain'</span>
            {',\n    '}
            <span className="c-str">'Trino'</span>
            {', '}
            <span className="c-str">'Docker'</span>
            {'\n  ],\n  '}
            <span className="c-prop">p99</span>
            {': '}
            <span className="c-num">-60</span>
            <span className="c-cmt"> // percent</span>
            {',\n  '}
            <span className="c-prop">shipping</span>
            {': '}
            <span className="c-bool">true</span>
            {',\n  '}
            <span className="c-prop">available</span>
            {': '}
            <span className="c-bool">true</span>
            {',\n};'}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   About
   --------------------------------------------------------- */
export default function About() {
  const { reduced } = useApp();
  const titleRef = useRef(null);
  const spotlight = useSpotlight();
  const [openPillar, setOpenPillar] = useState(PILLARS[0].key);

  useLineReveal(titleRef);

  return (
    <section className="section about" id="about">
      <div className="shell">
        <SectionHeader num="01" label="About" />

        <div className="about__grid">
          {/* ---------------- left: the argument ---------------- */}
          <div className="about__main">
            <SectionTitle className="about__title">
              <span ref={titleRef}>
                I build systems that hold up at <Accent volt>scale</Accent>.
              </span>
            </SectionTitle>

            <p className="lead about__lead reveal">
              Most of my work lives where correctness meets throughput — the layer where a design
              decision shows up as a latency number. I like that layer. {' '}
              <em>It keeps you honest.</em>
            </p>

            {/* Pillars as an exclusive accordion: one open at a time, so the
                column stays scannable instead of becoming a wall of prose. */}
            <ul className="about__pillars" data-reveal-stagger>
              {PILLARS.map((p, i) => {
                const open = openPillar === p.key;
                return (
                  <li
                    key={p.key}
                    className={`about__pillar panel panel-lit reveal${open ? ' is-open' : ''}`}
                    onMouseMove={spotlight}
                  >
                    <button
                      type="button"
                      className="about__pillar-head"
                      aria-expanded={open}
                      aria-controls={`pillar-${p.key}`}
                      onClick={() => setOpenPillar(open ? null : p.key)}
                      data-cursor="hover"
                    >
                      <span className="about__pillar-num mono">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="about__pillar-kicker">{p.kicker}</span>
                      <span className="about__pillar-metric mono">
                        <strong>{p.metric}</strong>
                        <small>{p.metricLabel}</small>
                      </span>
                      <span className="about__pillar-chevron" aria-hidden="true" />
                    </button>
                    <div className="about__pillar-body" id={`pillar-${p.key}`} role="region">
                      {/* The clipping wrapper has to sit between the 0fr grid
                          row and the padded paragraph — padding on the grid
                          item itself survives the collapse and leaks a sliver
                          of text. */}
                      <div className="about__pillar-clip">
                        <p>{p.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ---------------- facts ---------------- */}
            <dl className="about__facts" data-reveal-stagger>
              {FACTS.map((f) => (
                <div className="about__fact reveal" key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd>
                    <span className="about__fact-value">{f.value}</span>
                    <span className="about__fact-sub mono">{f.sub}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ---------------- right: the instrument rail ---------------- */}
          <aside className="about__rail" aria-label="Current work and philosophy">
            <div className="about__sticky">
              <div className="reveal">
                <CodeCard reduced={reduced} />
              </div>

              <div className="now panel reveal">
                <div className="now__head">
                  <span className="now__pulse" aria-hidden="true" />
                  <span className="label">Now shipping</span>
                  <span className="now__live mono">live</span>
                </div>
                <ul className="now__list">
                  {NOW.map((n) => (
                    <li className="now__item" key={n.title}>
                      <div className="now__text">
                        <span className="now__title">{n.title}</span>
                        <span className="now__sub mono">{n.sub}</span>
                      </div>
                      <span className={`now__state now__state--${n.state} mono`}>{n.state}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <figure className="quote panel reveal">
                <span className="quote__mark serif" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote>{PHILOSOPHY.quote}</blockquote>
                <figcaption className="quote__cite mono">
                  — {PERSON.name.split(' ')[0]}'s {PHILOSOPHY.attribution}
                </figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
