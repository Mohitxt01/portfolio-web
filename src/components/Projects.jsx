import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiLock, FiStar, FiZap } from 'react-icons/fi';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { useLineReveal } from '../hooks/useReveal.js';
import { PROJECTS } from '../data/content.js';
import '../styles/projects.css';

/* =========================================================
   DEVICE MOCKS — pure CSS/HTML. These do the visual work
   screenshots normally would, so they are decorative to AT:
   every fact in them is already in the panel copy.
   ========================================================= */

function PipelineMock() {
  const consumers = [
    { name: 'consumer-0', part: 'p0,p3', lag: '12', state: 'running' },
    { name: 'consumer-1', part: 'p1,p4', lag: '08', state: 'running' },
    { name: 'consumer-2', part: 'p2,p5', lag: '41', state: 'catching up' },
  ];
  return (
    <div className="mock mock--pipeline" data-cursor="view" aria-hidden="true">
      <div className="mock__chrome">
        <span className="mock__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mock__chrome-title mono">scale-ops · import-group</span>
      </div>

      <div className="mock__body">
        <p className="mock__line mono">
          <span className="mock__prompt">$</span> kafka-consumer-groups --describe
        </p>

        <ul className="pipe__rows">
          {consumers.map((c) => (
            <li className="pipe__row" key={c.name}>
              <span className="pipe__name mono">{c.name}</span>
              <span className="pipe__part mono">{c.part}</span>
              <span className="pipe__lag mono">lag {c.lag}</span>
              <span className={`pipe__state mono${c.state === 'running' ? ' is-ok' : ' is-warn'}`}>
                <i />
                {c.state}
              </span>
            </li>
          ))}
        </ul>

        <div className="pipe__bar">
          <div className="pipe__bar-head mono">
            <span>batch upsert</span>
            <span>68%</span>
          </div>
          <div className="pipe__track">
            <div className="pipe__fill" />
          </div>
          <p className="pipe__caption mono">12,480,221 / 18,340,900 rows</p>
        </div>

        <div className="pipe__stats">
          <span className="pipe__stat mono">
            <b>38ms</b> p99
          </span>
          <span className="pipe__stat mono">
            <b>99.9%</b> uptime
          </span>
          <span className="pipe__stat mono">
            <b>0</b> dlq
          </span>
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="mock mock--phone" data-cursor="view" aria-hidden="true">
      <div className="phone">
        <span className="phone__pill" />
        <header className="phone__head">
          <span className="phone__avatar" />
          <span className="phone__who">
            <b>reelstylefinder</b>
            <small className="mono">instagram · direct</small>
          </span>
        </header>

        <div className="phone__thread">
          <div className="bubble bubble--in">
            <div className="reel">
              <span className="reel__frame">
                <span className="reel__play" />
              </span>
              <span className="reel__meta mono">
                reel · 0:14
                <br />
                shared with you
              </span>
            </div>
          </div>

          <p className="bubble bubble--out bubble--note mono">
            <FiZap aria-hidden="true" /> outfit detected — 3 matches
          </p>

          <div className="bubble bubble--out">
            <ul className="matches">
              <li className="match">
                <span className="match__img match__img--a" />
                <span className="match__txt">
                  <b>Oversized denim jacket</b>
                  <small className="mono">₹2,499 · 96% match</small>
                </span>
              </li>
              <li className="match">
                <span className="match__img match__img--b" />
                <span className="match__txt">
                  <b>Cargo wide-leg pant</b>
                  <small className="mono">₹1,899 · 91% match</small>
                </span>
              </li>
              <li className="match">
                <span className="match__img match__img--c" />
                <span className="match__txt">
                  <b>Chunky white sneaker</b>
                  <small className="mono">₹3,299 · 88% match</small>
                </span>
              </li>
            </ul>
          </div>

          <p className="phone__typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </p>
        </div>
      </div>
    </div>
  );
}

