import { useEffect, useRef } from 'react';

export default function Backdrop() {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      if (backdropRef.current) {
        backdropRef.current.style.setProperty('--x', `${e.clientX}px`);
        backdropRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="backdrop-wrapper" ref={backdropRef} style={{ '--x': '50vw', '--y': '50vh' }}>
      {/* Pitch black base */}
      <div className="backdrop-base"></div>
      
      {/* Hidden grid and noise that gets revealed by spotlight */}
      <div className="backdrop-spotlight-layer">
        <div className="noise monochrome-noise"></div>
        <div className="monochrome-grid"></div>
      </div>
    </div>
  );
}
