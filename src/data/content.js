/* =========================================================
   CONTENT — single source of truth
   Every string the site renders lives here.
   ========================================================= */

export const PERSON = {
  name: 'Mohit Tantway',
  initials: 'MT',
  roles: ['Backend Architect', 'AI Engineer', 'Systems Designer', 'Full-Stack Developer'],
  title: 'Full-Stack Developer & Systems Architect',
  email: 'mohittantway1234@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mohit-tantway-61522a252/',
  linkedinHandle: '/in/mohit-tantway',
  location: 'India · working globally',
  timezone: 'Asia/Kolkata',
  available: true,
  /* Hero copy: deliberately two lines so the headline metrics stay
     above the fold. The long-form version lives in `bio`. */
  tagline:
    'I build high-throughput backends, event-driven Kafka pipelines, and agentic AI systems that hold up in production.',
  bio:
    'A software engineer specialising in high-throughput backends, AI-driven automation, and scalable cloud infrastructure. ' +
    'From architecting event-driven Kafka pipelines and agentic LLM workflows to collapsing P99 latencies with Redis and Trino — ' +
    'I build resilient, end-to-end systems that hold up at scale.',
};

export const STATS = [
  { value: 100, suffix: '+', label: 'REST APIs', sub: 'built & shipped' },
  { value: 60, suffix: '%', label: 'P99 latency', sub: 'reduction achieved' },
  { value: 99.9, suffix: '%', label: 'Uptime', sub: 'production SLA' },
  { value: 500, suffix: '+', label: 'DSA problems', sub: 'solved' },
];

export const SECTIONS = [
  { id: 'home', num: '00', label: 'Home' },
  { id: 'about', num: '01', label: 'About' },
  { id: 'experience', num: '02', label: 'Experience' },
  { id: 'architecture', num: '03', label: 'Architecture' },
  { id: 'projects', num: '04', label: 'Projects' },
  { id: 'skills', num: '05', label: 'Skills' },
  { id: 'terminal', num: '06', label: 'Terminal' },
  { id: 'contact', num: '07', label: 'Contact' },
];

/* ---------------------------------------------------------
   ABOUT
   --------------------------------------------------------- */

export const PILLARS = [
  {
    key: 'scale',
    kicker: 'Performance & Scale',
    body:
      'Shipped 100+ REST APIs and multi-stage Kafka pipelines. Collapsed P99 latencies by 60% with Redis caching, ' +
      'EXPLAIN-driven index work, and tuned connection pools.',
    metric: '60%',
    metricLabel: 'p99 cut',
  },
  {
    key: 'ai',
    kicker: 'AI-Powered Pipelines',
    body:
      'Agentic workflows on LangChain and multi-provider LLM APIs — context chains, token budgeting, ' +
      'and tool-calling graphs that degrade gracefully when a model does.',
    metric: 'LLM',
    metricLabel: 'orchestration',
  },
  {
    key: 'ownership',
    kicker: 'End-to-End Ownership',
    body:
      'NestJS and FastAPI services, microservice boundaries, observability with SigNoz, CI/CD through Jenkins and ArgoCD — ' +
      'then the pixel-perfect Next.js frontend on top of it.',
    metric: '∞',
    metricLabel: 'stack depth',
  },
  {
    key: 'foundation',
    kicker: 'Algorithmic Foundation',
    body:
      '500+ problems across LeetCode and CodeChef. Not for the badge — it keeps the ' +
      'complexity trade-offs instinctive when a design decision actually costs something.',
    metric: '500+',
    metricLabel: 'problems',
  },
];

export const FACTS = [
  { label: 'Recent role', value: 'Associate Software Developer', sub: 'Primathon Technology' },
  { label: 'Based in', value: 'India', sub: 'working globally' },
  { label: 'Education', value: 'B.Tech · SGSITS Indore', sub: 'Electrical Engineering' },
];

export const NOW = [
  {
    title: 'Scale-Ops v2 — import pipeline',
    sub: 'Kafka · BullMQ · Trino streaming',
    state: 'building',
  },
  {
    title: 'Agentic LLM workflows',
    sub: 'LangChain · context chains · token budgeting',
    state: 'shipping',
  },
  {
    title: 'P99 latency tuning',
    sub: 'indexes · Redis · connection pools',
    state: 'shipped',
  },
];

