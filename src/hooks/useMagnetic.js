import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function useMagnetic() {
  useEffect(() => {
    const elements = document.querySelectorAll('.magnetic');
    const handlers = [];

    elements.forEach((btn) => {
      // Create GSAP quickSetters for performance
      const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        // Apply magnetic pull (higher multiplier = stronger pull)
        xTo(distanceX * 0.4);
        yTo(distanceY * 0.4);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      handlers.push({ btn, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ btn, onMove, onLeave }) => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);
}
