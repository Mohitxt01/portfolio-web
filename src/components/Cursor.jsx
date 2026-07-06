import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const rootRef = useRef(null);
  const trailsRef = useRef([]);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ox = mx;
    let oy = my;
    let raf;

    // Create trail elements
    const trailCount = 6;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-trail';
      el.style.opacity = (1 - i / trailCount) * 0.3;
      el.style.width = (8 - i) + 'px';
      el.style.height = (8 - i) + 'px';
      rootRef.current?.appendChild(el);
      trails.push({ el, x: mx, y: my });
    }
    trailsRef.current = trails;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    const tick = () => {
      ox += (mx - ox) * 0.15;
      oy += (my - oy) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.left = ox + 'px';
        outlineRef.current.style.top = oy + 'px';
      }

      // Trail physics — each follows the one before it
      for (let i = 0; i < trails.length; i++) {
        const target = i === 0 ? { x: mx, y: my } : trails[i - 1];
        trails[i].x += (target.x - trails[i].x) * (0.25 - i * 0.03);
        trails[i].y += (target.y - trails[i].y) * (0.25 - i * 0.03);
        trails[i].el.style.left = trails[i].x + 'px';
        trails[i].el.style.top = trails[i].y + 'px';
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = (e) => {
      const t = e.target;
      if (t.closest && t.closest('[data-cursor="view"]')) {
        rootRef.current?.classList.add('hover', 'cursor-view');
        setCursorText('View');
      } else if (t.closest && t.closest('[data-cursor="link"]')) {
        rootRef.current?.classList.add('hover', 'cursor-link');
        setCursorText('↗');
      } else if (t.closest && t.closest('a, button, [data-cursor="hover"]')) {
        rootRef.current?.classList.add('hover');
        setCursorText('');
      }
    };
    const onLeave = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a, button, [data-cursor="hover"], [data-cursor="view"], [data-cursor="link"]')) {
        rootRef.current?.classList.remove('hover', 'cursor-view', 'cursor-link');
        setCursorText('');
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      trails.forEach(t => t.el.remove());
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef}>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-outline" ref={outlineRef}>
        {cursorText && <span className="cursor-label">{cursorText}</span>}
      </div>
    </div>
  );
}
