import { useEffect, useRef, useState } from 'react';

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    let cur = 0;
    const interval = setInterval(() => {
      cur += Math.random() * 12 + 4;
      if (cur >= 100) {
        cur = 100;
        clearInterval(interval);
        setPct(100);
        setTimeout(() => {
          setDone(true);
          if (!calledRef.current) {
            calledRef.current = true;
            onDone?.();
          }
        }, 400);
        return;
      }
      setPct(cur);
    }, 120);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className={`loader${done ? ' done' : ''}`}>
      <div className="loader-content">
        <div className="loader-eyebrow">
          <span className="loader-pulse"></span>
          <span>Welcome</span>
        </div>

        <h1 className="loader-name">
          Mohit <em>Tantway</em>
        </h1>

        <div className="loader-role">Full-Stack Developer · System Architect</div>

        <div className="loader-progress">
          <div className="loader-bar">
            <div className="loader-bar-fill" style={{ width: pct + '%' }}></div>
          </div>
          <div className="loader-percent">
            <span>{String(Math.floor(pct)).padStart(3, '0')}</span>
            <span className="loader-percent-sym">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
