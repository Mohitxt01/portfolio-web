import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCornerDownLeft, FiExternalLink, FiTerminal } from 'react-icons/fi';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useInView } from '../hooks/useInteractions.js';
import { useLineReveal } from '../hooks/useReveal.js';
import { PERSON, SKILL_DOMAINS, PROJECTS, ROLES, STATS } from '../data/content.js';
import '../styles/terminal.css';

/* Scrollback cap — the log can run all session, so it must be bounded. */
const MAX_LINES = 200;
const PROMPT = 'mohit@portfolio:~$';

const COMMANDS = [
  { name: 'help', desc: 'list every command' },
  { name: 'whoami', desc: 'identity, role, availability' },
  { name: 'about', desc: 'the short version' },
  { name: 'skills', desc: 'stack grouped by domain' },
  { name: 'projects', desc: 'selected work' },
  { name: 'experience', desc: 'roles, dates, outcomes' },
  { name: 'stack', desc: 'everything shipped to production' },
  { name: 'latency', desc: 'the numbers that matter' },
  { name: 'neofetch', desc: 'system info, with a logo' },
  { name: 'contact', desc: 'email and linkedin' },
  { name: 'date', desc: 'current time in IST' },
  { name: 'echo', desc: 'echo <text>' },
  { name: 'clear', desc: 'wipe the scrollback' },
  { name: 'sudo hire-me', desc: 'go on, try it' },
];

/* Tab-completion vocabulary. 'sudo' and 'sudo hire-me' both sit in the
   list so one Tab offers the prefix and the next completes the phrase. */
const COMPLETIONS = [
  'about', 'clear', 'contact', 'date', 'echo', 'experience', 'help', 'latency',
  'neofetch', 'projects', 'skills', 'stack', 'sudo', 'sudo hire-me', 'whoami',
];

const LOGO = [
  '███╗   ███╗ ████████╗',
  '████╗ ████║ ╚══██╔══╝',
  '██╔████╔██║    ██║   ',
  '██║╚██╔╝██║    ██║   ',
  '██║ ╚═╝ ██║    ██║   ',
  '╚═╝     ╚═╝    ╚═╝   ',
];

/* ---------------------------------------------------------
   Line factories
   --------------------------------------------------------- */
let uid = 0;
const nextId = () => `l${++uid}`;

const L = (t = '', c = '') => ({ id: nextId(), kind: 'text', t, c });
const GAP = () => ({ id: nextId(), kind: 'gap' });
const GRID = (rows, c = '') => ({ id: nextId(), kind: 'grid', rows, c });
const TAGS = (tags) => ({ id: nextId(), kind: 'tags', tags });
const LINK = (label, href) => ({ id: nextId(), kind: 'link', t: label, href });
const NEO = (info) => ({ id: nextId(), kind: 'neofetch', info });

/* ---------------------------------------------------------
   Closest-match suggestion for an unknown command
   --------------------------------------------------------- */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}

function closest(input) {
  const names = COMMANDS.map((c) => c.name);
  const prefix = names.find((n) => n.startsWith(input));
  if (prefix) return prefix;
  let best = null;
  let score = Infinity;
  for (const n of names) {
    const d = levenshtein(input, n);
    if (d < score) {
      score = d;
      best = n;
    }
  }
  // Beyond roughly half the word length a "did you mean" is just noise.
  return score <= Math.max(2, Math.ceil(input.length / 2)) ? best : null;
}

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */
function istNow() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PERSON.timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function formatUptime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m) return `${m}m ${String(sec).padStart(2, '0')}s`;
  return `${sec}s`;
}

/* Union of every stack actually used across roles and projects. */
const PROD_STACK = (() => {
  const seen = new Set();
  [...ROLES.flatMap((r) => r.stack), ...PROJECTS.flatMap((p) => p.stack)].forEach((s) => {
    if (!seen.has(s)) seen.add(s);
  });
  return [...seen];
})();

const BANNER = () => [
  L(`${PERSON.initials}-shell · interactive portfolio console`, 'term__brand'),
  L('This is a real REPL, not a video. Every answer comes from the same', 'term__muted'),
  L('data this page is built from.', 'term__muted'),
  GAP(),
  L("Type 'help' for the command list. Tab completes, ↑/↓ walks history.", 'term__hint'),
  GAP(),
];

/* =========================================================
   Output line renderer
   ========================================================= */
