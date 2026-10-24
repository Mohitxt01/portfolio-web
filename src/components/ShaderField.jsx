import { useEffect, useRef } from 'react';
import { mountField } from '../lib/glField.js';
import { useApp } from '../context/AppContext.jsx';
import '../styles/shader.css';

/**
 * The atmosphere layer: a fixed, full-viewport GLSL field behind everything.
 *
 * Three quality paths, chosen by device capability:
 *   high / medium — the real shader, at a clamped render scale
 *   low / reduced — a static CSS gradient that matches the shader's
 *                   composition, so the page still looks designed
 *                   rather than simply empty
 */
export default function ShaderField() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const { tier, reduced, booted } = useApp();

  const useShader = !reduced && tier !== 'low';

  useEffect(() => {
    if (!useShader) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const field = mountField(canvas, { tier });
    if (!field) {
      // WebGL refused at runtime — fall back to the CSS layer.
      canvas.classList.add('is-dead');
      return;
    }
    fieldRef.current = field;

    // Feed scroll velocity in from the CSS var the scroll hook publishes.
    // Reading one custom property per frame is cheaper than a second
    // scroll subscription, and keeps the shader in sync with the CSS.
    let raf;
    const root = document.documentElement;
    const pump = () => {
      raf = requestAnimationFrame(pump);
      const v = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-vel')) || 0;
      field.setVelocity(v * 1.2);
    };
    raf = requestAnimationFrame(pump);

    return () => {
      cancelAnimationFrame(raf);
      field.destroy();
      fieldRef.current = null;
    };
  }, [useShader, tier]);

  /* Hold the field dark until the preloader curtain lifts, then bloom in. */
  useEffect(() => {
    fieldRef.current?.setIntensity(booted ? 1 : 0.25);
  }, [booted]);

  return (
    <div className="field" aria-hidden="true">
      {useShader ? (
        <canvas ref={canvasRef} className="field__gl" />
      ) : (
        <div className="field__static" />
      )}
      <div className="field__grid" />
      <div className="field__vignette" />
    </div>
  );
}
