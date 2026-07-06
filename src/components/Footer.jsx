import { useState, useEffect } from 'react';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo gradient-text">Mohit Tantway</div>
          <div className="footer-sub">Full-Stack Developer · System Architect</div>
        </div>
        <div className="footer-center">
          <div className="footer-heartbeat">
            Crafted with <span className="heart">❤</span> care
          </div>
        </div>
        <div className="footer-meta">
          <span>© 2026 — Designed & built from scratch</span>
          <span>React · GSAP · Lenis · Vanilla CSS</span>
        </div>
      </div>

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        data-cursor="hover"
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
