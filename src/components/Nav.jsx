import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
                <a href={l.href} data-cursor="hover" onClick={(e) => handleAnchor(e, l.href)}>
                  <span>{l.num}</span> {l.label}
                </a>
              </li>
            ))}
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
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => handleAnchor(e, l.href)}>{l.label}</a>
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
