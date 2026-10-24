/* =========================================================
   NAV — fixed top bar, mobile overlay, and the right-edge
   section rail. Also carries the scroll-progress hairline.
   ========================================================= */

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { FiMenu, FiX, FiVolume2, FiVolumeX, FiArrowUpRight } from 'react-icons/fi';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { scrollToId } from '../hooks/useSmoothScroll.js';
import { SECTIONS, PERSON } from '../data/content.js';
import '../styles/nav.css';

const LINKS = SECTIONS.filter((s) => s.id !== 'home');

function isApplePlatform() {
  if (typeof navigator === 'undefined') return false;
  const p = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
  return /mac|iphone|ipad|ipod/i.test(p);
}

export default function Nav() {
  const { setPaletteOpen, sound, toggleSound, play, reduced } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [measureKey, setMeasureKey] = useState(0);
  const [isMac] = useState(isApplePlatform);

  const listRef = useRef(null);
  const indRef = useRef(null);
  const linkRefs = useRef({});
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const restoreFocus = useRef(null);

  /* ---------------- scrolled state ---------------- */

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 60);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------------- active section ---------------- */

  useEffect(() => {
    let triggers = [];
    let known = '';

    const build = () => {
      const found = SECTIONS.filter((s) => document.getElementById(s.id));
      const key = found.map((s) => s.id).join(',');
      // Nothing new arrived — rebuilding would just churn triggers.
      if (key === known) return;
      known = key;

      triggers.forEach((t) => t.kill());
      triggers = found.map((s) =>
        ScrollTrigger.create({
          trigger: document.getElementById(s.id),
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setActive(s.id);
          },
        })
      );
      ScrollTrigger.refresh();
    };

    build();

    /* Architecture and Terminal are code-split, so they are absent from the
       DOM on first run and their links could never activate. Watch <main>
       and rebuild once their chunks mount. */
    const main = document.getElementById('main');
    const mo = main ? new MutationObserver(build) : null;
    mo?.observe(main, { childList: true });

    return () => {
      mo?.disconnect();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  /* ---------------- sliding indicator ----------------
     Measured from live rects rather than assumed widths, because the
     labels are variable-width and the font loads late. */

  useLayoutEffect(() => {
    const list = listRef.current;
    const ind = indRef.current;
    if (!list || !ind) return;

    const el = linkRefs.current[active];
    if (!el) {
      gsap.to(ind, { autoAlpha: 0, duration: reduced ? 0 : 0.2, overwrite: 'auto' });
      return;
    }

    const lr = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    gsap.to(ind, {
      autoAlpha: 1,
      x: r.left - lr.left,
      width: r.width,
      duration: reduced ? 0 : 0.55,
      ease: 'volt',
      overwrite: 'auto',
    });
  }, [active, measureKey, reduced]);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setMeasureKey((k) => k + 1);
      });
    };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------------- mobile menu motion ---------------- */

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const items = menu.querySelectorAll('.navmenu__item');
    const foot = menu.querySelector('.navmenu__foot');

    if (reduced) {
      gsap.set(menu, { autoAlpha: menuOpen ? 1 : 0, clipPath: 'none' });
      gsap.set([...items, foot].filter(Boolean), { autoAlpha: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline();
    if (menuOpen) {
      tl.set(menu, { autoAlpha: 1 })
        .fromTo(
          menu,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.68, ease: 'curtain' }
        )
        .fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.055, ease: 'volt' },
          0.2
        )
        .fromTo(foot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.42);
    } else {
      tl.to(items, { autoAlpha: 0, y: -14, duration: 0.24, stagger: 0.022, ease: 'power2.in' })
        .to(foot, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.48, ease: 'curtain' }, 0.12)
        .set(menu, { autoAlpha: 0 });
    }

    return () => tl.kill();
  }, [menuOpen, reduced]);

  /* ---------------- overlay: lock, escape, focus trap ---------------- */

  useEffect(() => {
    if (!menuOpen) return;

    document.body.classList.add('is-locked');
    restoreFocus.current = document.activeElement;

    const menu = menuRef.current;
    const focusables = () =>
      Array.from(
        menu?.querySelectorAll('a[href], button:not([disabled])') || []
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const first = focusables()[0];
    first?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      // Tab must cycle inside the overlay — otherwise focus walks off into
      // the page behind it, which is invisible to the user.
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      const back = restoreFocus.current;
      if (back && typeof back.focus === 'function') back.focus();
      else burgerRef.current?.focus();
    };
  }, [menuOpen]);

  /* ---------------- handlers ---------------- */

  const go = useCallback(
    (id) => (e) => {
      e?.preventDefault();
      play('click');
      setMenuOpen(false);
      scrollToId(id, -72);
    },
    [play]
  );

  const toTop = useCallback(
    (e) => {
      e.preventDefault();
      play('click');
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [play]
  );

  const onHover = useCallback(() => play('hover'), [play]);

  return (
    <>
      {/* Document progress. Driven purely by the CSS var the scroll hook publishes. */}
      <div className="nav__progress" aria-hidden="true">
        <i />
      </div>

      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav__inner">
          <button
            type="button"
            className="logo"
            onClick={toTop}
            onPointerEnter={onHover}
            aria-label="Back to top"
            data-cursor="hover"
            data-cursor-snap=""
          >
            <span className="logo__mark display" aria-hidden="true">
              {PERSON.initials}
            </span>
            <span className="logo__word">
              <span className="logo__name">{PERSON.name}</span>
              <span className="logo__dot" aria-hidden="true" />
            </span>
          </button>

          <nav className="nav__links" aria-label="Sections">
            <ul ref={listRef}>
              {LINKS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    ref={(el) => {
                      if (el) linkRefs.current[s.id] = el;
                      else delete linkRefs.current[s.id];
                    }}
                    className={`nav__link${active === s.id ? ' is-active' : ''}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    onClick={go(s.id)}
                    onPointerEnter={onHover}
                    data-cursor="hover"
                  >
                    <span className="nav__num mono">{s.num}</span>
                    <span className="nav__label">{s.label}</span>
                  </a>
                </li>
              ))}
              <li className="nav__ind" ref={indRef} aria-hidden="true" />
            </ul>
          </nav>

          <div className="nav__actions">
            <button
              type="button"
              className="nav__k mono"
              onClick={() => {
                play('open');
                setPaletteOpen(true);
              }}
              onPointerEnter={onHover}
              aria-label="Open command palette"
              data-cursor="hover"
              data-cursor-snap=""
            >
              <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
              <kbd>K</kbd>
            </button>

            <button
              type="button"
              className="nav__icon"
              onClick={() => {
                toggleSound();
                play('click');
              }}
              onPointerEnter={onHover}
              aria-pressed={sound}
              aria-label={sound ? 'Mute interface sound' : 'Enable interface sound'}
              data-cursor="hover"
              data-cursor-snap=""
            >
              {sound ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
            </button>

            <a
              href="#contact"
              className="nav__cta"
              onClick={go('contact')}
              onPointerEnter={onHover}
              data-cursor="hover"
              data-cursor-snap=""
            >
              <span>Let&rsquo;s Talk</span>
              <FiArrowUpRight aria-hidden="true" />
            </a>

            <button
              type="button"
              className="nav__burger"
              ref={burgerRef}
              onClick={() => {
                play(menuOpen ? 'close' : 'open');
                setMenuOpen((o) => !o);
              }}
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-cursor="hover"
            >
              {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- mobile overlay ---------------- */}
      <div
        className="navmenu"
        id="nav-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <ul className="navmenu__list">
          {LINKS.map((s) => (
            <li className="navmenu__item" key={s.id}>
              <a href={`#${s.id}`} onClick={go(s.id)} data-cursor="hover">
                <span className="navmenu__num mono">{s.num}</span>
                <span className="navmenu__label display">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="navmenu__foot">
          <span className="label">Direct</span>
          <a href={`mailto:${PERSON.email}`} className="navmenu__mail mono" data-cursor="link">
            {PERSON.email}
          </a>
          <span className="navmenu__loc mono">{PERSON.location}</span>
        </div>
      </div>

      {/* ---------------- right-edge section rail ---------------- */}
      <aside className="rail" aria-label="Section rail">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`rail__dot${active === s.id ? ' is-active' : ''}`}
                onClick={go(s.id)}
                onPointerEnter={onHover}
                aria-label={`Go to ${s.label}`}
                aria-current={active === s.id ? 'true' : undefined}
                data-cursor="hover"
              >
                <span className="rail__tip mono" aria-hidden="true">
                  {s.label}
                </span>
                <span className="rail__bar" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
