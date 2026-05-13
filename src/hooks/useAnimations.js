import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function useAnimations(loaded) {
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // Lenis smooth scroll
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      let raf;
      function tick(time) {
        lenis.raf(time);
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      lenis.on('scroll', ScrollTrigger.update);

      // Hero word reveal
      const words = document.querySelectorAll('.hero-title .word, .hero-title .ampersand');
      gsap.from(words, {
        y: '110%',
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.2,
      });
      gsap.from('.hero-meta', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out' });
      gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.6 });
      gsap.from('.hero-cta', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.75 });
      gsap.from('.hero-stats .stat', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, delay: 0.9 });

      // Counter animation (supports decimals)
      document.querySelectorAll('.stat-num').forEach((c) => {
        const end = +c.dataset.count;
        const suffix = c.dataset.suffix || '';
        const decimals = end % 1 !== 0 ? 1 : 0;
        ScrollTrigger.create({
          trigger: c,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: end,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                c.textContent = obj.v.toFixed(decimals) + suffix;
              },
            });
          },
        });
      });

      // Reveal up via GSAP
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
        el.classList.add('visible');
      });

      // Section titles
      gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: title, start: 'top 85%' },
          }
        );
      });

      // Project mock parallax
      gsap.utils.toArray('.project-mock').forEach((mock) => {
        gsap.to(mock, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: mock,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Timeline line draw
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      );

      // Hero parallax
      gsap.to('.hero-grid', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
      gsap.to('.orb-1', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.orb-2', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 1 },
      });

      // Cleanup
      return () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });

    return () => ctx.revert();
  }, [loaded]);
}
