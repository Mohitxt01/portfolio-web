import React from 'react';

const s = (slug) => `https://cdn.simpleicons.org/${slug}`;

const ICON_URLS = {
  'NestJS': s('nestjs'),
  'Next.js': s('nextdotjs'),
  'TypeScript': s('typescript'),
  'Kafka': s('apachekafka'),
  'Redis': s('redis'),
  'Docker': s('docker'),
  'AI Automation': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
  'MySQL': s('mysql'),
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Microservices': s('docker'),
  'Python': s('python'),
  'FastAPI': s('fastapi'),
  'LangChain': s('langchain'),
  'React': s('react'),
  'DynamoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'BullMQ': s('redis'),
  'Nginx': s('nginx'),
  'CI/CD': s('githubactions'),
  'GraphQL': s('graphql'),
  'Kubernetes': s('kubernetes'),
};

const ITEMS_ROW1 = [
  'NestJS', 'Next.js', 'TypeScript', 'Kafka', 'Redis', 'Docker', 'AI Automation', 'MySQL', 'AWS', 'Microservices'
];

const ITEMS_ROW2 = [
  'Python', 'FastAPI', 'LangChain', 'React', 'DynamoDB', 'BullMQ', 'Nginx', 'CI/CD', 'GraphQL', 'Kubernetes'
];

function MarqueeRow({ items, reverse = false }) {
  const sequence = [...items, ...items, ...items]; // triple for smoother loop
  return (
    <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
      {sequence.map((text, i) => (
        <span key={i} className="marquee-item" data-cursor="hover">
          <span className="marquee-icon">
            {ICON_URLS[text] && <img src={ICON_URLS[text]} alt={text} className="tech-icon-img" style={{ width: '18px', height: '18px' }} />}
          </span>
          <span>{text}</span>
        </span>
      ))}
    </div>
  );
}

export default React.memo(function Marquee() {
  return (
    <section className="marquee">
      <MarqueeRow items={ITEMS_ROW1} />
      <MarqueeRow items={ITEMS_ROW2} reverse />
    </section>
  );
});