function BookingMock() {
  const days = [
    { d: 'MON', n: '11' },
    { d: 'TUE', n: '12' },
    { d: 'WED', n: '13', active: true },
    { d: 'THU', n: '14' },
    { d: 'FRI', n: '15' },
  ];
  const slots = [
    { t: '09:00' },
    { t: '09:30', booked: true },
    { t: '10:00', active: true },
    { t: '10:30' },
    { t: '11:00', booked: true },
    { t: '11:30' },
  ];
  return (
    <div className="mock mock--booking" data-cursor="view" aria-hidden="true">
      <div className="book">
        <header className="book__head">
          <span className="book__doc">
            <span className="book__avatar" />
            <span className="book__who">
              <b>Dr. A. Raghavan</b>
              <small className="mono">general physician · 8 yrs</small>
            </span>
          </span>
          <span className="book__rating mono">
            <FiStar aria-hidden="true" />
            4.9
          </span>
        </header>

        <p className="book__label mono">select a date</p>
        <ul className="book__days">
          {days.map((day) => (
            <li className={`book__day${day.active ? ' is-active' : ''}`} key={day.n}>
              <span className="book__day-d mono">{day.d}</span>
              <span className="book__day-n mono">{day.n}</span>
            </li>
          ))}
        </ul>

        <p className="book__label mono">available slots</p>
        <ul className="book__slots">
          {slots.map((s) => (
            <li
              className={`book__slot mono${s.active ? ' is-active' : ''}${
                s.booked ? ' is-booked' : ''
              }`}
              key={s.t}
            >
              {s.booked && <FiLock aria-hidden="true" />}
              {s.t}
            </li>
          ))}
        </ul>

        <p className="book__confirm mono">
          <FiCheck aria-hidden="true" /> slot locked · 10:00 Wed 13
        </p>
      </div>
    </div>
  );
}

const MOCKS = { pipeline: PipelineMock, phone: PhoneMock, booking: BookingMock };

/* ========================================================= */

function Panel({ project }) {
  const Mock = MOCKS[project.mock] || null;

  return (
    <article className="proj__panel" aria-labelledby={`proj-${project.id}`}>
      <div className="proj__content">
        <p className="proj__index display" aria-hidden="true">
          {project.index}
        </p>

        <header className="proj__head">
          <h3 className="proj__name display" id={`proj-${project.id}`}>
            {project.title}
          </h3>
          <p className="proj__tagline serif">{project.tagline}</p>
          <p className="proj__meta mono">
            <span>{project.year}</span>
            <span className="proj__meta-sep" aria-hidden="true">
              /
            </span>
            <span>{project.role}</span>
          </p>
        </header>

        <p className="proj__summary">{project.summary}</p>

        <ul className="proj__bullets">
          {project.bullets.map((b) => (
            <li key={b}>
              <FiArrowUpRight aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <ul className="proj__metrics">
          {project.metrics.map((m) => (
            <li className="proj__metric" key={m.label}>
              <span className="proj__metric-v display">{m.value}</span>
              <span className="proj__metric-l mono">{m.label}</span>
            </li>
          ))}
        </ul>

        <ul className="proj__stack" aria-label={`${project.title} stack`}>
          {project.stack.map((s) => (
            <li className="proj__chip mono" key={s}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="proj__mock">{Mock ? <Mock /> : null}</div>
    </article>
  );
}

export default function Projects() {
  const { reduced } = useApp();
  const titleRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useLineReveal(titleRef);

  useEffect(() => {
    if (reduced) {
      setIndex(0);
      setProgress(0);
      return;
    }

    const mm = gsap.matchMedia();

    /* The pinned timeline exists only at desktop widths; matchMedia owns
       its teardown so dropping below 1024px restores the plain stack. */
    mm.add('(min-width: 1024px)', () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      // Measured, not assumed: the panels are fluid, so the scroll
      // distance has to be read from the laid-out track every refresh.
      const distance = () => Math.max(0, track.scrollWidth - viewport.offsetWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: viewport,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setIndex(Math.round(self.progress * (PROJECTS.length - 1)));
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    /* Panel widths depend on the display face; refresh once the real
       fonts land or the measured distance is wrong on first paint. */
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    else window.addEventListener('load', refresh, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [reduced]);

  return (
    <section className={`section proj${reduced ? ' proj--static' : ''}`} id="projects">
      <div className="shell">
        <SectionHeader num="04" label="Selected Work" />
        <SectionTitle className="proj__title">
          <span ref={titleRef}>
            Things I&rsquo;ve <Accent volt>built</Accent> and shipped.
          </span>
        </SectionTitle>
      </div>

      <div className="proj__viewport" ref={viewportRef}>
        <div className="proj__track" ref={trackRef}>
          {PROJECTS.map((p) => (
            <Panel project={p} key={p.id} />
          ))}
        </div>

        <div className="proj__progress" aria-hidden="true">
          <span className="proj__progress-count mono">
            {String(index + 1).padStart(2, '0')}
            <span className="proj__progress-of"> / {String(PROJECTS.length).padStart(2, '0')}</span>
          </span>
          <span className="proj__progress-bars">
            {PROJECTS.map((p, i) => (
              <span
                className={`proj__progress-seg${i === index ? ' is-active' : ''}`}
                key={p.id}
              />
            ))}
          </span>
          <span className="proj__progress-rail">
            <span className="proj__progress-fill" style={{ transform: `scaleX(${progress})` }} />
          </span>
        </div>
      </div>
    </section>
  );
}
