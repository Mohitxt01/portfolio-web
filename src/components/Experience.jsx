import { 
  FiRadio, FiZap, FiFileText, FiRefreshCw, 
  FiLayers, FiCpu, FiTrendingUp, FiUsers,
  FiBell, FiArrowUpRight, FiCheckCircle, 
  FiBox, FiLock, FiSettings, FiActivity 
} from 'react-icons/fi';

const s = (slug) => `https://cdn.simpleicons.org/${slug}`;

const ICON_URLS = {
  'NestJS': s('nestjs'),
  'Kafka': s('apachekafka'),
  'BullMQ': s('redis'),
  'Next.js': s('nextdotjs'),
  'Redis': s('redis'),
  'Redis Cluster': s('redis'),
  'EC2': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Nginx': s('nginx'),
  'ArgoCD': 'https://argo-cd.readthedocs.io/en/stable/assets/logo.png',
  'Jenkins': s('jenkins'),
  'Signoz': 'https://signoz.io/img/logo.svg',
  'JWT': s('jsonwebtokens'),
  'TypeORM': s('typeorm'),
  'MySQL': s('mysql'),
  'AI/OCR': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg'
};

const ROLES = [
  {
    date: 'May 2025 — June 2026',
    role: 'Associate Software Developer',
    org: 'Primathon Technology',
    emoji: <FiArrowUpRight />,
    summary: 'Owned end-to-end development of critical backend services and infrastructure, driving major performance improvements and architectural upgrades.',
    bullets: [
      'Architected Scale-Ops from scratch using Kafka for high-throughput import pipelines.',
      'Cut P99 latency on critical endpoints by 60%+ via query optimization and Redis caching.',
      'Shipped 100+ REST APIs and an AI-powered Instagram bot using microservices.'
    ],
    highlights: [
      { icon: <FiRadio />, metric: '100+', label: 'REST APIs', sub: 'built & shipped' },
      { icon: <FiZap />, metric: '60%', label: 'P99 Latency', sub: 'reduction achieved' },
      { icon: <FiFileText />, metric: '2L+', label: 'Lines of Code', sub: 'in 3 months' },
      { icon: <FiRefreshCw />, metric: '99.9%', label: 'Uptime', sub: 'production SLA' },
    ],
    achievements: [
      { icon: <FiLayers />, text: 'Architected Scale-Ops from scratch — Kafka import pipeline' },
      { icon: <FiCpu />, text: 'Built Instagram automation with Meta Graph APIs' },
      { icon: <FiTrendingUp />, text: 'Performance tuning — indexes, Redis, connection pools' },
      { icon: <FiUsers />, text: 'Mentored junior devs & interns, daily PR reviews' },
    ],
    chips: ['NestJS', 'Kafka', 'BullMQ', 'Next.js', 'Redis', 'EC2', 'ArgoCD', 'Jenkins'],
  },
  {
    date: 'Jan 2025 — Apr 2025',
    role: 'Software Developer Intern',
    org: 'Primathon Technology',
    emoji: <FiZap />,
    summary: 'Developed and optimized key features for the Docxel-ERP system, focusing on multi-channel notifications and performance tuning.',
    bullets: [
      'Implemented multi-channel notifications (WhatsApp, SMS, Email) with retry handling.',
      'Built a scalable NestJS application with JWT auth and Redis Cluster caching.',
      'Shipped an AI-driven OCR feature to extract JSON from medicine bills.'
    ],
    highlights: [
      { icon: <FiBell />, metric: '3', label: 'Channels', sub: 'WhatsApp · SMS · Email' },
      { icon: <FiArrowUpRight />, metric: '4-5x', label: 'Faster APIs', sub: 'via query tuning' },
      { icon: <FiCpu />, metric: 'AI/OCR', label: 'Feature', sub: 'medicine bills → JSON' },
      { icon: <FiCheckCircle />, metric: '100%', label: 'Test Coverage', sub: 'unit + integration' },
    ],
    achievements: [
      { icon: <FiBox />, text: 'Contributed to Docxel-ERP — multi-channel notifications' },
      { icon: <FiLock />, text: 'JWT auth with refresh-token rotation & Redis Cluster' },
      { icon: <FiSettings />, text: 'EXPLAIN-driven query optimization on millions of records' },
      { icon: <FiActivity />, text: 'Wrote unit & integration tests, internal tooling' },
    ],
    chips: ['NestJS', 'JWT', 'Redis Cluster', 'TypeORM', 'MySQL', 'AI/OCR'],
  },
];

function MetricCard({ highlight }) {
  return (
    <div className="exp-metric glass-card" data-cursor="hover">
      <span className="exp-metric-icon">{highlight.icon}</span>
      <span className="exp-metric-num">{highlight.metric}</span>
      <span className="exp-metric-label">{highlight.label}</span>
      <span className="exp-metric-sub">{highlight.sub}</span>
    </div>
  );
}

function AchievementPill({ item }) {
  return (
    <div className="exp-achievement" data-cursor="hover">
      <span className="exp-ach-icon">{item.icon}</span>
      <span className="exp-ach-text">{item.text}</span>
    </div>
  );
}

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="section-header">
        <span className="section-num">02</span>
        <span className="section-line"></span>
        <span className="section-tag">Experience</span>
      </div>

      <h2 className="section-title reveal-up">
        A year of <em className="serif gradient-text">shipping</em> real things.
      </h2>

      <div className="exp-roles">
        {ROLES.map((role, i) => (
          <div className="exp-role reveal-up" key={i}>
            {/* Role header */}
            <div className="exp-role-header">
              <span className="exp-emoji">{role.emoji}</span>
              <div className="exp-role-info">
                <span className="exp-role-title">{role.role}</span>
                <span className="exp-role-org">{role.org}</span>
              </div>
              <span className="exp-role-date">{role.date}</span>
            </div>

            {/* Visual metrics grid */}
            <div className="exp-metrics-grid">
              {role.highlights.map((h, j) => (
                <MetricCard key={j} highlight={h} />
              ))}
            </div>

            <p className="exp-summary">{role.summary}</p>
            <ul className="exp-bullets">
              {role.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>

            {/* Achievement pills */}
            <div className="exp-achievements">
              {role.achievements.map((a, j) => (
                <AchievementPill key={j} item={a} />
              ))}
            </div>

            {/* Tech chips */}
            <div className="chips">
              {role.chips.map((c) => (
                <span key={c}>
                  {ICON_URLS[c] && (
                    <span className="chip-icon">
                      <img src={ICON_URLS[c]} alt={c} className="tech-icon-img" loading="lazy" />
                    </span>
                  )}
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
