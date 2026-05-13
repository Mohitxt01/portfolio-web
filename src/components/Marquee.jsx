const ITEMS = [
  'NestJS', 'Next.js', 'TypeScript', 'Kafka', 'Redis',
  'Docker', 'AI Automation', 'MySQL', 'AWS', 'Microservices',
];

export default function Marquee() {
  const sequence = [...ITEMS, ...ITEMS]; // duplicated for seamless loop
  return (
    <section className="marquee">
      <div className="marquee-track">
        {sequence.map((item, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span>{item}</span>
            <span className="dot">●</span>
          </span>
        ))}
      </div>
    </section>
  );
}