export const PHILOSOPHY = {
  quote:
    'Great software is not shipped by writing more code. It is shipped by understanding the system end to end — from the database query all the way to the pixel.',
  attribution: 'working philosophy',
};

/* ---------------------------------------------------------
   EXPERIENCE
   --------------------------------------------------------- */

export const ROLES = [
  {
    id: 'primathon-asd',
    from: 'May 2025',
    to: 'Jun 2026',
    role: 'Associate Software Developer',
    org: 'Primathon Technology',
    summary:
      'Owned end-to-end development of critical backend services and infrastructure, driving the performance and architecture upgrades the platform ran on.',
    metrics: [
      { value: '100+', label: 'REST APIs', sub: 'built & shipped' },
      { value: '60%', label: 'P99 latency', sub: 'reduction' },
      { value: '2L+', label: 'Lines of code', sub: 'in 3 months' },
      { value: '99.9%', label: 'Uptime', sub: 'production SLA' },
    ],
    bullets: [
      'Architected Scale-Ops from scratch — a Kafka-backed import pipeline handling millions of rows asynchronously.',
      'Cut P99 latency on critical endpoints by 60%+ through query optimisation, indexing, and Redis caching.',
      'Shipped an AI-powered Instagram automation service across microservice boundaries.',
      'Mentored junior developers and interns; daily PR reviews and design feedback.',
    ],
    stack: ['NestJS', 'Kafka', 'BullMQ', 'Next.js', 'Redis', 'EC2', 'ArgoCD', 'Jenkins'],
  },
  {
    id: 'primathon-intern',
    from: 'Jan 2025',
    to: 'Apr 2025',
    role: 'Software Developer Intern',
    org: 'Primathon Technology',
    summary:
      'Built and optimised core features of the Docxel-ERP system, focused on multi-channel notification delivery and query performance.',
    metrics: [
      { value: '3', label: 'Channels', sub: 'WhatsApp · SMS · Email' },
      { value: '4–5×', label: 'Faster APIs', sub: 'via query tuning' },
      { value: 'OCR', label: 'AI feature', sub: 'bills → structured JSON' },
      { value: '100%', label: 'Coverage', sub: 'unit + integration' },
    ],
    bullets: [
      'Implemented multi-channel notifications across WhatsApp, SMS, and email with retry and backoff handling.',
      'Built a scalable NestJS service with JWT auth, refresh-token rotation, and Redis Cluster caching.',
      'Shipped an AI-driven OCR feature extracting structured JSON from medicine bills.',
      'EXPLAIN-driven query optimisation across tables holding millions of records.',
    ],
    stack: ['NestJS', 'JWT', 'Redis Cluster', 'TypeORM', 'MySQL', 'OCR'],
  },
];

/* ---------------------------------------------------------
   ARCHITECTURE — the Scale-Ops system diagram
   --------------------------------------------------------- */

