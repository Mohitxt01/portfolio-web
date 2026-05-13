const ITEMS = [
  {
    date: 'May 2025 — May 2026',
    role: 'Associate Software Developer',
    org: 'Primathon Technology',
    bullets: [
      [['Independently owned and delivered '], ['multiple end-to-end projects', true], [' — from research and design through development, deployment, and on-call production support across backend, frontend, and infrastructure.']],
      [['Shipped '], ['100+ REST APIs', true], [' with file validation, AWS STS IAM, dual-header auth, soft-delete audit trails, and Swagger/Docusaurus documentation.']],
      [['Drove '], ['major performance wins', true], [' — cut P99 latency on critical endpoints by 60%+ via query optimization, smarter indexing, Redis caching layers, and connection-pool tuning.']],
      [['Built an '], ['Instagram bot on microservices', true], ['; integrated Meta Graph APIs and webhooks, owned EC2/Nginx deployment, business verification, app review, and zero-downtime releases.']],
      [['Architected '], ['Scale-Ops from scratch', true], [' — designed a Kafka-based import pipeline with scheduling, repeat jobs, mid-stream cancellation, and live progress tracking across millions of rows.']],
      [['Wrote '], ['2L+ lines of code', true], [' in the last 3 months across backend, frontend, and infra — while maintaining 99.9% production uptime.']],
      [['Worked in a mature DevOps stack: '], ['ArgoCD, Jenkins, Vault, Keycloak, Signoz', true], ['. Standardized workflows with Husky, PR templates, and Slack-integrated alerting for faster incident response.']],
      [['Mentored '], ['junior devs & interns', true], [', reviewed PRs daily, and wrote ecosystem documentation that reduced onboarding time significantly.']],
    ],
    chips: ['NestJS', 'Kafka', 'BullMQ', 'Next.js', 'Redis', 'EC2', 'Nginx', 'ArgoCD', 'Jenkins', 'Signoz'],
  },
  {
    date: 'Jan 2025 — Apr 2025',
    role: 'Software Developer Intern',
    org: 'Primathon Technology',
    bullets: [
      [['Contributed to '], ['Docxel-ERP', true], ['; implemented multi-channel notifications (WhatsApp, SMS, Email) with retry/dead-letter handling and built advanced filtering, sorting, and pagination flows.']],
      [['Built a scalable '], ['NestJS application', true], [' with JWT auth, refresh-token rotation, Redis Cluster caching, microservices architecture, and TypeORM/MySQL integration.']],
      [['Optimized '], ['heavy database queries', true], [' with proper indexing and EXPLAIN-driven tuning — dropping list-API response times by 4–5x on tables with millions of records.']],
      [['Shipped an '], ['AI-driven OCR feature', true], [' to extract structured JSON from medicine bill images and seamlessly integrate it into backend services.']],
      [['Wrote '], ['unit & integration tests', true], [', participated in code reviews, and contributed to internal tooling for faster local development.']],
    ],
    chips: ['NestJS', 'JWT', 'Redis Cluster', 'TypeORM', 'MySQL', 'AI/OCR', 'WhatsApp API'],
  },
];

function Bullet({ parts }) {
  return (
    <li>
      {parts.map(([text, bold], i) =>
        bold ? <strong key={i}>{text}</strong> : <span key={i}>{text}</span>
      )}
    </li>
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
        A year of <em className="serif">shipping</em> real things.
      </h2>

      <div className="timeline">
        <div className="timeline-line"></div>
        {ITEMS.map((item, i) => (
          <article className="timeline-item reveal-up" key={i}>
            <div className="timeline-dot"></div>
            <div className="timeline-meta">
              <span className="timeline-date">{item.date}</span>
              <span className="timeline-role">{item.role}</span>
              <span className="timeline-org">{item.org}</span>
            </div>
            <div className="timeline-body">
              <ul>
                {item.bullets.map((b, j) => (
                  <Bullet key={j} parts={b} />
                ))}
              </ul>
              <div className="chips">
                {item.chips.map((c) => <span key={c}>{c}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
