/* =========================================================
   PRELOADER — system boot sequence.
   ~2.2s: counter + telemetry log + name reveal, then a
   clip-path curtain lifts the whole overlay away.
   ========================================================= */

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { PERSON } from '../data/content.js';
import '../styles/preloader.css';

/* Tied to the real stack so the boot log reads as telemetry, not filler. */
const BOOT_LINES = [
  'init runtime',
  'mount /experience',
  'connect kafka://scale-ops',
  'warm redis cache',
  'resolve trino catalog',
  'compile shaders',
  'ready',
];

export default function Preloader({ onComplete }) {
  const { reduced, play } = useApp();

  const rootRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const nameRef = useRef(null);
  const logRef = useRef(null);

  // Keep the latest callback without restarting the timeline.
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    if (reduced) {
      doneRef.current?.();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    document.body.classList.add('is-locked');

    const ctx = gsap.context(() => {
      const lines = logRef.current ? Array.from(logRef.current.children) : [];
      const counter = { v: 0 };

      gsap.set(root, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 });
      gsap.set(barRef.current, { scaleX: 0 });
      gsap.set(nameRef.current, { yPercent: 115 });
      lines.forEach((li) => {
        gsap.set(li, { autoAlpha: 0, x: -10 });
        gsap.set(li.querySelector('.pre__ok'), { autoAlpha: 0, scale: 0.6 });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          doneRef.current?.();
        },
      });

      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: 'volt',
        onUpdate: () => {
          const n = Math.round(counter.v);
          if (countRef.current) countRef.current.textContent = String(n).padStart(3, '0');
          if (barRef.current) gsap.set(barRef.current, { scaleX: n / 100 });
        },
      })
        .to(nameRef.current, { yPercent: 0, duration: 1.1, ease: 'volt' }, 0.1)
        .to(
          lines,
          { autoAlpha: 1, x: 0, duration: 0.3, ease: 'swift', stagger: 0.19 },
          0.18
        )
        .to(
          lines.map((li) => li.querySelector('.pre__ok')),
          { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'back.out(2)', stagger: 0.19 },
          0.34
        )
        .call(() => playRef.current?.('boot'), null, 1.75)
        .to('.pre__inner', { autoAlpha: 0, y: -16, duration: 0.42, ease: 'swift' }, 2.0)
        // Curtain wipe: the overlay retracts upward rather than fading,
        // which hands the page over instead of dissolving into it.
        .to(
          root,
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'curtain' },
          2.14
        );
    }, rootRef);

    return () => {
      ctx.revert();
      // Unlock unconditionally — the overlay may be torn down mid-wipe.
      document.body.classList.remove('is-locked');
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="preloader" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="pre__inner">
        <header className="pre__top">
          <span className="pre__tag mono">SYSTEM BOOT</span>
          <span className="pre__tag pre__tag--dim mono">{PERSON.initials}·PORTFOLIO</span>
        </header>

        <div className="pre__namewrap">
          <h1 className="pre__name display" ref={nameRef}>
            {PERSON.name}
          </h1>
        </div>

        <ul className="pre__log mono" ref={logRef}>
          {BOOT_LINES.map((line) => (
            <li className="pre__line" key={line}>
              <span className="pre__ok">ok</span>
              <span className="pre__text">{line}</span>
            </li>
          ))}
        </ul>

        <div className="pre__meter">
          <span className="pre__count mono" ref={countRef}>
            000
          </span>
          <span className="pre__pct mono">%</span>
          <span className="pre__hint label">establishing session</span>
        </div>
      </div>

      <div className="pre__bar">
        <i className="pre__barfill" ref={barRef} />
      </div>
    </div>
  );
}
