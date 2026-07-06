import { useRef, useEffect, useState } from 'react';

const STATS = [
  { num: 100, suffix: '+', label: 'REST APIs\nBuilt & Shipped' },
  { num: 2, suffix: 'L+', label: 'Lines of Code\nin last 3 months' },
  { num: 60, suffix: '%', label: 'P99 Latency\nReduction Achieved' },
  { num: 99.9, suffix: '%', label: 'Production\nUptime Maintained' },
];

function MorphingShape() {
  return (
    <div className="hero-morphing">
      <svg viewBox="0 0 200 200" className="morph-svg morph-1">
        <path fill="rgba(124,92,255,0.08)" d="M40,-62.6C52.2,-55.4,62.8,-44.9,71.1,-32C79.4,-19.1,85.3,-3.8,82.6,9.8C79.9,23.5,68.6,35.5,57.3,46.6C46.1,57.8,34.9,68,21.7,73C8.6,77.9,-6.4,77.6,-19.5,73C-32.6,68.3,-43.7,59.2,-54.1,48.5C-64.5,37.8,-74.1,25.4,-77.1,11.5C-80.1,-2.5,-76.4,-18,-68.4,-29.8C-60.5,-41.6,-48.3,-49.7,-35.8,-56.8C-23.4,-63.9,-11.7,-70,1.2,-71.8C14.1,-73.5,27.8,-69.8,40,-62.6Z" transform="translate(100 100)">
          <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M40,-62.6C52.2,-55.4,62.8,-44.9,71.1,-32C79.4,-19.1,85.3,-3.8,82.6,9.8C79.9,23.5,68.6,35.5,57.3,46.6C46.1,57.8,34.9,68,21.7,73C8.6,77.9,-6.4,77.6,-19.5,73C-32.6,68.3,-43.7,59.2,-54.1,48.5C-64.5,37.8,-74.1,25.4,-77.1,11.5C-80.1,-2.5,-76.4,-18,-68.4,-29.8C-60.5,-41.6,-48.3,-49.7,-35.8,-56.8C-23.4,-63.9,-11.7,-70,1.2,-71.8C14.1,-73.5,27.8,-69.8,40,-62.6Z;M44.8,-69.2C56.4,-63.3,63,-47.6,69.7,-32.3C76.3,-17,83,-2.2,80.5,11C78,24.2,66.4,35.9,55.4,47.1C44.3,58.4,33.8,69.3,20.8,74.2C7.7,79,-7.8,77.9,-22.5,73.2C-37.2,68.5,-51.1,60.2,-60.7,48.1C-70.3,35.9,-75.6,19.9,-76.9,3.5C-78.2,-12.9,-75.4,-29.8,-66.4,-41.9C-57.4,-54,-42.2,-61.4,-28,-66.4C-13.7,-71.5,1.7,-74.3,16.8,-73.5C31.9,-72.8,33.3,-75.2,44.8,-69.2Z;M40,-62.6C52.2,-55.4,62.8,-44.9,71.1,-32C79.4,-19.1,85.3,-3.8,82.6,9.8C79.9,23.5,68.6,35.5,57.3,46.6C46.1,57.8,34.9,68,21.7,73C8.6,77.9,-6.4,77.6,-19.5,73C-32.6,68.3,-43.7,59.2,-54.1,48.5C-64.5,37.8,-74.1,25.4,-77.1,11.5C-80.1,-2.5,-76.4,-18,-68.4,-29.8C-60.5,-41.6,-48.3,-49.7,-35.8,-56.8C-23.4,-63.9,-11.7,-70,1.2,-71.8C14.1,-73.5,27.8,-69.8,40,-62.6Z" />
        </path>
      </svg>
      <svg viewBox="0 0 200 200" className="morph-svg morph-2">
        <path fill="rgba(201,255,59,0.05)" d="M38.5,-58.8C52.2,-54.1,67.3,-47.5,73.8,-36.1C80.2,-24.7,78,-8.4,74.7,6.8C71.3,22,66.9,36.2,58,46.3C49.1,56.5,35.8,62.7,21.6,67.8C7.4,73,-7.6,77.2,-21.3,74.3C-35.1,71.3,-47.5,61.2,-57.8,49C-68.2,36.8,-76.3,22.5,-77.5,7.6C-78.7,-7.4,-72.8,-23,-63.7,-35.1C-54.6,-47.3,-42.2,-56.1,-29.4,-61.3C-16.6,-66.6,-3.3,-68.3,8.5,-66.3C20.3,-64.3,24.8,-63.5,38.5,-58.8Z" transform="translate(100 100)">
          <animate attributeName="d" dur="15s" repeatCount="indefinite" values="M38.5,-58.8C52.2,-54.1,67.3,-47.5,73.8,-36.1C80.2,-24.7,78,-8.4,74.7,6.8C71.3,22,66.9,36.2,58,46.3C49.1,56.5,35.8,62.7,21.6,67.8C7.4,73,-7.6,77.2,-21.3,74.3C-35.1,71.3,-47.5,61.2,-57.8,49C-68.2,36.8,-76.3,22.5,-77.5,7.6C-78.7,-7.4,-72.8,-23,-63.7,-35.1C-54.6,-47.3,-42.2,-56.1,-29.4,-61.3C-16.6,-66.6,-3.3,-68.3,8.5,-66.3C20.3,-64.3,24.8,-63.5,38.5,-58.8Z;M43.3,-67.4C55.1,-60.3,63.1,-46.6,70,-32.4C76.9,-18.2,82.6,-3.5,79.9,9.5C77.3,22.5,66.3,33.8,55.6,44.5C44.9,55.2,34.4,65.3,21.5,71C8.5,76.7,-7,78,-20.8,73.8C-34.6,69.7,-46.7,60.1,-56.5,48.5C-66.3,37,-73.9,23.5,-75.7,9.1C-77.6,-5.3,-73.8,-20.7,-65.5,-32.5C-57.2,-44.3,-44.4,-52.6,-31.7,-59C-19,-65.5,-6.5,-70.2,5.5,-70.8C17.5,-71.4,31.4,-74.6,43.3,-67.4Z;M38.5,-58.8C52.2,-54.1,67.3,-47.5,73.8,-36.1C80.2,-24.7,78,-8.4,74.7,6.8C71.3,22,66.9,36.2,58,46.3C49.1,56.5,35.8,62.7,21.6,67.8C7.4,73,-7.6,77.2,-21.3,74.3C-35.1,71.3,-47.5,61.2,-57.8,49C-68.2,36.8,-76.3,22.5,-77.5,7.6C-78.7,-7.4,-72.8,-23,-63.7,-35.1C-54.6,-47.3,-42.2,-56.1,-29.4,-61.3C-16.6,-66.6,-3.3,-68.3,8.5,-66.3C20.3,-64.3,24.8,-63.5,38.5,-58.8Z" />
        </path>
      </svg>
    </div>
  );
}