function OutputLine({ line }) {
  const delay = { '--i': Math.min(line.s ?? 0, 14) };

  if (line.kind === 'gap') return <div className="term__row term__gap" style={delay} />;

  if (line.kind === 'grid') {
    return (
      <dl className={`term__row term__grid ${line.c}`} style={delay}>
        {line.rows.map(([k, v]) => (
          <div className="term__grid-row" key={k + v}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (line.kind === 'tags') {
    return (
      <ul className="term__row term__tags" style={delay}>
        {line.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    );
  }

  if (line.kind === 'link') {
    return (
      <p className="term__row term__linkrow" style={delay}>
        <a
          href={line.href}
          target={line.href.startsWith('http') ? '_blank' : undefined}
          rel={line.href.startsWith('http') ? 'noreferrer noopener' : undefined}
          data-cursor="hover"
        >
          {line.t}
          <FiExternalLink aria-hidden="true" />
        </a>
      </p>
    );
  }

  if (line.kind === 'neofetch') {
    return (
      <div className="term__row term__neo" style={delay}>
        <pre className="term__neo-logo" aria-hidden="true">
          {LOGO.join('\n')}
        </pre>
        <dl className="term__neo-info">
          {line.info.map(([k, v]) => (
            <div className="term__neo-item" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <p className={`term__row term__text ${line.c}`} style={delay}>
      {line.t || ' '}
    </p>
  );
}

/* =========================================================
   Terminal
   ========================================================= */
export default function Terminal() {
  const { reduced, play } = useApp();
  const titleRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const bootAt = useRef(Date.now());
  const history = useRef([]);
  const histPos = useRef(-1);
  const tab = useRef({ active: false, matches: [], i: 0, last: '' });

  const [lines, setLines] = useState(BANNER);
  const [value, setValue] = useState('');
  const [sectionRef, inView] = useInView({ once: false, threshold: 0.35 });

  useLineReveal(titleRef);

  const push = useCallback((batch) => {
    setLines((prev) => {
      const stamped = batch.map((l, i) => ({ ...l, s: i }));
      const next = [...prev, ...stamped];
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
    });
  }, []);

  /* Keep the newest output in view without hijacking the page scroll. */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  /* Focus only once the console is actually on screen, and never take
     focus away from something the visitor is already using. */
  useEffect(() => {
    if (!inView) return;
    const el = inputRef.current;
    if (!el) return;
    const active = document.activeElement;
    if (active && active !== document.body && active !== el) return;
    el.focus({ preventScroll: true });
  }, [inView]);

  /* ------------------------------------------------------- */
  /* Command implementations                                 */
  /* ------------------------------------------------------- */
  const resolve = useCallback((raw) => {
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();
    const head = lower.split(/\s+/)[0];
    const argIndex = trimmed.search(/\s/);
    const arg = argIndex === -1 ? '' : trimmed.slice(argIndex + 1).trim();

    switch (head) {
      case 'help':
        return {
          ok: true,
          out: [
            L('Available commands', 'term__brand'),
            GRID(COMMANDS.map((c) => [c.name, c.desc]), 'term__grid--help'),
            GAP(),
            L('Tab completes · ↑/↓ history · Ctrl+L clear · Ctrl+C cancel', 'term__hint'),
          ],
        };

      case 'whoami':
        return {
          ok: true,
          out: [
            GRID([
              ['name', PERSON.name],
              ['title', PERSON.title],
              ['current', `${ROLES[0].role} @ ${ROLES[0].org}`],
              ['tenure', `${ROLES[1].from} → ${ROLES[0].to}`],
              ['location', PERSON.location],
              ['status', PERSON.available ? 'open to opportunities' : 'heads down'],
            ]),
          ],
        };

      case 'about':
        return { ok: true, out: [L(PERSON.bio, 'term__para')] };

      case 'skills':
        return {
          ok: true,
          out: [
            L('Stack by domain', 'term__brand'),
            ...SKILL_DOMAINS.flatMap((d) => [
              L(`▸ ${d.label}`, `term__head term__head--${d.accent}`),
              TAGS(d.skills),
            ]),
          ],
        };

      case 'projects':
        return {
          ok: true,
          out: [
            L('Selected work', 'term__brand'),
            ...PROJECTS.flatMap((p) => [
              L(`${p.index}  ${p.title}  ·  ${p.year}`, 'term__head'),
              L(p.tagline, 'term__muted'),
              GRID(p.metrics.map((m) => [m.label, m.value])),
              TAGS(p.stack),
              GAP(),
            ]),
          ],
        };

      case 'experience':
        return {
          ok: true,
          out: [
            L('Experience', 'term__brand'),
            ...ROLES.flatMap((r) => [
              L(`${r.from} — ${r.to}`, 'term__hint'),
              L(`${r.role} @ ${r.org}`, 'term__head'),
              L(r.summary, 'term__para'),
              GRID(r.metrics.map((m) => [m.label, m.value])),
              TAGS(r.stack),
              GAP(),
            ]),
          ],
        };

      case 'stack':
        return {
          ok: true,
          out: [
            L(`${PROD_STACK.length} technologies shipped to production`, 'term__brand'),
            TAGS(PROD_STACK),
            GAP(),
            L('Full depth, including things not yet in production:', 'term__muted'),
            L("run 'skills'", 'term__hint'),
          ],
        };

      case 'latency': {
        const nav = typeof performance !== 'undefined'
          ? performance.getEntriesByType?.('navigation')?.[0]
          : null;
        const rows = STATS.map((s) => [s.label.toLowerCase(), `${s.value}${s.suffix} · ${s.sub}`]);
        if (nav) {
          rows.push(['this page ttfb', `${Math.round(nav.responseStart)}ms`]);
          rows.push(['this page dcl', `${Math.round(nav.domContentLoadedEventEnd)}ms`]);
        }
        return {
          ok: true,
          out: [L('Production numbers', 'term__brand'), GRID(rows)],
        };
      }

      case 'neofetch':
        return {
          ok: true,
          out: [
            NEO([
              ['name', PERSON.name],
              ['role', PERSON.title],
              ['company', ROLES[0].org],
              ['stack', 'NestJS · Kafka · Next.js · Redis'],
              ['ai', 'LangChain · multi-provider LLMs'],
              ['cloud', 'AWS · Docker · ArgoCD · Jenkins'],
              ['apis', `${STATS[0].value}${STATS[0].suffix} shipped`],
              ['p99', `−${STATS[1].value}${STATS[1].suffix}`],
              ['uptime', `${STATS[2].value}${STATS[2].suffix} SLA`],
              ['dsa', `${STATS[3].value}${STATS[3].suffix} solved`],
              ['shell', 'react 18 · vite · gsap'],
              ['session', formatUptime(Date.now() - bootAt.current)],
              ['location', PERSON.location],
            ]),
          ],
        };

      case 'contact':
        return {
          ok: true,
          out: [
            L('Reach out — both of these are real and monitored.', 'term__muted'),
            LINK(PERSON.email, `mailto:${PERSON.email}`),
            LINK(`linkedin ${PERSON.linkedinHandle}`, PERSON.linkedin),
          ],
        };

      case 'date':
        return { ok: true, out: [L(`${istNow()} IST`)] };

      case 'echo':
        return { ok: true, out: [L(arg || ' ')] };

      case 'clear':
        return { ok: true, clear: true, out: [] };

      case 'sudo': {
        if (arg.toLowerCase() !== 'hire-me') {
          return {
            ok: false,
            out: [
              L(`sudo: ${arg || '<nothing>'}: command not found`, 'term__err'),
              L("the only privileged operation here is 'sudo hire-me'", 'term__hint'),
            ],
          };
        }
        return {
          ok: true,
          out: [
            L('[sudo] password for guest: ••••••••', 'term__muted'),
            L('Verifying candidate ............ ok', 'term__ok'),
            L('Checking references ........... ok', 'term__ok'),
            L('Resolving availability ........ ok', 'term__ok'),
            GAP(),
            L('Running hire-me.sh', 'term__brand'),
            L('  ✓ ships backend, infra and frontend end to end', 'term__ok'),
            L(`  ✓ ${STATS[0].value}${STATS[0].suffix} REST APIs, ${STATS[1].value}${STATS[1].suffix} p99 reduction`, 'term__ok'),
            L('  ✓ event-driven pipelines that hold at millions of rows', 'term__ok'),
            L('  ✓ agentic LLM workflows that degrade gracefully', 'term__ok'),
            GAP(),
            L('1 package queued for onboarding. Next step is yours:', 'term__brand'),
            LINK(PERSON.email, `mailto:${PERSON.email}`),
            LINK(`linkedin ${PERSON.linkedinHandle}`, PERSON.linkedin),
          ],
        };
      }

      default: {
        const guess = closest(head);
        return {
          ok: false,
          out: [
            L(`${head}: command not found`, 'term__err'),
            ...(guess ? [L(`did you mean '${guess}'?`, 'term__hint')] : []),
            L("type 'help' for the full list", 'term__hint'),
          ],
        };
      }
    }
  }, []);

  const submit = useCallback(
    (raw) => {
      const trimmed = raw.trim();
      push([L(`${PROMPT} ${raw}`, 'term__echo')]);
      setValue('');
      tab.current.active = false;

      if (!trimmed) return;

      history.current = [...history.current, trimmed].slice(-60);
      histPos.current = -1;

      const res = resolve(trimmed);
      if (res.clear) {
        setLines([]);
        play('click');
        return;
      }
      push(res.out);
      play(res.ok ? 'success' : 'error');
    },
    [push, resolve, play]
  );

  /* ------------------------------------------------------- */
  /* Key handling                                            */
  /* ------------------------------------------------------- */
  const onKeyDown = useCallback(
    (e) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLines([]);
        play('click');
        return;
      }

      if (ctrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        push([L(`${PROMPT} ${value}^C`, 'term__echo')]);
        setValue('');
        tab.current.active = false;
        histPos.current = -1;
        play('key');
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        submit(value);
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const t = tab.current;
        // Repeat Tab on an untouched suggestion cycles; anything else
        // starts a fresh search from what is currently typed.
        if (t.active && value === t.last && t.matches.length) {
          t.i = (t.i + 1) % t.matches.length;
        } else {
          const base = value.trim().toLowerCase();
          const matches = base
            ? COMPLETIONS.filter((c) => c.startsWith(base))
            : COMPLETIONS.slice();
          if (!matches.length) {
            play('error');
            return;
          }
          t.active = true;
          t.matches = matches;
          t.i = 0;
        }
        const next = t.matches[t.i];
        t.last = next;
        setValue(next);
        play('key');
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const h = history.current;
        if (!h.length) return;
        histPos.current = histPos.current < 0 ? h.length - 1 : Math.max(0, histPos.current - 1);
        setValue(h[histPos.current]);
        tab.current.active = false;
        play('key');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const h = history.current;
        if (!h.length || histPos.current < 0) return;
        if (histPos.current >= h.length - 1) {
          histPos.current = -1;
          setValue('');
        } else {
          histPos.current += 1;
          setValue(h[histPos.current]);
        }
        tab.current.active = false;
        play('key');
        return;
      }

      if (e.key.length === 1 || e.key === 'Backspace') play('key');
    },
    [value, submit, push, play]
  );

  const focusInput = useCallback(() => {
    const sel = window.getSelection?.();
    if (sel && !sel.isCollapsed) return; // the visitor is selecting output
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="section term" id="terminal" ref={sectionRef}>
      <div className="shell">
        <SectionHeader num="06" label="Console" />
        <SectionTitle className="term__title">
          <span ref={titleRef}>
            Or just <Accent volt>ask</Accent> the system.
          </span>
        </SectionTitle>

        <div className={`term__shell${reduced ? ' term__shell--still' : ''}`} onClick={focusInput}>
          <header className="term__chrome">
            <span className="term__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="term__chrome-title mono">
              <FiTerminal aria-hidden="true" /> {PERSON.initials.toLowerCase()}-shell — bash
            </span>
            <span className="term__chrome-hint mono" aria-hidden="true">
              tab ·<span> </span>↑↓ ·<span> </span>ctrl+l
            </span>
          </header>

          <div
            className="term__log mono"
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Console output"
            tabIndex={0}
          >
            {lines.map((line) => (
              <OutputLine line={line} key={line.id} />
            ))}
          </div>

          <form
            className="term__prompt mono"
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
          >
            <label className="sr-only" htmlFor="term-input">
              Type a command for the portfolio console, then press Enter
            </label>
            <span className="term__ps1" aria-hidden="true">
              {PROMPT}
            </span>
            <input
              id="term-input"
              className="term__input"
              ref={inputRef}
              type="text"
              value={value}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              enterKeyHint="send"
              data-cursor="hover"
              onChange={(e) => {
                setValue(e.target.value);
                tab.current.active = false;
              }}
              onKeyDown={onKeyDown}
            />
            <button
              type="submit"
              className="term__run"
              aria-label="Run command"
              data-cursor="hover"
            >
              <FiCornerDownLeft aria-hidden="true" />
            </button>
          </form>
        </div>

        <p className="term__footnote mono">
          Try{' '}
          {['neofetch', 'latency', 'sudo hire-me'].map((c, i) => (
            <span key={c}>
              {i > 0 && ' · '}
              <button
                type="button"
                className="term__suggest"
                data-cursor="hover"
                onClick={() => {
                  submit(c);
                  inputRef.current?.focus({ preventScroll: true });
                }}
              >
                {c}
              </button>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
