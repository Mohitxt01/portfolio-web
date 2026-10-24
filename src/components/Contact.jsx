/* =========================================================
   CONTACT — closing section.
   The headline reacts to the pointer per character; everything
   else is deliberately quiet so the email is the loudest thing.
   ========================================================= */

import { useEffect, useRef } from 'react';
import { FiCopy, FiCheck, FiLinkedin, FiMail, FiArrowUpRight, FiMapPin } from 'react-icons/fi';
import { useApp } from '../context/AppContext.jsx';
import { useMagnetic, useCopy, useLocalTime } from '../hooks/useInteractions.js';
import SectionHeader from './SectionHeader.jsx';
import { Accent } from './SectionHeader.jsx';
import { PERSON } from '../data/content.js';
import '../styles/contact.css';

/* "Asia/Kolkata" → "IST" where the platform knows the abbreviation. */
function zoneAbbr(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-IN', { timeZone, timeZoneName: 'short' }).formatToParts(
      new Date()
    );
    const name = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (name && !/^GMT/i.test(name)) return name;
  } catch {
    /* fall through */
  }
  return timeZone.split('/').pop().replace(/_/g, ' ');
}

/** Splits a word into per-character spans the pointer loop can transform. */
function Word({ children }) {
  return (
    <span className="contact__w">
      {Array.from(children).map((ch, i) => (
        <span className="contact__ch" key={`${ch}-${i}`}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const { reduced, fine, notify, play } = useApp();
  const { copied, copy } = useCopy();
  const localTime = useLocalTime(PERSON.timezone);
  const emailRef = useMagnetic({ strength: 0.16, disabled: reduced });

  const headRef = useRef(null);

  useEffect(() => {
    if (reduced || !fine) return;
    const head = headRef.current;
    if (!head) return;

    const chars = Array.from(head.querySelectorAll('.contact__ch'));
    if (!chars.length) return;

    const RADIUS = 230;
    const PUSH = 26;

    /* Rects are measured once (and on resize) and stored in DOCUMENT
       coordinates, so scrolling never invalidates the cache. Measuring
       per character per frame is the classic way to kill a page. */
    let rects = [];
    const measure = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      rects = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2 + sx, cy: r.top + r.height / 2 + sy };
      });
    };
    measure();

    const state = chars.map(() => ({ x: 0, y: 0 }));
    let mx = -99999;
    let my = -99999;
    let inView = true;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX + window.scrollX;
      my = e.clientY + window.scrollY;
    };
    const onLeave = () => {
      mx = -99999;
      my = -99999;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView) return;

      for (let i = 0; i < chars.length; i++) {
        const r = rects[i];
        const s = state[i];
        const dx = r.cx - mx;
        const dy = r.cy - my;
        const d = Math.hypot(dx, dy);

        let tx = 0;
        let ty = 0;
        if (d < RADIUS) {
          const f = (1 - d / RADIUS) ** 2 * PUSH;
          const n = d || 1;
          tx = (dx / n) * f;
          ty = (dy / n) * f;
        }

        s.x += (tx - s.x) * 0.13;
        s.y += (ty - s.y) * 0.13;
        chars[i].style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      }
    };

    let rafResize = 0;
    const onResize = () => {
      if (rafResize) return;
      rafResize = requestAnimationFrame(() => {
        rafResize = 0;
        measure();
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) measure();
      },
      { rootMargin: '20%' }
    );
    io.observe(head);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(measure).catch(() => {});
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (rafResize) cancelAnimationFrame(rafResize);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      chars.forEach((el) => {
        el.style.transform = '';
      });
    };
  }, [reduced, fine]);

  const onCopy = async () => {
    const ok = await copy(PERSON.email);
    notify(ok ? 'Email copied' : 'Could not copy', ok ? 'success' : 'error');
    play(ok ? 'success' : 'error');
  };

  return (
    <section className="section contact" id="contact">
      <div className="shell">
        <SectionHeader num="07" label="Contact" />

        <h2 className="contact__head display" ref={headRef}>
          <Word>Let&rsquo;s</Word> <Word>build</Word> <Word>something</Word>{' '}
          <Accent volt>
            <Word>extraordinary</Word>
          </Accent>{' '}
          <Word>together.</Word>
        </h2>

        <div className="contact__avail">
          <span className="contact__pulse" aria-hidden="true" />
          <span className="contact__availtext mono">
            {PERSON.available ? 'Available for new opportunities' : 'Not currently available'}
            {localTime && (
              <>
                {' · '}
                <span className="contact__time">
                  {localTime} {zoneAbbr(PERSON.timezone)}
                </span>
              </>
            )}
          </span>
        </div>

        <div className="contact__mail">
          <a
            href={`mailto:${PERSON.email}`}
            className="contact__maillink"
            ref={emailRef}
            onPointerEnter={() => play('hover')}
            data-cursor="link"
          >
            {PERSON.email}
          </a>
          <button
            type="button"
            className="contact__copy"
            onClick={onCopy}
            onPointerEnter={() => play('hover')}
            aria-label={`Copy email address ${PERSON.email}`}
            data-cursor="hover"
            data-cursor-snap=""
          >
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            <span className="mono">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <ul className="contact__cards">
          <li>
            <a
              className="contact__card panel panel-lit"
              href={PERSON.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--card-accent': 'var(--cyan)' }}
              onPointerEnter={() => play('hover')}
              data-cursor="link"
            >
              <FiLinkedin className="contact__cardicon" aria-hidden="true" />
              <span className="contact__cardlabel label">LinkedIn</span>
              <span className="contact__cardvalue">{PERSON.linkedinHandle}</span>
              <FiArrowUpRight className="contact__cardgo" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              className="contact__card panel panel-lit"
              href={`mailto:${PERSON.email}`}
              style={{ '--card-accent': 'var(--lime)' }}
              onPointerEnter={() => play('hover')}
              data-cursor="link"
            >
              <FiMail className="contact__cardicon" aria-hidden="true" />
              <span className="contact__cardlabel label">Email</span>
              <span className="contact__cardvalue">{PERSON.email}</span>
              <FiArrowUpRight className="contact__cardgo" aria-hidden="true" />
            </a>
          </li>
        </ul>

        <p className="contact__loc mono">
          <FiMapPin aria-hidden="true" />
          {PERSON.location}
        </p>
      </div>
    </section>
  );
}