function SplitText({ text, className = '' }) {
  return (
    <span className={`split-word ${className}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="split-char" style={{ '--char-index': i }}>
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    let text = '';
    if (h < 12) text = 'Good morning';
    else if (h < 17) text = 'Good afternoon';
    else text = 'Good evening';
    
    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      setGreeting(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-chaos" aria-hidden="true">
        <div className="chaos-track chaos-1">SOFTWARE SOFTWARE SOFTWARE SOFTWARE</div>
        <div className="chaos-track chaos-2">SYSTEMS SYSTEMS SYSTEMS SYSTEMS</div>
      </div>
      
      <div className="hero-content">
        <div className="hero-meta reveal-up">
          <span className="status-dot"></span>
          <span>Available for new opportunities</span>
          <span className="hero-greeting">{greeting}</span>
        </div>

        <h1 className="hero-title">
          <span className="line">
            <span className="word" data-cursor="hover">Full-Stack</span>
          </span>
          <span className="line">
            <span className="word italic" data-cursor="hover">Developer</span>
            <span className="ampersand">&amp;</span>
          </span>
          <span className="line">
            <span className="word" data-cursor="hover">System</span>
            <span className="word" data-cursor="hover">Architect</span>
          </span>
        </h1>

        <p className="hero-sub reveal-up">
          I'm <strong>Mohit Tantway</strong> — a software engineer specializing in high-throughput backends, AI-driven automation, and scalable cloud infrastructure. From architecting event-driven <em>Kafka</em> pipelines and agentic <em>LLM</em> workflows to optimizing P99 latencies with <em>Redis</em> and <em>Trino</em>, I build resilient, end-to-end systems that perform at scale.
        </p>

        <div className="hero-cta reveal-up">
          <a href="#projects" className="btn btn-primary magnetic" data-cursor="hover">
            <span className="btn-bg"></span>
            <span className="btn-text">
              <span>View My Work</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </span>
          </a>
          <a href="#contact" className="btn btn-ghost magnetic" data-cursor="hover">
            <span className="btn-shimmer"></span>
            <span>Get In Touch</span>
          </a>
        </div>

        <div className="hero-stats">
          {STATS.map((s, i) => (
            <div className="stat reveal-up" key={i}>
              <div className="stat-num" data-count={s.num} data-suffix={s.suffix || ''}>0</div>
              <div className="stat-label">
                {s.label.split('\n').map((line, j) => (
                  <span key={j}>{line}{j === 0 ? <br /> : null}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>

      <div className="hero-side">
        <a href="https://linkedin.com/in/Mohit-Tantway" target="_blank" rel="noreferrer" data-cursor="hover">LinkedIn</a>
        <a href="https://github.com/" target="_blank" rel="noreferrer" data-cursor="hover">GitHub</a>
        <a href="mailto:mohittantway1234@gmail.com" data-cursor="hover">Email</a>
      </div>
    </section>
  );
}
