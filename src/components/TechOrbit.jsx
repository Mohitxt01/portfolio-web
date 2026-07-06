import { useEffect, useRef, useState } from 'react';

const s = (slug) => `https://cdn.simpleicons.org/${slug}`;

const ORBIT_ITEMS = [
  { label: 'NestJS', iconUrl: s('nestjs') },
  { label: 'React', iconUrl: s('react') },
  { label: 'Kafka', iconUrl: s('apachekafka') },
  { label: 'Redis', iconUrl: s('redis') },
  { label: 'AI', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { label: 'Docker', iconUrl: s('docker') },
  { label: 'AWS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { label: 'Python', iconUrl: s('python') },
];

export default function TechOrbit() {
  const orbitRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (orbitRef.current) observer.observe(orbitRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`tech-orbit ${isVisible ? 'orbit-visible' : ''}`} ref={orbitRef}>
      <div className="orbit-center">
        <span className="orbit-core-text">MT</span>
        <div className="orbit-core-ring" />
        <div className="orbit-core-ring ring-2" />
      </div>
      <div className="orbit-track track-1">
        {ORBIT_ITEMS.slice(0, 4).map((item, i) => (
          <div
            key={item.label}
            className="orbit-node"
            style={{ '--orbit-delay': `${i * -5}s`, '--orbit-index': i }}
            data-cursor="hover"
          >
            <span className="orbit-emoji">
              <img src={item.iconUrl} alt={item.label} className="tech-icon-img" style={{ width: '20px', height: '20px' }} />
            </span>
            <span className="orbit-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="orbit-track track-2">
        {ORBIT_ITEMS.slice(4).map((item, i) => (
          <div
            key={item.label}
            className="orbit-node node-outer"
            style={{ '--orbit-delay': `${i * -7.5}s`, '--orbit-index': i }}
            data-cursor="hover"
          >
            <span className="orbit-emoji">
              <img src={item.iconUrl} alt={item.label} className="tech-icon-img" style={{ width: '20px', height: '20px' }} />
            </span>
            <span className="orbit-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