export const ARCHITECTURE = {
  title: 'Scale-Ops',
  subtitle: 'The import pipeline, as it actually runs',
  blurb:
    'A multi-stage, event-driven pipeline built from scratch to ingest millions of spreadsheet rows without ever blocking a request. ' +
    'Hover any node to see what it does and why it is there.',
  nodes: [
    {
      id: 'client',
      label: 'Client',
      kind: 'edge',
      col: 0,
      row: 1,
      detail: 'Next.js uploader. Streams the file straight to object storage and gets a job id back in milliseconds — never waits on the parse.',
      stat: '< 50ms',
      statLabel: 'ack time',
    },
    {
      id: 'gateway',
      label: 'API Gateway',
      kind: 'service',
      col: 1,
      row: 1,
      detail: 'NestJS edge service. Dual-header auth, request validation, rate limiting, and idempotency keys so a retried upload never double-imports.',
      stat: '100+',
      statLabel: 'endpoints',
    },
    {
      id: 's3',
      label: 'S3',
      kind: 'store',
      col: 1,
      row: 0,
      detail: 'Raw CSV/XLSX lands here first. The pipeline reads from storage, not from memory — so a 2GB file costs the same RAM as a 2KB one.',
      stat: 'streamed',
      statLabel: 'never buffered',
    },
    {
      id: 'kafka',
      label: 'Kafka',
      kind: 'broker',
      col: 2,
      row: 1,
      detail: 'Partitioned topic, keyed by tenant so one noisy customer cannot starve the rest. Offsets committed only after a batch durably lands.',
      stat: 'millions',
      statLabel: 'rows / import',
    },
    {
      id: 'c1',
      label: 'Consumer 1',
      kind: 'worker',
      col: 3,
      row: 0,
      detail: 'Parallel consumer group member. Validates, normalises, and upserts in batches — horizontally scalable by just adding a pod.',
      stat: 'batch',
      statLabel: 'upserts',
    },
    {
      id: 'c2',
      label: 'Consumer 2',
      kind: 'worker',
      col: 3,
      row: 1,
      detail: 'Parallel consumer group member. Validates, normalises, and upserts in batches — horizontally scalable by just adding a pod.',
      stat: 'batch',
      statLabel: 'upserts',
    },
    {
      id: 'c3',
      label: 'Consumer 3',
      kind: 'worker',
      col: 3,
      row: 2,
      detail: 'Parallel consumer group member. Poison rows get routed to a dead-letter topic instead of killing the whole import.',
      stat: 'DLQ',
      statLabel: 'on bad rows',
    },
    {
      id: 'redis',
      label: 'Redis',
      kind: 'cache',
      col: 4,
      row: 0,
      detail: 'Hot lookup cache plus BullMQ job state and progress counters. The single biggest contributor to the 60% P99 drop.',
      stat: '−60%',
      statLabel: 'p99 latency',
    },
    {
      id: 'mysql',
      label: 'MySQL',
      kind: 'store',
      col: 4,
      row: 1,
      detail: 'System of record. Composite indexes derived from EXPLAIN plans rather than guesses, with pooled connections sized to the consumer count.',
      stat: 'indexed',
      statLabel: 'EXPLAIN-driven',
    },
    {
      id: 'trino',
      label: 'Trino',
      kind: 'query',
      col: 4,
      row: 2,
      detail: 'Federated analytics layer. Lets reporting queries hit cold data without ever touching the transactional path.',
      stat: 'federated',
      statLabel: 'analytics',
    },
  ],
  edges: [
    ['client', 's3'],
    ['client', 'gateway'],
    ['s3', 'kafka'],
    ['gateway', 'kafka'],
    ['kafka', 'c1'],
    ['kafka', 'c2'],
    ['kafka', 'c3'],
    ['c1', 'redis'],
    ['c1', 'mysql'],
    ['c2', 'mysql'],
    ['c3', 'mysql'],
    ['c3', 'trino'],
    ['c2', 'redis'],
  ],
};

/* ---------------------------------------------------------
   PROJECTS
   --------------------------------------------------------- */

