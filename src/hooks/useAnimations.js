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
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      let raf;
      function tick(time) {
        lenis.raf(time);
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        // Set scroll velocity for chromatic aberration
        const velocity = Math.min(Math.max(e.velocity || 0, -20), 20);
        document.documentElement.style.setProperty('--scroll-vel', velocity);
      });

      // ========== HERO ANIMATIONS ==========
      const chars = '!<>-_\\\\/[]{}—=+*^?#_';
      const words = document.querySelectorAll('.hero-title .word');
      
      words.forEach((word, index) => {
        const originalText = word.textContent;
        const length = originalText.length;
        let iteration = 0;
        
        gsap.to(word, {
          opacity: 1,
          duration: 0.1,
          delay: 0.3 + index * 0.2,
          onStart: () => {
            word.style.opacity = 1;
            const interval = setInterval(() => {
              word.textContent = originalText
                .split('')
                .map((letter, i) => {
                  if (i < iteration) return originalText[i];
                  return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
              
              if (iteration >= length) {
                clearInterval(interval);
                word.textContent = originalText; // Ensure exact match at end
              }
              iteration += 1 / 3; // Controls speed of decoding
            }, 30);
          }
        });
      });

      gsap.from('.hero-title .ampersand', {
        y: '50%',
        opacity: 0,
        rotateX: -40,
        duration: 1.4,
        ease: 'expo.out',
        delay: 0.8,
      });

      gsap.from('.hero-meta', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: 0.1,
      });

      gsap.from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: 0.7,
      });

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: 0.85,
      });

      gsap.from('.hero-stats .stat', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 1,
      });

      // ========== COUNTER ANIMATION ==========
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
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                c.textContent = obj.v.toFixed(decimals) + suffix;
              },
            });
          },
        });
      });

      // ========== REVEAL ANIMATIONS ==========
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
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

      // ========== SECTION TITLES ==========
      gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: title, start: 'top 85%' },
          }
        );
      });

      // ========== SECTION HEADERS ==========
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: header, start: 'top 90%' },
        });

        // Animate the section line width
        const line = header.querySelector('.section-line');
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'expo.out',
              scrollTrigger: { trigger: header, start: 'top 90%' },
            }
          );
        }
      });

      // ========== PROJECT ANIMATIONS ==========
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

      // Animate project cards sliding in
      gsap.utils.toArray('.project').forEach((project, i) => {
        const info = project.querySelector('.project-info');
        const visual = project.querySelector('.project-visual');

        if (info) {
          gsap.from(info, {
            x: i % 2 === 0 ? -60 : 60,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: project, start: 'top 80%' },
          });
        }

        if (visual) {
          gsap.from(visual, {
            x: i % 2 === 0 ? 60 : -60,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            delay: 0.15,
            scrollTrigger: { trigger: project, start: 'top 80%' },
          });
        }
      });

      // ========== TIMELINE ANIMATIONS ==========
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

      // Timeline items stagger
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          x: -40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        });

        // Animate chips floating in
        const chips = item.querySelectorAll('.chips span');
        gsap.from(chips, {
          y: 15,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.04,
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
          },
        });
      });

      // ========== SKILLS ANIMATIONS ==========
      gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
          },
          delay: i * 0.08,
        });
      });

      // ========== CONTACT ANIMATIONS ==========
      const contactLines = document.querySelectorAll('.contact-headline .line');
      contactLines.forEach((line, i) => {
        gsap.from(line, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.contact-headline',
            start: 'top 80%',
          },
          delay: i * 0.1,
        });
      });

      // Contact links flip in
      gsap.utils.toArray('.contact-link').forEach((link, i) => {
        gsap.from(link, {
          y: 40,
          opacity: 0,
          rotateX: -10,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%',
          },
          delay: i * 0.1,
        });
      });

      // ========== PARALLAX LAYERS ==========
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

      gsap.to('.hero-morphing', {
        yPercent: 20,
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

      // About cards parallax
      gsap.utils.toArray('.about-visual .glass-card, .about-visual .card-3d').forEach((card, i) => {
        gsap.to(card, {
          yPercent: -(i + 1) * 3,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // ========== MARQUEE HOVER PAUSE ==========
      const marquees = document.querySelectorAll('.marquee-track');
      marquees.forEach((track) => {
        track.addEventListener('mouseenter', () => {
          track.style.animationPlayState = 'paused';
        });
        track.addEventListener('mouseleave', () => {
          track.style.animationPlayState = 'running';
        });
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
