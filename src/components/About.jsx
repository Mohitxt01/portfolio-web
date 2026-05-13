import { useRef } from 'react';

export default function About() {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
  };
  const handleLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = '';
  };

  return (
    <section className="about" id="about">
      <div className="section-header">
        <span className="section-num">01</span>
        <span className="section-line"></span>
        <span className="section-tag">About</span>
      </div>

      <div className="about-grid">
        <div className="about-text">
          <h2 className="section-title reveal-up">
            I craft <em className="serif">scalable</em> systems
            <span className="br-md"> </span>
            and pixel-perfect <em className="serif">experiences</em>.
          </h2>

          <div className="about-body reveal-up">
            <p>
              I'm a Full-Stack Developer who has shipped <strong>100+ REST APIs</strong> across
              production systems — from <strong>Kafka-based import pipelines</strong> processing
              millions of rows to <strong>AI-powered Instagram automations</strong> that detect
              outfits and deliver products straight through DMs.
            </p>
            <p>
              I obsess over <strong>performance</strong> — profiling slow queries, adding the right
              indexes, layering <strong>Redis caching</strong>, and bringing <strong>P99 latencies down</strong> to
              where users actually feel the difference. I've cut critical-path response times by{' '}
              <strong>more than half</strong> on production endpoints.
            </p>
            <p>
              Day to day I work across <strong>microservices, authentication, observability,
              real-time pipelines, queues, retries, idempotency, and the boring infrastructure
              glue</strong> that makes products actually ship. I write <strong>tests</strong>,
              I review PRs, I babysit <strong>CI/CD</strong>, and I genuinely enjoy the unglamorous
              work that keeps a system healthy.
            </p>
            <p>
              On the frontend, I build <strong>responsive, accessible interfaces</strong> in
              Next.js & React — dashboards, internal tools, and customer-facing flows. I care
              about pixel-perfect detail and snappy interactions.
            </p>
            <p>
              Recently I've been deep in <strong>agentic AI</strong>, multi-agent systems, and
              workflow automation — pushing what one developer can ship end-to-end.
            </p>
          </div>

          <div className="about-meta reveal-up">
            <div>
              <span className="meta-label">Currently</span>
              <span className="meta-value">Associate Software Dev<br />@ Primathon Technology</span>
            </div>
            <div>
              <span className="meta-label">Based In</span>
              <span className="meta-value">India 🇮🇳<br />Working Globally</span>
            </div>
            <div>
              <span className="meta-label">Education</span>
              <span className="meta-value">B.Tech, SGSITS Indore<br />Electrical Engineering</span>
            </div>
          </div>
        </div>

        <div className="about-visual">
          <div className="card-3d" ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <div className="card-3d-inner" ref={innerRef}>
              <div className="card-header">
                <div className="card-dots"><span></span><span></span><span></span></div>
                <span className="card-title">~/about.ts</span>
              </div>
              <pre className="code">
{``}<span className="c-key">const</span> <span className="c-var">mohit</span> = {'{'}
{`  `}<span className="c-prop">name</span>: <span className="c-str">'Mohit Tantway'</span>,
{`  `}<span className="c-prop">role</span>: <span className="c-str">'Full-Stack Developer'</span>,
{`  `}<span className="c-prop">stack</span>: [
{`    `}<span className="c-str">'NestJS'</span>, <span className="c-str">'Next.js'</span>,
{`    `}<span className="c-str">'Kafka'</span>, <span className="c-str">'Redis'</span>,
{`    `}<span className="c-str">'TypeScript'</span>, <span className="c-str">'Docker'</span>
{`  `}],
{`  `}<span className="c-prop">focus</span>: <span className="c-str">'AI · Scale · DX'</span>,
{`  `}<span className="c-prop">shipping</span>: <span className="c-bool">true</span>,
{`  `}<span className="c-prop">available</span>: <span className="c-bool">true</span>,
{'}'};
              </pre>
            </div>
          </div>

          <div className="now-card">
            <div className="now-card-head">
              <span className="now-pulse"></span>
              <span className="now-label">Now Shipping</span>
              <span className="now-time">live</span>
            </div>
            <ul className="now-list">
              <li>
                <span className="now-icon">⚡</span>
                <div>
                  <div className="now-title">Scale-Ops v2 — Import Pipeline</div>
                  <div className="now-sub">Kafka · BullMQ · Trino streaming</div>
                </div>
                <span className="now-badge running">in progress</span>
              </li>
              <li>
                <span className="now-icon">🤖</span>
                <div>
                  <div className="now-title">Agentic AI Workflows</div>
                  <div className="now-sub">Claude Code · multi-agent orchestration</div>
                </div>
                <span className="now-badge exploring">exploring</span>
              </li>
              <li>
                <span className="now-icon">📈</span>
                <div>
                  <div className="now-title">P99 Latency Tuning</div>
                  <div className="now-sub">indexes · Redis · connection pools</div>
                </div>
                <span className="now-badge shipped">shipped</span>
              </li>
            </ul>
          </div>

          <div className="quote-card">
            <div className="quote-mark">“</div>
            <p>
              Great software isn't shipped by writing more code — it's shipped by
              <em> understanding the system end-to-end</em>, from the database query
              all the way to the pixel.
            </p>
            <div className="quote-sig">— My working philosophy</div>
          </div>

          <div className="signal-card">
            <div className="signal-head">
              <span className="signal-label">Recent Signal</span>
              <span className="signal-dot"></span>
            </div>
            <div className="signal-grid">
              <div className="signal-item">
                <div className="signal-val">2,847</div>
                <div className="signal-key">commits this year</div>
              </div>
              <div className="signal-item">
                <div className="signal-val">14</div>
                <div className="signal-key">repos shipped</div>
              </div>
              <div className="signal-item">
                <div className="signal-val">∞</div>
                <div className="signal-key">cups of chai</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
