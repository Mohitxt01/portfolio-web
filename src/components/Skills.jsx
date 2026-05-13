const GROUPS = [
  {
    icon: '⚡',
    title: 'AI & Automation',
    tags: ['Agentic AI', 'Multi-agent Systems', 'Claude Code', 'Prompt Engineering', 'Workflow Automation', 'AI Pipelines'],
  },
  {
    icon: '⌨',
    title: 'Languages',
    tags: ['TypeScript', 'JavaScript', 'Python', 'C++', 'C'],
  },
  {
    icon: '▲',
    title: 'Frontend',
    tags: ['Next.js', 'React.js', 'Redux', 'HTML/CSS', 'Responsive UI'],
  },
  {
    icon: '◆',
    title: 'Backend',
    tags: ['NestJS', 'Node.js', 'Express.js', 'Kafka', 'BullMQ', 'Microservices'],
  },
  {
    icon: '⬢',
    title: 'Databases & Cloud',
    tags: ['MySQL', 'MongoDB', 'Redis', 'AWS S3', 'Trino'],
  },
  {
    icon: '⚙',
    title: 'DevOps & Tools',
    tags: ['Docker', 'PM2', 'EC2', 'Nginx', 'Ngrok', 'Git', 'Jira', 'Signoz'],
  },
];

function SkillCard({ group }) {
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className="skill-card reveal-up" onMouseMove={handleMove}>
      <div className="skill-icon">{group.icon}</div>
      <h4>{group.title}</h4>
      <div className="skill-tags">
        {group.tags.map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-header">
        <span className="section-num">04</span>
        <span className="section-line"></span>
        <span className="section-tag">Toolkit</span>
      </div>

      <h2 className="section-title reveal-up">
        The <em className="serif">tools</em> I reach for.
      </h2>

      <div className="skills-grid">
        {GROUPS.map((g) => <SkillCard key={g.title} group={g} />)}
      </div>
    </section>
  );
}
