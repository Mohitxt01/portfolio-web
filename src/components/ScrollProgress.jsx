import { useEffect, useRef, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredDot, setHoveredDot] = useState(null);
  const rafRef = useRef(null);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

        // Determine active section
        const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean);
        let current = 'home';
        for (const el of sectionEls) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = el.id;
          }
        }
        setActiveSection(current);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Top progress bar */}
      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Side section indicators */}
      <nav className="scroll-dots" aria-label="Section navigation">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`scroll-dot ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => scrollTo(s.id)}
            onMouseEnter={() => setHoveredDot(s.id)}
            onMouseLeave={() => setHoveredDot(null)}
            aria-label={s.label}
            data-cursor="hover"
          >
            <span className="scroll-dot-pip" />
            <span className={`scroll-dot-label ${hoveredDot === s.id ? 'visible' : ''}`}>
              {s.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
