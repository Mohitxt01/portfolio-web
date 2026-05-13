const STATS = [
  { num: 100, suffix: '+', label: 'REST APIs\nBuilt & Shipped' },
  { num: 2, suffix: 'L+', label: 'Lines of Code\nin last 3 months' },
  { num: 60, suffix: '%', label: 'P99 Latency\nReduction Achieved' },
  { num: 99.9, suffix: '%', label: 'Production\nUptime Maintained' },
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid"></div>

      <div className="hero-content">
        <div className="hero-meta reveal-up">
          <span className="status-dot"></span>
          <span>Available for new opportunities</span>
        </div>

        <h1 className="hero-title">
          <span className="line"><span className="word">Full-Stack</span></span>
          <span className="line">
            <span className="word italic">Developer</span>
            <span className="ampersand">&amp;</span>
          </span>
          <span className="line">
            <span className="word">System</span>
            <span className="word">Architect</span>
          </span>
        </h1>

        <p className="hero-sub reveal-up">
          I'm <strong>Mohit Tantway</strong> — I ship production systems end-to-end with{' '}
          <em>NestJS</em>, <em>Next.js</em>, <em>Kafka</em>, <em>Redis</em>, and AI-driven
          automation. 100+ APIs, real-time pipelines, P99-tuned endpoints — and the boring
          infra glue that holds it all together.
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
