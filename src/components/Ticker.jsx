/* =========================================================
   TICKER — velocity-coupled marquee band.
   Decorative, so the whole thing is aria-hidden; duplicated
   text in the accessibility tree is noise, not content.
   ========================================================= */

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { TICKER } from '../data/content.js';
import '../styles/ticker.css';

/* Four copies: the tween travels exactly half the track, so copies 3-4
   are already in place where copies 1-2 started — seamless, no modifiers. */
const COPIES = 4;

function Row({ reversed, trackRef }) {
  return (
    <div className="ticker__row">
      <div className={`ticker__track${reversed ? ' is-rev' : ''}`} ref={trackRef}>
        {Array.from({ length: COPIES }).flatMap((_, c) =>
          TICKER.map((word) => (
            <span className="ticker__item" key={`${c}-${word}`} data-cursor="hover">
              <i className="ticker__dot" />
              {word}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default function Ticker() {
  const { reduced } = useApp();
  const rootRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const root = document.documentElement;
    const section = rootRef.current;

    const tlA = gsap.fromTo(
      a,
      { xPercent: 0 },
      { xPercent: -50, duration: 46, ease: 'none', repeat: -1 }
    );
    const tlB = gsap.fromTo(
      b,
      { xPercent: -50 },
      { xPercent: 0, duration: 52, ease: 'none', repeat: -1 }
    );

    let current = 1;
    let hovered = false;

    /* The scroll hook writes --scroll-vel as an INLINE custom property on
       :root, so this reads the inline style rather than getComputedStyle —
       a computed-style read every frame is a measurable cost. */
    const tick = () => {
      const v = parseFloat(root.style.getPropertyValue('--scroll-vel')) || 0;
      // Scrolling up drives the target negative, which runs the loop backwards.
      const target = hovered ? 0 : 1 + v * 7;
      current += (target - current) * 0.07;
      tlA.timeScale(current);
      tlB.timeScale(current);
    };

    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };

    section?.addEventListener('pointerenter', onEnter);
    section?.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      section?.removeEventListener('pointerenter', onEnter);
      section?.removeEventListener('pointerleave', onLeave);
      tlA.kill();
      tlB.kill();
      gsap.set([a, b], { clearProps: 'transform' });
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div className="ticker ticker--static" aria-hidden="true">
        <div className="ticker__row">
          <div className="ticker__static">
            {TICKER.map((word) => (
              <span className="ticker__item" key={word}>
                <i className="ticker__dot" />
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker" ref={rootRef} aria-hidden="true">
      <Row trackRef={aRef} />
      <Row trackRef={bRef} reversed />
    </div>
  );
}
