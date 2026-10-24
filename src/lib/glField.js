/* =========================================================
   GL FIELD — minimal WebGL2 runner for the atmosphere shader.

   Deliberately tiny and dependency-free: one program, one
   fullscreen triangle, no VAO data, no framebuffers. The whole
   thing costs a few hundred bytes gzipped next to ~600KB for
   a Three.js scene that would do less.
   ========================================================= */

import { VERT, FRAG } from './shaders.js';
import { renderScale } from './env.js';

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return sh;
}

function link(gl, vsSrc, fsSrc) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`Program link failed: ${log}`);
  }
  return p;
}

/**
 * Mount the shader field onto a canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts
 * @param {'high'|'medium'|'low'} opts.tier  render-scale budget
 * @returns {{ setVelocity(v:number):void, setIntensity(v:number):void,
 *             pause():void, resume():void, destroy():void } | null}
 *          null when WebGL2 is unavailable — caller shows the CSS fallback.
 */
export function mountField(canvas, { tier = 'high' } = {}) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    // The field is pure output; we never read it back.
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  let program;
  try {
    program = link(gl, VERT, FRAG);
  } catch (err) {
    if (import.meta.env?.DEV) console.warn('[glField]', err);
    return null;
  }

  gl.useProgram(program);

  const u = {
    res: gl.getUniformLocation(program, 'uRes'),
    time: gl.getUniformLocation(program, 'uTime'),
    mouse: gl.getUniformLocation(program, 'uMouse'),
    vel: gl.getUniformLocation(program, 'uVel'),
    intensity: gl.getUniformLocation(program, 'uIntensity'),
  };

  const scale = renderScale(tier);

  /* ---------------- state ---------------- */
  let raf = 0;
  let running = false;
  let destroyed = false;
  let visible = true;

  const start = performance.now();
  let last = start;

  // Pointer is tracked as a target and eased toward, so the lens
  // glides instead of teleporting when the mouse jumps.
  const ptr = { tx: 0.5, ty: 0.5, x: 0.5, y: 0.5 };
  let velTarget = 0;
  let vel = 0;
  let intensityTarget = 1;
  let intensity = 0; // fade up from black on first frame

  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function frame(now) {
    if (destroyed) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    // Frame-rate independent easing: convert the per-frame lerp factors
    // into a time-based one so a 120Hz display is not twice as twitchy.
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const k = (rate) => 1 - Math.exp(-rate * dt);

    ptr.x += (ptr.tx - ptr.x) * k(6);
    ptr.y += (ptr.ty - ptr.y) * k(6);
    vel += (velTarget - vel) * k(5);
    intensity += (intensityTarget - intensity) * k(3);

    resize();

    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, (now - start) / 1000);
    gl.uniform2f(u.mouse, ptr.x, ptr.y);
    gl.uniform1f(u.vel, vel);
    gl.uniform1f(u.intensity, intensity);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Velocity decays on its own; scroll handlers keep re-arming it.
    velTarget *= 0.92;
  }

  function onPointer(e) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ptr.tx = (e.clientX - r.left) / r.width;
    // Flip Y: CSS grows downward, GL clip space grows upward.
    ptr.ty = 1 - (e.clientY - r.top) / r.height;
  }

  /* Pause when scrolled out of view or the tab is hidden — a shader
     nobody can see is pure battery drain. */
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { rootMargin: '120px' }
  );
  io.observe(canvas);

  function onVisibility() {
    if (document.hidden) {
      visible = false;
    } else {
      visible = true;
      last = performance.now();
    }
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  function resume() {
    if (running || destroyed) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  resume();

  return {
    setVelocity(v) {
      velTarget = Math.max(-1.5, Math.min(1.5, v));
    },
    setIntensity(v) {
      intensityTarget = Math.max(0, Math.min(1, v));
    },
    pause,
    resume,
    destroy() {
      destroyed = true;
      pause();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      // Free the GPU-side context immediately rather than waiting on GC.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
