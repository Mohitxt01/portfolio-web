import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ox = mx;
    let oy = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    const tick = () => {
      ox += (mx - ox) * 0.18;
      oy += (my - oy) * 0.18;
      if (outlineRef.current) {
        outlineRef.current.style.left = ox + 'px';
        outlineRef.current.style.top = oy + 'px';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a, button, [data-cursor="hover"]')) {
        rootRef.current?.classList.add('hover');
      }
    };
    const onLeave = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a, button, [data-cursor="hover"]')) {
        rootRef.current?.classList.remove('hover');
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
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef}>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-outline" ref={outlineRef}></div>
    </div>
  );
}
