import { useRef } from 'react';
import { 
  FiBarChart2, FiZap, FiRadio, FiCpu, 
  FiMessageSquare, FiShoppingBag, FiHeart, FiCalendar
} from 'react-icons/fi';

const s = (slug) => `https://cdn.simpleicons.org/${slug}`;

const ICON_URLS = {
  'NestJS': s('nestjs'),
  'Next.js': s('nextdotjs'),
  'Kafka': s('apachekafka'),
  'BullMQ': s('redis'),
  'Redis': s('redis'),
  'Trino': s('trino'),
  'AWS S3': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'MySQL': s('mysql'),
  'Docker': s('docker'),
  'Meta Graph API': s('meta'),
  'YOLOv8': s('python'),
  'Python': s('python'),
  'Flask': s('flask'),
  'Gemini': s('googlegemini'),
  'LangChain': s('langchain'),
  'OpenAI': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'TypeScript': s('typescript'),
  'Tailwind': s('tailwindcss')
};

const PROJECTS = [
  {
    index: '01',
    total: '03',
    title: 'Scale-Ops',
    tagline: 'High-throughput import/export platform',
    summary: 'A robust platform architected from scratch to handle bulk CSV/XLSX imports asynchronously, supporting millions of rows.',
    bullets: [
      'Multi-stage Kafka pipeline with parallel consumer groups.',
      'Achieved 60%+ reduction in P99 latency via Redis caching.',
      'Shipped 100+ REST APIs with secure dual-header auth.'
    ],
    highlights: [
      { icon: <FiBarChart2 />, value: 'Millions', label: 'rows processed' },
      { icon: <FiZap />, value: '60%', label: 'latency cut' },
      { icon: <FiRadio />, value: '100+', label: 'APIs shipped' },
    ],
    stack: ['NestJS', 'Kafka', 'BullMQ', 'Redis', 'Trino', 'AWS S3', 'MySQL', 'Docker'],
    mockType: 'terminal',
  },
  {
    index: '02',
    total: '03',
    title: 'ReelStyleFinder',
    tagline: 'AI Instagram automation → DM product recs',
    summary: 'An AI-powered bot that turns Instagram media into product recommendations, delivered straight to users via DMs.',
    bullets: [
      'Integrated Meta Graph APIs and webhooks for seamless automation.',
      'Utilized YOLOv8 for outfit detection from incoming media.',
      'Employed Gemini to surface relevant e-commerce product links.'
    ],
    highlights: [
      { icon: <FiCpu />, value: 'YOLOv8', label: 'outfit detection' },
      { icon: <FiMessageSquare />, value: 'DM Bot', label: 'auto-response' },
      { icon: <FiShoppingBag />, value: 'Gemini', label: 'product search' },
    ],
    stack: ['NestJS', 'Next.js', 'Meta Graph API', 'YOLOv8', 'Python', 'Flask', 'Gemini'],
    mockType: 'phone',
    reverse: true,
  },
  {
    index: '03',
    total: '03',
    title: 'Med-Connect',
    tagline: 'AI chatbot for patient appointment booking',
    summary: 'A full-stack medical platform featuring an intelligent assistant that handles patient interactions and schedules appointments.',
    bullets: [
      'Built an AI Chatbot using LangChain and LLMs for natural language booking.',
      'Implemented real-time slot locking to prevent double-booking issues.',
      'Designed a three-tier role system for Patients, Doctors, and Admins.'
    ],
    highlights: [
      { icon: <FiCpu />, value: 'LangChain', label: 'AI chatbot' },
      { icon: <FiHeart />, value: '3 Roles', label: 'patient · doctor · admin' },
      { icon: <FiCalendar />, value: 'Real-time', label: 'slot locking' },
    ],
    stack: ['Next.js', 'NestJS', 'LangChain', 'OpenAI', 'TypeScript', 'MySQL', 'Redis', 'Tailwind'],
    mockType: 'app',
  },
];