export const PROJECTS = [
  {
    id: 'scale-ops',
    index: '01',
    title: 'Scale-Ops',
    tagline: 'High-throughput import / export platform',
    year: '2025',
    role: 'Architect & lead developer',
    summary:
      'Architected from scratch to handle bulk CSV/XLSX imports asynchronously at a scale of millions of rows, without a single blocking request.',
    bullets: [
      'Multi-stage Kafka pipeline with parallel consumer groups and a dead-letter path.',
      '60%+ reduction in P99 latency via Redis caching and EXPLAIN-driven indexing.',
      '100+ REST APIs behind secure dual-header auth and idempotency keys.',
    ],
    metrics: [
      { value: 'Millions', label: 'rows / import' },
      { value: '60%', label: 'p99 reduction' },
      { value: '100+', label: 'APIs shipped' },
    ],
    stack: ['NestJS', 'Kafka', 'BullMQ', 'Redis', 'Trino', 'AWS S3', 'MySQL', 'Docker'],
    mock: 'pipeline',
  },
  {
    id: 'reelstylefinder',
    index: '02',
    title: 'ReelStyleFinder',
    tagline: 'AI Instagram automation → DM product recommendations',
    year: '2025',
    role: 'Full-stack & AI integration',
    summary:
      'An AI bot that watches an Instagram reel, detects the outfit in it, finds the closest shoppable products, and replies in the DM thread.',
    bullets: [
      'Meta Graph API + webhook pipeline for fully hands-off automation.',
      'YOLOv8 outfit detection on incoming media frames.',
      'Gemini-backed retrieval surfacing relevant e-commerce product links.',
    ],
    metrics: [
      { value: 'YOLOv8', label: 'outfit detection' },
      { value: 'Gemini', label: 'product search' },
      { value: 'Zero-touch', label: 'DM automation' },
    ],
    stack: ['NestJS', 'Next.js', 'Meta Graph API', 'YOLOv8', 'Python', 'Flask', 'Gemini'],
    mock: 'phone',
  },
  {
    id: 'med-connect',
    index: '03',
    title: 'Med-Connect',
    tagline: 'AI chatbot for patient appointment booking',
    year: '2024',
    role: 'Full-stack developer',
    summary:
      'A medical platform whose assistant books real appointments from plain language — and refuses to double-book, because the slot lock is real.',
    bullets: [
      'LangChain + LLM chatbot handling natural-language booking end to end.',
      'Real-time slot locking that makes double-booking structurally impossible.',
      'Three-tier role system across patients, doctors, and administrators.',
    ],
    metrics: [
      { value: 'LangChain', label: 'AI chatbot' },
      { value: 'Real-time', label: 'slot locking' },
      { value: '3 roles', label: 'patient · doctor · admin' },
    ],
    stack: ['Next.js', 'NestJS', 'LangChain', 'OpenAI', 'TypeScript', 'MySQL', 'Redis', 'Tailwind'],
    mock: 'booking',
  },
];

/* ---------------------------------------------------------
   SKILLS
   --------------------------------------------------------- */

export const SKILL_DOMAINS = [
  {
    id: 'ai',
    label: 'AI & Automation',
    accent: 'violet',
    blurb: 'Agentic workflows that stay cheap and keep working when a model misbehaves.',
    skills: [
      'LangChain', 'LLMs', 'Agentic AI', 'Multi-agent Systems', 'Context Chains',
      'Token Optimization', 'Multi-Provider AI APIs', 'Claude Code',
      'Prompt Engineering', 'Workflow Automation', 'AI Pipelines',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    accent: 'lime',
    blurb: 'Event-driven services with boundaries that survive contact with traffic.',
    skills: [
      'NestJS', 'FastAPI', 'Flask', 'Node.js', 'Express.js',
      'Kafka', 'BullMQ', 'Microservices', 'REST', 'WebSockets',
    ],
  },
  {
    id: 'languages',
    label: 'Languages & Frontend',
    accent: 'cyan',
    blurb: 'Typed everywhere it matters, with frontends that match the backend quality.',
    skills: [
      'TypeScript', 'JavaScript', 'Python', 'SQL', 'C++', 'C',
      'Next.js', 'React.js', 'Redux', 'HTML/CSS', 'Tailwind',
    ],
  },
  {
    id: 'data',
    label: 'Databases & Cloud',
    accent: 'amber',
    blurb: 'Query plans read, indexes earned, caches that actually invalidate.',
    skills: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'DynamoDB', 'Redis', 'AWS S3', 'Trino',
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Observability',
    accent: 'lime',
    blurb: 'If it is not measured in production, it is not shipped.',
    skills: [
      'Docker', 'PM2', 'EC2', 'ECS', 'Nginx', 'ArgoCD', 'Jenkins', 'SigNoz', 'Git', 'Jira',
    ],
  },
  {
    id: 'foundation',
    label: 'Problem Solving',
    accent: 'violet',
    blurb: 'The part that makes the trade-offs instinctive instead of theoretical.',
    skills: [
      '500+ DSA Problems', 'Data Structures', 'Algorithms',
      'System Design', 'LeetCode', 'CodeChef', 'GeeksForGeeks',
    ],
  },
];

/* Flat marquee list */
export const TICKER = [
  'NestJS', 'Kafka', 'TypeScript', 'Redis', 'Next.js', 'Docker', 'LangChain',
  'MySQL', 'AWS', 'Microservices', 'Python', 'FastAPI', 'React', 'DynamoDB',
  'BullMQ', 'Nginx', 'Trino', 'GSAP', 'WebGL', 'Observability',
];
