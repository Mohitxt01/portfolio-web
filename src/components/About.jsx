import { useRef } from 'react';
import TechOrbit from './TechOrbit.jsx';
import { 
  FiZap, FiCpu, FiSettings, FiLayers, 
  FiBriefcase, FiMapPin, FiAward, FiTrendingUp 
} from 'react-icons/fi';

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
            I craft <em className="serif gradient-text">scalable</em> systems
            <span className="br-md"> </span>
            and pixel-perfect <em className="serif gradient-text">experiences</em>.
          </h2>

          <div className="about-bento reveal-up">
            <div className="bento-item glass-card" data-cursor="hover">
              <div className="bento-icon"><FiZap /></div>
              <div className="bento-text">
                <strong>Performance & Scale</strong>
                <span>Shipped 100+ REST APIs and Kafka pipelines. Cut P99 latencies by 50%+ via Redis, query indexing, and connection pools.</span>
              </div>
            </div>

            <div className="bento-item glass-card" data-cursor="hover">
              <div className="bento-icon"><FiCpu /></div>
              <div className="bento-text">
                <strong>AI-Powered Pipelines</strong>
                <span>Building agentic workflows with LangChain & LLMs, focusing on token optimization, context chains, and multi-provider APIs.</span>
              </div>
            </div>

            <div className="bento-item glass-card" data-cursor="hover">
              <div className="bento-icon"><FiSettings /></div>
              <div className="bento-text">
                <strong>End-to-End Ownership</strong>
                <span>Working across NestJS, FastAPI, microservices, observability, and building pixel-perfect Next.js frontends.</span>
              </div>
            </div>

            <div className="bento-item glass-card" data-cursor="hover">
              <div className="bento-icon"><FiLayers /></div>
              <div className="bento-text">
                <strong>Algorithmic Foundation</strong>
                <span>Solved 500+ DSA problems (LeetCode/CodeChef) keeping system-design and algorithmic trade-offs sharp.</span>
              </div>
            </div>
          </div>

          <div className="about-meta reveal-up">
            <div className="about-meta-card">
              <span className="meta-icon"><FiBriefcase /></span>
              <span className="meta-label">Recent Role</span>
              <span className="meta-value">Associate Software Dev<br />@ Primathon Technology<br /><em style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>till June 2026</em></span>
            </div>
            <div className="about-meta-card">
              <span className="meta-icon"><FiMapPin /></span>
              <span className="meta-label">Based In</span>
              <span className="meta-value">India<br />Working Globally</span>
            </div>
            <div className="about-meta-card">
              <span className="meta-icon"><FiAward /></span>
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
                <div className="card-actions">
                  <span className="card-action-dot"></span>
                </div>
              </div>
              <pre className="code">
                {``}<span className="c-key">const</span> <span className="c-var">mohit</span> = {'{'}
                {`  `}<span className="c-prop">name</span>: <span className="c-str">'Mohit Tantway'</span>,
                {`  `}<span className="c-prop">role</span>: <span className="c-str">'Full-Stack Developer'</span>,
                {`  `}<span className="c-prop">stack</span>: [
                {`    `}<span className="c-str">'NestJS'</span>, <span className="c-str">'FastAPI'</span>,
                {`    `}<span className="c-str">'Next.js'</span>, <span className="c-str">'Kafka'</span>,
                {`    `}<span className="c-str">'LangChain'</span>, <span className="c-str">'Redis'</span>,
                {`    `}<span className="c-str">'DynamoDB'</span>, <span className="c-str">'Docker'</span>
                {`  `}],
                {`  `}<span className="c-prop">focus</span>: <span className="c-str">'AI · Scale · DX'</span>,
                {`  `}<span className="c-prop">shipping</span>: <span className="c-bool">true</span>,
                {`  `}<span className="c-prop">available</span>: <span className="c-bool">true</span>,
                {'}'};
              </pre>
            </div>
          </div>

          <div className="now-card glass-card">
            <div className="now-card-head">
              <span className="now-pulse"></span>
              <span className="now-label">Now Shipping</span>
              <span className="now-time">live</span>
            </div>
            <ul className="now-list">
              <li>
                <span className="now-icon"><FiZap /></span>
                <div>
                  <div className="now-title">Scale-Ops v2 — Import Pipeline</div>
                  <div className="now-sub">Kafka · BullMQ · Trino streaming</div>
                </div>
                <span className="now-badge running">in progress</span>
              </li>
              <li>
                <span className="now-icon"><FiCpu /></span>
                <div>
                  <div className="now-title">LLM-Powered Pipelines</div>
                  <div className="now-sub">LangChain · context chains · token optimization</div>
                </div>
                <span className="now-badge exploring">shipping</span>
              </li>
              <li>
                <span className="now-icon"><FiTrendingUp /></span>
                <div>
                  <div className="now-title">P99 Latency Tuning</div>
                  <div className="now-sub">indexes · Redis · connection pools</div>
                </div>
                <span className="now-badge shipped">shipped</span>
              </li>
            </ul>
          </div>
          <TechOrbit />

          <div className="quote-card glass-card">
            <div className="quote-mark">"</div>
            <p>
              Great software isn't shipped by writing more code — it's shipped by
              <em> understanding the system end-to-end</em>, from the database query
              all the way to the pixel.
            </p>
            <div className="quote-sig">— My working philosophy</div>
          </div>

          <div className="signal-card glass-card">
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
                <div className="signal-val">500+</div>
                <div className="signal-key">DSA problems solved</div>
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
