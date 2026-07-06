import { useEffect, useState, useRef } from 'react';

const LINKS = [
  { num: '01', label: 'About', href: '#about' },
  { num: '02', label: 'Experience', href: '#experience' },
  { num: '03', label: 'Projects', href: '#projects' },
  { num: '04', label: 'Skills', href: '#skills' },
  { num: '05', label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const indicatorRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Active section tracking
      const sections = ['contact', 'skills', 'projects', 'experience', 'about', 'home'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate the underline indicator to the active link
  useEffect(() => {
    const activeLink = document.querySelector(`.nav-links a[href="#${activeSection}"]`);
    const indicator = indicatorRef.current;
    if (activeLink && indicator) {
      const linkRect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.closest('.nav-links').getBoundingClientRect();
      indicator.style.width = linkRect.width + 'px';
      indicator.style.left = (linkRect.left - parentRect.left) + 'px';
      indicator.style.opacity = activeSection === 'home' ? '0' : '1';
    }
  }, [activeSection]);

  const handleAnchor = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="nav-logo" data-cursor="hover" onClick={(e) => handleAnchor(e, '#home')}>
            <span className="logo-mark">M</span>
            <span className="logo-text">Mohit Tantway</span>
            <span className="logo-dot"></span>
          </a>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className={activeSection === l.href.slice(1) ? 'active' : ''}
                  onClick={(e) => handleAnchor(e, l.href)}
                >
                  <span>{l.num}</span> {l.label}
                </a>
              </li>
            ))}
            <div className="nav-indicator" ref={indicatorRef} />
          </ul>
          <a href="#contact" className="nav-cta" data-cursor="hover" onClick={(e) => handleAnchor(e, '#contact')}>
            <span>Let's Talk</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <button
            className={`nav-toggle${open ? ' active' : ''}`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ '--menu-index': i }}>
              <a href={l.href} onClick={(e) => handleAnchor(e, l.href)}>
                <span className="mobile-menu-num">{l.num}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-foot">
          <a href="mailto:mohittantway1234@gmail.com">mohittantway1234@gmail.com</a>
        </div>
      </div>
    </>
  );
}
