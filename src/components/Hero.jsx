import { useEffect, useRef } from 'react';
import { FiArrowDownRight, FiArrowUpRight, FiCommand } from 'react-icons/fi';
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { useMagnetic, useCounter, useLocalTime } from '../hooks/useInteractions.js';
import { scrollToId } from '../hooks/useSmoothScroll.js';
import { PERSON, STATS } from '../data/content.js';
import '../styles/hero.css';

/* One stat cell. Split out so useCounter gets its own hook instance
   per value rather than a loop of conditional hooks. */
function Stat({ value, suffix, label, sub }) {
  const ref = useCounter(value, { suffix });
  return (
    // No `.reveal` here: the hero runs its own entrance timeline, and
    // `gsap.from` would animate these back to the class's opacity: 0.
    <div className="hero__stat">
      <span className="hero__stat-num mono" ref={ref}>
        0
      </span>
      <span className="hero__stat-label">{label}</span>
      <span className="hero__stat-sub">{sub}</span>
    </div>
  );
}

export default function Hero() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const { booted, reduced, play, setPaletteOpen } = useApp();
  const time = useLocalTime(PERSON.timezone);

  const primaryRef = useMagnetic({ strength: 0.22, disabled: reduced });
  const secondaryRef = useMagnetic({ strength: 0.22, disabled: reduced });

  /* ---------- entrance: per-character mask reveal ---------- */
  useEffect(() => {
    if (!booted) return;
    const title = titleRef.current;
    if (!title) return;

    if (reduced) {
      gsap.set([title, '.hero__chrome', '.hero__lead', '.hero__cta', '.hero__stat'], {
        opacity: 1,
        clearProps: 'transform',
      });
      return;
    }

    let split;
    const ctx = gsap.context(() => {
      // Chars inside words inside lines: words keep text from breaking
      // mid-word, lines give us the mask, chars give us the stagger.
      split = new SplitText(title, {
        type: 'lines,words,chars',
        linesClass: 'hero__line',
        wordsClass: 'hero__word',
        charsClass: 'hero__char',
      });

      gsap.set(title, { opacity: 1 });

      const tl = gsap.timeline({ delay: 0.12 });

      tl.from(split.chars, {
        yPercent: 120,
        rotateX: -72,
        opacity: 0,
        duration: 1.15,
        ease: 'volt',
        stagger: { each: 0.016, from: 'start' },
      })
        .from('.hero__chrome', { y: -18, opacity: 0, duration: 0.8 }, 0.1)
        .from('.hero__role', { opacity: 0, duration: 0.6 }, 0.55)
        .from('.hero__lead', { y: 22, opacity: 0, duration: 0.95 }, 0.5)
        .from('.hero__cta > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.09 }, 0.62)
        .from('.hero__stat', { y: 24, opacity: 0, duration: 0.85, stagger: 0.07 }, 0.72)
        .from('.hero__foot > *', { opacity: 0, duration: 0.7, stagger: 0.1 }, 0.9);
    }, rootRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [booted, reduced]);

  /* ---------- role line: scramble between titles ---------- */
  useEffect(() => {
    if (!booted || reduced) return;
    const el = roleRef.current;
    if (!el) return;

    const roles = PERSON.roles;
    const tl = gsap.timeline({ repeat: -1, delay: 1.6 });

    roles.forEach((_, i) => {
      const next = roles[(i + 1) % roles.length];
      tl.to(el, {
        duration: 0.9,
        scrambleText: { text: next, chars: 'upperAndLowerCase', speed: 0.45, revealDelay: 0.18 },
        ease: 'none',
      }).to({}, { duration: 2.1 }); // hold the readable state
    });

    return () => tl.kill();
  }, [booted, reduced]);

  /* ---------- scroll: the hero recedes as the page advances ---------- */
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero__content', {
        y: -90,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const onNav = (e, id) => {
    e.preventDefault();
    play('click');
    scrollToId(id);
  };

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="shell hero__content">
        {/* ---------- status chrome ---------- */}
        <div className="hero__chrome">
          <span className="hero__status">
            <span className="hero__pulse" aria-hidden="true" />
            {PERSON.available ? 'Available for new opportunities' : 'Currently engaged'}
          </span>
          <span className="hero__chrome-sep" aria-hidden="true" />
          <span className="hero__clock mono">
            {time} IST
          </span>
        </div>

        {/* ---------- the headline ---------- */}
        <h1 className="hero__title display" ref={titleRef}>
          <span className="hero__title-l1">Full-Stack</span>
          <span className="hero__title-l2">
            <em className="serif">Engineer</em>
            <span className="hero__amp" aria-hidden="true">
              &amp;
            </span>
          </span>
          <span className="hero__title-l3">Systems Architect</span>
        </h1>

        {/* ---------- scrambling role ---------- */}
        <p className="hero__role mono" aria-label={`Also: ${PERSON.roles.join(', ')}`}>
          <span className="hero__role-caret" aria-hidden="true">
            ▸
          </span>
          <span ref={roleRef}>{PERSON.roles[0]}</span>
        </p>

        <p className="hero__lead lead">
          I'm <strong>{PERSON.name}</strong> — {PERSON.tagline}
        </p>

        {/* ---------- actions ---------- */}
        <div className="hero__cta">
          <a
            href="#projects"
            className="btn btn--primary"
            ref={primaryRef}
            onClick={(e) => onNav(e, 'projects')}
            data-cursor="hover"
            data-cursor-snap
          >
            <span>View my work</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="btn btn--ghost"
            ref={secondaryRef}
            onClick={(e) => onNav(e, 'contact')}
            data-cursor="hover"
            data-cursor-snap
          >
            <span>Get in touch</span>
          </a>
          <button
            type="button"
            className="hero__hint"
            onClick={() => {
              play('open');
              setPaletteOpen(true);
            }}
            data-cursor="hover"
          >
            <FiCommand aria-hidden="true" />
            <span>
              Press <kbd>⌘</kbd>
              <kbd>K</kbd> to navigate
            </span>
          </button>
        </div>

        {/* ---------- headline metrics ---------- */}
        <div className="hero__stats">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ---------- base chrome ---------- */}
      <div className="hero__foot shell">
        <a href="#about" className="hero__scroll" onClick={(e) => onNav(e, 'about')} data-cursor="hover">
          <span className="label">Scroll</span>
          <FiArrowDownRight aria-hidden="true" />
          <span className="hero__scroll-rail" aria-hidden="true" />
        </a>
        <div className="hero__socials">
          <a href={PERSON.linkedin} target="_blank" rel="noreferrer" data-cursor="link">
            LinkedIn
          </a>
          <a href={`mailto:${PERSON.email}`} data-cursor="link">
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
