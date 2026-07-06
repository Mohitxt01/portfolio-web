import { useEffect, useRef, useCallback } from 'react';

const CONNECTION_DIST = 150;
const MOUSE_RADIUS = 200;
const MOUSE_FORCE = 0.08;

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.baseRadius = Math.random() * 1.5 + 0.5;
    this.radius = this.baseRadius;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(w, h, mx, my, time) {
    // Pulse radius
    this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.3;

    // Mouse repulsion
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Damping
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;
  }
}

export default function NeuralCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    // Optimize particle count for mobile screens to save CPU/Battery
    const PARTICLE_COUNT = w < 768 ? 50 : 100;

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle(w, h));
  }, []);

  useEffect(() => {
    init();

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: "0px" });
    observer.observe(canvas);

    const animate = () => {
      if (!isVisible) {
        // Pause animation when off-screen to save CPU/Battery
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      
      timeRef.current++;
      const w = canvas.width;
      const h = canvas.height;
      const { x: mx, y: my } = mouseRef.current;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      // Update particles
      particles.forEach(p => p.update(w, h, mx, my, time));

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;

            // Check proximity to mouse for glow effect
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
            const mouseGlow = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) * 0.4 : 0;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha + mouseGlow})`;
            ctx.lineWidth = 0.5 + mouseGlow * 2;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        const mouseDist = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2);
        const mouseGlow = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) : 0;

        // Glow ring near mouse
        if (mouseGlow > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4 + mouseGlow * 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${mouseGlow * 0.06})`;
          ctx.fill();
        }

        // Main dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + mouseGlow * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha + mouseGlow * 0.4})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="neural-canvas"
      aria-hidden="true"
    />
  );
}
