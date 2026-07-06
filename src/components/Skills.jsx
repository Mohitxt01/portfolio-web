import { useState } from 'react';
import { 
  FiCpu, FiCode, FiServer, 
  FiDatabase, FiCloud, FiAward 
} from 'react-icons/fi';

const s = (slug) => `https://cdn.simpleicons.org/${slug}`;

const ICON_URLS = {
  // AI
  'LangChain': s('langchain'),
  'LLMs': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'Agentic AI': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'Multi-agent Systems': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'Context Chains': s('langchain'),
  'Token Optimization': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'Multi-Provider AI APIs': s('meta'),
  'Claude Code': s('anthropic'),
  'Prompt Engineering': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'Workflow Automation': s('n8n'),
  'AI Pipelines': s('python'),

  // Languages & Frontend
  'TypeScript': s('typescript'),
  'JavaScript': s('javascript'),
  'Python': s('python'),
  'SQL': s('mysql'),
  'C++': s('cplusplus'),
  'C': s('c'),
  'Next.js': s('nextdotjs'),
  'React.js': s('react'),
  'Redux': s('redux'),
  'HTML/CSS': s('html5'),
  'Responsive UI': s('figma'),

  // Backend
  'NestJS': s('nestjs'),
  'FastAPI': s('fastapi'),
  'Flask': s('flask'),
  'Node.js': s('nodedotjs'),
  'Express.js': s('express'),
  'Kafka': s('apachekafka'),
  'BullMQ': s('redis'),
  'Microservices': s('docker'),

  // DB & Cloud
  'MySQL': s('mysql'),
  'PostgreSQL': s('postgresql'),
  'MongoDB': s('mongodb'),
  'DynamoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Redis': s('redis'),
  'AWS S3': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Trino': s('trino'),

  // DevOps
  'Docker': s('docker'),
  'PM2': s('pm2'),
  'EC2': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'ECS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Nginx': s('nginx'),
  'Ngrok': s('ngrok'),
  'Git': s('git'),
  'Jira': s('jira'),
  'Signoz': 'https://signoz.io/img/logo.svg',

  // Problem Solving
  'LeetCode': s('leetcode'),
  'CodeChef': s('codechef'),
  'GeeksForGeeks': s('geeksforgeeks'),
  '500+ DSA Problems': s('leetcode'),
  'Data Structures': s('cplusplus'),
  'Algorithms': s('cplusplus')
};

const GROUPS = [
  {
    icon: <FiCpu />,
    title: 'AI & Automation',
    color: '#ff5c8a',
    tags: ['LangChain', 'LLMs', 'Agentic AI', 'Multi-agent Systems', 'Context Chains', 'Token Optimization', 'Multi-Provider AI APIs', 'Claude Code', 'Prompt Engineering', 'Workflow Automation', 'AI Pipelines'],
  },
  {
    icon: <FiCode />,
    title: 'Languages & Frontend',
    color: '#7c5cff',
    tags: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C++', 'C', 'Next.js', 'React.js', 'Redux', 'HTML/CSS', 'Responsive UI'],
  },
  {
    icon: <FiServer />,
    title: 'Backend',
    color: '#c9ff3b',
    tags: ['NestJS', 'FastAPI', 'Flask', 'Node.js', 'Express.js', 'Kafka', 'BullMQ', 'Microservices'],
  },
  {
    icon: <FiDatabase />,
    title: 'Databases & Cloud',
    color: '#6dd3ff',
    tags: ['MySQL', 'PostgreSQL', 'MongoDB', 'DynamoDB', 'Redis', 'AWS S3', 'Trino'],
  },
  {
    icon: <FiCloud />,
    title: 'DevOps & Tools',
    color: '#ffb86c',
    tags: ['Docker', 'PM2', 'EC2', 'ECS', 'Nginx', 'Ngrok', 'Git', 'Jira', 'Signoz'],
  },
  {
    icon: <FiAward />,
    title: 'Problem Solving',
    color: '#ff79c6',
    tags: ['LeetCode', 'CodeChef', 'GeeksForGeeks', '500+ DSA Problems', 'Data Structures', 'Algorithms'],
  },
];

function SkillCard({ group, isExpanded, onToggle }) {
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      className={`skill-card glass-card ${isExpanded ? 'expanded' : ''}`}
      onMouseMove={handleMove}
      onClick={onToggle}
      data-cursor="hover"
      style={{ '--card-color': group.color }}
    >
      <div className="skill-card-glow"></div>
      <div className="skill-icon" style={{ color: group.color }}>{group.icon}</div>
      <h4>{group.title}</h4>
      <div className="skill-tags">
        {group.tags.map((t) => (
          <span key={t} style={{ '--tag-color': group.color }}>
            {ICON_URLS[t] && (
              <span className="chip-icon">
                <img src={ICON_URLS[t]} alt={t} className="tech-icon-img" loading="lazy" />
              </span>
            )}
            {t}
          </span>
        ))}
      </div>
      <div className="skill-count">{group.tags.length} skills</div>
    </div>
  );
}

export default function Skills() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="skills" id="skills">
      <div className="section-header">
        <span className="section-num">04</span>
        <span className="section-line"></span>
        <span className="section-tag">Toolkit</span>
      </div>

      <h2 className="section-title reveal-up">
        The <em className="serif gradient-text">tools</em> I reach for.
      </h2>

      <div className="skills-grid">
        {GROUPS.map((g, i) => (
          <SkillCard
            key={g.title}
            group={g}
            isExpanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
