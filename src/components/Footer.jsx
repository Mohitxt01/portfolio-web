/* =========================================================
   FOOTER — the last line of the document.
   Quiet and typographic on purpose: after the contact
   section shouts, this should only murmur.
   ========================================================= */

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useApp } from '../context/AppContext.jsx';
import { scrollToId } from '../hooks/useSmoothScroll.js';
import { PERSON } from '../data/content.js';
import '../styles/footer.css';

const COLOPHON = ['React', 'GSAP', 'Lenis', 'raw WebGL2', 'hand-written CSS'];

export default function Footer() {
  const { play } = useApp();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    play('click');
    scrollToId('home');
  };

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__brand">
          <span className="foot__mark display" aria-hidden="true">
            {PERSON.initials}
          </span>
          <span className="foot__name">
            <strong>{PERSON.name}</strong>
            <span className="foot__role mono">{PERSON.title}</span>
          </span>
        </div>

        <p className="foot__colophon mono">
          <span className="foot__colophon-label">Built with</span>
          {COLOPHON.map((item, i) => (
            <span key={item}>
              {i > 0 && <span className="foot__dot" aria-hidden="true" />}
              {item}
            </span>
          ))}
        </p>

        <p className="foot__legal mono">
          <span>&copy; {new Date().getFullYear()} {PERSON.name}</span>
          <span className="foot__dot" aria-hidden="true" />
          <span>Designed &amp; built from scratch</span>
        </p>
      </div>

      <button
        type="button"
        className={`foot__top${showTop ? ' is-visible' : ''}`}
        onClick={toTop}
        aria-label="Back to top"
        // Hidden from the tab order while invisible — a focusable control
        // nobody can see is a keyboard trap in all but name.
        tabIndex={showTop ? 0 : -1}
        data-cursor="hover"
        data-cursor-snap=""
      >
        <FiArrowUp aria-hidden="true" />
      </button>
    </footer>
  );
}