function TerminalMock() {
  return (
    <div className="project-mock glass-card" data-cursor="view">
      <div className="mock-bar"><span></span><span></span><span></span></div>
      <div className="mock-body">
        <div className="mock-row"><span className="mock-label">imports.products</span><span className="mock-status success">▲ millions of rows</span></div>
        <div className="mock-row"><span className="mock-label">consumer.group_1</span><span className="mock-status running">processing</span></div>
        <div className="mock-row"><span className="mock-label">consumer.group_2</span><span className="mock-status running">processing</span></div>
        <div className="mock-row"><span className="mock-label">consumer.group_3</span><span className="mock-status">idle</span></div>
        <div className="mock-progress"><div className="mock-progress-bar"></div></div>
        <div className="mock-row small"><span>p99 latency</span><span>↓ 60%</span></div>
        <div className="mock-row small"><span>uptime</span><span>99.9%</span></div>
        <div className="mock-row small"><span>memory</span><span>stable under load</span></div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="project-mock phone glass-card" data-cursor="view">
      <div className="phone-screen">
        <div className="phone-header">
          <div className="phone-avatar"></div>
          <div>
            <div className="phone-name">@you</div>
            <div className="phone-sub">active now</div>
          </div>
        </div>
        <div className="phone-msg in">📹 sent a reel</div>
        <div className="phone-msg out">Detecting outfit…</div>
        <div className="phone-msg out">Found 3 looks — pick one ✨</div>
        <div className="phone-quick">
          <span>Look 1</span><span>Look 2</span><span>Look 3</span>
        </div>
        <div className="phone-msg out">Here are the products 🛍️</div>
      </div>
    </div>
  );
}

function AppMock() {
  return (
    <div className="project-mock appt glass-card" data-cursor="view">
      <div className="mock-bar"><span></span><span></span><span></span></div>
      <div className="appt-body">
        <div className="appt-doctor">
          <div className="appt-avatar">👨‍⚕️</div>
          <div className="appt-doctor-info">
            <div className="appt-doctor-name">Dr. Aarav Patel</div>
            <div className="appt-doctor-spec">Cardiologist · 12 yrs exp</div>
            <div className="appt-rating">★ 4.9 · 312 reviews</div>
          </div>
        </div>
        <div className="appt-section-label">Select date</div>
        <div className="appt-dates">
          <div className="appt-date"><span>MON</span><strong>12</strong></div>
          <div className="appt-date active"><span>TUE</span><strong>13</strong></div>
          <div className="appt-date"><span>WED</span><strong>14</strong></div>
          <div className="appt-date"><span>THU</span><strong>15</strong></div>
          <div className="appt-date"><span>FRI</span><strong>16</strong></div>
        </div>
        <div className="appt-section-label">Available slots</div>
        <div className="appt-slots">
          <span>09:00</span>
          <span className="active">10:30</span>
          <span>11:15</span>
          <span className="booked">02:00</span>
          <span>03:30</span>
          <span>04:45</span>
        </div>
        <button className="appt-cta">
          <span>Confirm Appointment</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

function ProjectHighlight({ highlight }) {
  return (
    <div className="proj-highlight" data-cursor="hover">
      <span className="proj-hl-icon">{highlight.icon}</span>
      <span className="proj-hl-value">{highlight.value}</span>
      <span className="proj-hl-label">{highlight.label}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  const mockComponents = {
    terminal: <TerminalMock />,
    phone: <PhoneMock />,
    app: <AppMock />,
  };

  return (
    <article className="project reveal-up">
      <div className="project-index">{project.index} / {project.total}</div>
      <div className={`project-main ${project.reverse ? 'reverse' : ''}`}>
        <div className="project-info">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-tagline">{project.tagline}</p>
          
          {/* Visual highlights instead of bullets */}
          <div className="proj-highlights-row">
            {project.highlights.map((h, i) => (
              <ProjectHighlight key={i} highlight={h} />
            ))}
          </div>

          <p className="project-desc">{project.summary}</p>
          <ul className="project-bullets">
            {project.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>

          <div className="project-stack">
            {project.stack.map((s) => (
              <span key={s}>
                {ICON_URLS[s] && (
                  <span className="chip-icon">
                    <img src={ICON_URLS[s]} alt={s} className="tech-icon-img" loading="lazy" />
                  </span>
                )}
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="project-visual">
          {mockComponents[project.mockType]}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-header">
        <span className="section-num">03</span>
        <span className="section-line"></span>
        <span className="section-tag">Selected Work</span>
      </div>

      <h2 className="section-title reveal-up">
        Things I've <em className="serif gradient-text">built</em> & <em className="serif gradient-text">shipped</em>.
      </h2>

      <div className="project-list">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.index} project={p} />
        ))}
      </div>
    </section>
  );
}
