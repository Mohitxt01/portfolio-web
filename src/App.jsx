import { useEffect, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import useSmoothScroll from './hooks/useSmoothScroll.js';
import useReveal from './hooks/useReveal.js';
import { ScrollTrigger } from './lib/gsap.js';

import ShaderField from './components/ShaderField.jsx';
import Preloader from './components/Preloader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Toast from './components/Toast.jsx';
import CommandPalette from './components/CommandPalette.jsx';

import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

/* The two heaviest interactive pieces sit below the fold. Splitting them
   out keeps the initial bundle to what the hero actually needs. */
const Architecture = lazy(() => import('./components/Architecture.jsx'));
const Terminal = lazy(() => import('./components/Terminal.jsx'));

/**
 * Wraps a lazily-loaded section. When the chunk resolves and the section
 * mounts, every ScrollTrigger below it on the page has stale offsets —
 * so re-measure once the new layout has been painted.
 */
function LazySection({ children }) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, []);
  return children;
}

function Shell() {
  const { booted, finishBoot, reduced } = useApp();

  /* Scroll + reveal only come online once the curtain has lifted, so
     ScrollTrigger measures a settled layout rather than a mid-animation one. */
  useSmoothScroll(booted);
  useReveal(booted);

  /* Mark the document ready so the CSS no-JS fallbacks stand down. */
  useEffect(() => {
    document.documentElement.classList.add('js-ready');
  }, []);

  /* Publish the pointer position for the atmosphere vignette. Written as
     CSS vars rather than React state — this fires on every mouse move. */
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    let raf = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      raf = 0;
      root.style.setProperty('--mx', `${x}px`);
      root.style.setProperty('--my', `${y}px`);
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      // Coalesce to one write per frame; pointermove can fire far more often.
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {!booted && <Preloader onComplete={finishBoot} />}

      <ShaderField />
      <Cursor />
      <Nav />
      <Toast />
      <CommandPalette />

      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Experience />
        <Suspense fallback={<div className="lazy-hold" aria-hidden="true" />}>
          <LazySection>
            <Architecture />
          </LazySection>
        </Suspense>
        <Projects />
        <Skills />
        <Suspense fallback={<div className="lazy-hold" aria-hidden="true" />}>
          <LazySection>
            <Terminal />
          </LazySection>
        </Suspense>
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
