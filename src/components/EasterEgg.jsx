import { useEffect, useRef } from 'react';

export default function EasterEgg() {
  const konamiRef = useRef([]);
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

  useEffect(() => {
    // Console message
    const styles = [
      'color: #c9ff3b',
      'background: #0a0a0b',
      'font-size: 14px',
      'padding: 8px 16px',
      'border-radius: 4px',
      'font-family: JetBrains Mono, monospace',
    ].join(';');

    console.log(
      '%c⚡ Hey there, curious dev! \n' +
      '   Built by Mohit Tantway\n' +
      '   React + GSAP + Vanilla CSS + ❤️\n' +
      '   Try the Konami code for a surprise 🎮',
      styles
    );

    // Konami code listener
    const onKeyDown = (e) => {
      konamiRef.current.push(e.keyCode);
      if (konamiRef.current.length > konamiCode.length) {
        konamiRef.current.shift();
      }
      if (konamiRef.current.length === konamiCode.length &&
          konamiRef.current.every((v, i) => v === konamiCode[i])) {
        triggerPartyMode();
        konamiRef.current = [];
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const triggerPartyMode = () => {
    const emojis = ['🚀', '⚡', '✨', '🎉', '💜', '🔥', '💫', '🌟'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: fixed;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 30 + 20}px;
        pointer-events: none;
        z-index: 99999;
        animation: emojiBlast 1.5s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  };

  // Time-aware greeting (rendered as hidden aria text)
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return 'Burning the midnight oil? 🌙';
    if (h < 12) return 'Good morning! ☀️';
    if (h < 17) return 'Good afternoon! 🌤️';
    if (h < 21) return 'Good evening! 🌅';
    return 'Night owl mode activated 🦉';
  };

  return <div className="easter-egg-greeting" aria-hidden="true">{getGreeting()}</div>;
}
