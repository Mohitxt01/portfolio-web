import { useCallback, useEffect, useRef, useState } from 'react';
import { FiActivity, FiCornerDownRight } from 'react-icons/fi';
import SectionHeader, { SectionTitle, Accent } from './SectionHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useInView } from '../hooks/useInteractions.js';
import { useLineReveal } from '../hooks/useReveal.js';
import { ARCHITECTURE } from '../data/content.js';
import '../styles/architecture.css';

/* ---------------------------------------------------------
   Layout + geometry constants (all in logical CSS pixels)
   --------------------------------------------------------- */
const COLS = 5;
const ROWS = 3;
const MIN_W = 820; // below this the canvas scrolls inside its own container
const NODE_H = 54;
const CORNER = 9;
const PACKET_SPEED = 108; // px per second — constant so every lane reads at one tempo

/* Canvas font strings are not CSS — var() is not resolved here, so the
   mono stack has to be spelled out to match --mono. */
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

/* Each node kind borrows one accent so the palette still reads as
   punctuation: four hues across ten nodes, assigned by role. */
const KIND_ACCENT = {
  edge: 'cyan',
  service: 'lime',
  store: 'ink2',
  broker: 'violet',
  worker: 'lime',
  cache: 'amber',
  query: 'cyan',
};

/* Palette comes from the CSS custom properties so the canvas can never
   drift from tokens.css. Fallbacks are deliberately neutral. */
function readPalette(el) {
  const cs = getComputedStyle(el);
  const t = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    bg: t('--void', 'rgb(6, 6, 8)'),
    surface: t('--obsidian', 'rgb(10, 10, 14)'),
    raised: t('--raised', 'rgb(22, 22, 30)'),
    line: t('--line-2', 'rgba(255, 255, 255, 0.12)'),
    lineSoft: t('--line', 'rgba(255, 255, 255, 0.07)'),
    ink: t('--ink', 'rgb(245, 243, 238)'),
    ink2: t('--ink-2', 'rgb(180, 177, 170)'),
    ink3: t('--ink-3', 'rgb(120, 117, 111)'),
    ink4: t('--ink-4', 'rgba(255, 255, 255, 0.28)'),
    lime: t('--lime', 'rgb(200, 255, 0)'),
    violet: t('--violet', 'rgb(110, 86, 248)'),
    cyan: t('--cyan', 'rgb(79, 216, 232)'),
    amber: t('--amber', 'rgb(255, 176, 32)'),
  };
}

function accentFor(pal, kind) {
  return pal[KIND_ACCENT[kind] || 'ink2'] || pal.ink2;
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/* Orthogonal routing: exit the source's right edge, run to a shared
   mid-column, step vertically, then enter the target's left edge.
   `bias` nudges the mid-column per edge so two elbows crossing the same
   gap do not stack into one ambiguous line. */
function routeEdge(a, b, bias) {
  const start = { x: a.x + a.w / 2, y: a.y };
  const end = { x: b.x - b.w / 2, y: b.y };
  if (Math.abs(start.y - end.y) < 1) return [start, end];
  const mid = (start.x + end.x) / 2 + bias;
  return [start, { x: mid, y: start.y }, { x: mid, y: end.y }, end];
}

function measurePath(pts) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, len, at: total });
    total += len;
  }
  return { pts, segs, total };
}

function pointAtLength(path, d) {
  const clamped = Math.max(0, Math.min(path.total, d));
  for (const s of path.segs) {
    if (clamped <= s.at + s.len) {
      const t = s.len ? (clamped - s.at) / s.len : 0;
      return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
    }
  }
  const last = path.segs[path.segs.length - 1];
  return { x: last.b.x, y: last.b.y };
}

function strokeRouted(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];
    const r = Math.min(
      CORNER,
      Math.hypot(cur.x - prev.x, cur.y - prev.y) / 2,
      Math.hypot(next.x - cur.x, next.y - cur.y) / 2
    );
    ctx.arcTo(cur.x, cur.y, next.x, next.y, r);
  }
  const tail = pts[pts.length - 1];
  ctx.lineTo(tail.x, tail.y);
  ctx.stroke();
}

/* Deterministic phase per packet so the flow looks organic but is
   identical on every load (and across a resize). */
function phaseFor(i, k) {
  const s = Math.sin((i + 1) * 12.9898 + (k + 1) * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const NEIGHBOURS = (() => {
  const map = {};
  ARCHITECTURE.nodes.forEach((n) => {
    map[n.id] = new Set();
  });
  ARCHITECTURE.edges.forEach(([from, to]) => {
    map[from]?.add(to);
    map[to]?.add(from);
  });
  return map;
})();

export default function Architecture() {
  const { reduced, tier, play } = useApp();
  const isStatic = reduced || tier === 'low';

  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const redrawRef = useRef(null);

  const [activeId, setActiveId] = useState(null);
  const activeRef = useRef(null);
  const [stageRef, stageInView] = useInView({ once: false, threshold: 0.05 });
  const [tele, setTele] = useState({ rows: 41280, p99: 38, lag: 112 });

  useLineReveal(titleRef);

  const active = ARCHITECTURE.nodes.find((n) => n.id === activeId) || null;

  const select = useCallback(
    (id) => {
      if (id && activeRef.current !== id) play('hover');
      setActiveId(id);
    },
    [play]
  );

  /* The draw loop reads the active node from a ref so hovering never
     tears down and rebuilds the renderer. */
  useEffect(() => {
    activeRef.current = activeId;
    if (isStatic) redrawRef.current?.();
  }, [activeId, isStatic]);

  /* ------------------------------------------------------- */
  /* Renderer                                                */
  /* ------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let pal = readPalette(canvas);
    let W = 0;
    let H = 0;
    let layout = { nodes: [], edges: [] };

    /* --- layout ------------------------------------------ */
    function relayout() {
      const avail = wrap.clientWidth || MIN_W;
      W = Math.max(MIN_W, Math.round(avail));
      H = Math.round(Math.min(470, Math.max(350, W * 0.44)));

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const padX = 14;
      const padY = 18;
      const cellW = (W - padX * 2) / COLS;
      const cellH = (H - padY * 2) / ROWS;
      const nodeW = Math.min(cellW - 22, 148);

      const nodes = ARCHITECTURE.nodes.map((n) => ({
        ...n,
        w: nodeW,
        h: NODE_H,
        x: padX + cellW * (n.col + 0.5),
        y: padY + cellH * (n.row + 0.5),
      }));

      const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
      const edges = ARCHITECTURE.edges
        .map(([from, to], i) => {
          const a = byId[from];
          const b = byId[to];
          if (!a || !b) return null;
          const bias = ((i % 3) - 1) * 9;
          const path = measurePath(routeEdge(a, b, bias));
          const count = path.total > 230 ? 2 : 1;
          const packets = Array.from({ length: count }, (_, k) => phaseFor(i, k));
          return { from, to, path, packets };
        })
        .filter(Boolean);

      layout = { nodes, edges, byId };
    }

    /* --- painting ---------------------------------------- */
    function paintBackdrop() {
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);

      // Instrumentation grid: 22px dot lattice, barely there.
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = pal.ink4;
      for (let x = 22; x < W; x += 22) {
        for (let y = 22; y < H; y += 22) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.restore();
    }

    function paintEdge(edge, state) {
      const dim = state === 'dim';
      ctx.save();
      ctx.globalAlpha = dim ? 0.2 : 1;
      ctx.lineWidth = state === 'hot' ? 1.5 : 1;
      ctx.strokeStyle = state === 'hot' ? pal.lime : pal.line;
      strokeRouted(ctx, edge.path.pts);
      ctx.restore();
    }

    function paintPacket(edge, t, state) {
      if (state === 'dim') return;
      const total = edge.path.total;
      const hot = state === 'hot';
      ctx.save();
      for (const phase of edge.packets) {
        const d = (t * PACKET_SPEED + phase * total) % total;
        // Tapering trail: a handful of shrinking dots behind the head.
        for (let j = 6; j >= 0; j--) {
          const dd = d - j * 5.2;
          if (dd < 0) continue;
          const p = pointAtLength(edge.path, dd);
          const fade = 1 - j / 7;
          ctx.globalAlpha = (hot ? 0.95 : 0.6) * fade * fade;
          ctx.fillStyle = pal.lime;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.9 + 1.9 * fade, 0, Math.PI * 2);
          ctx.fill();
        }
        const head = pointAtLength(edge.path, d);
        ctx.globalAlpha = 1;
        ctx.shadowColor = pal.lime;
        ctx.shadowBlur = hot ? 16 : 9;
        ctx.fillStyle = pal.lime;
        ctx.beginPath();
        ctx.arc(head.x, head.y, hot ? 3.1 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }

    function paintNode(n, state) {
      const accent = accentFor(pal, n.kind);
      const x = n.x - n.w / 2;
      const y = n.y - n.h / 2;
      const hot = state === 'hot';

      ctx.save();
      ctx.globalAlpha = state === 'dim' ? 0.3 : 1;

      if (hot) {
        // Soft bloom so the selected node reads before the label does.
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = accent;
        roundRectPath(ctx, x - 9, y - 9, n.w + 18, n.h + 18, CORNER + 7);
        ctx.fill();
        ctx.restore();
      }

      roundRectPath(ctx, x, y, n.w, n.h, CORNER);
      ctx.fillStyle = hot ? pal.raised : pal.surface;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = hot ? accent : pal.line;
      ctx.stroke();

      // Left accent bar — the one place each node shows its hue.
      ctx.save();
      roundRectPath(ctx, x, y, n.w, n.h, CORNER);
      ctx.clip();
      ctx.globalAlpha = hot ? 1 : 0.55;
      ctx.fillStyle = accent;
      ctx.fillRect(x, y, 2.5, n.h);
      ctx.restore();

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = hot ? pal.ink : pal.ink2;
      ctx.font = `500 11.5px ${MONO}`;
      ctx.fillText(n.label, x + 14, n.y - 7);

      ctx.fillStyle = hot ? accent : pal.ink3;
      ctx.font = `500 8.5px ${MONO}`;
      ctx.fillText(n.kind.toUpperCase(), x + 14, n.y + 9);

      ctx.restore();
    }

    function draw(t) {
      if (!layout.nodes.length) return;
      const act = activeRef.current;
      const near = act ? NEIGHBOURS[act] : null;

      paintBackdrop();

      for (const e of layout.edges) {
        const touches = act && (e.from === act || e.to === act);
        paintEdge(e, !act ? 'base' : touches ? 'hot' : 'dim');
      }
      if (!isStatic) {
        for (const e of layout.edges) {
          const touches = act && (e.from === act || e.to === act);
          paintPacket(e, t, !act ? 'base' : touches ? 'hot' : 'dim');
        }
      }
      for (const n of layout.nodes) {
        const state = !act ? 'base' : n.id === act ? 'hot' : near?.has(n.id) ? 'base' : 'dim';
        paintNode(n, state);
      }
    }

    /* --- loop -------------------------------------------- */
    let raf = null;
    let running = false;
    let elapsed = 0;
    let last = 0;

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      draw(elapsed);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || isStatic) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    relayout();
    draw(0);
    redrawRef.current = () => draw(elapsed);

    /* --- resize ------------------------------------------ */
    let lastW = -1;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (w === lastW) return;
      lastW = w;
      pal = readPalette(canvas);
      relayout();
      draw(elapsed);
    });
    ro.observe(wrap);

    /* --- pause when offscreen / backgrounded ------------- */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (io) {
        // Re-arm: the IO callback fires again on observe.
        io.unobserve(canvas);
        io.observe(canvas);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    /* --- pointer hit-testing ----------------------------- */
    const toLocal = (ev) => {
      const r = canvas.getBoundingClientRect();
      // Map viewport coords into the canvas' logical space; the rect can
      // differ from W/H if the browser is zoomed or the page is scaled.
      return {
        x: (ev.clientX - r.left) * (W / r.width),
        y: (ev.clientY - r.top) * (H / r.height),
      };
    };
    const hitTest = (p) =>
      layout.nodes.find(
        (n) =>
          p.x >= n.x - n.w / 2 &&
          p.x <= n.x + n.w / 2 &&
          p.y >= n.y - n.h / 2 &&
          p.y <= n.y + n.h / 2
      ) || null;

    const onMove = (ev) => {
      const hit = hitTest(toLocal(ev));
      canvas.style.cursor = hit ? 'pointer' : 'default';
      const next = hit ? hit.id : null;
      if (next === activeRef.current) return;
      if (next) play('hover');
      setActiveId(next);
    };
    const onLeave = () => setActiveId(null);
    const onClick = (ev) => {
      const hit = hitTest(toLocal(ev));
      if (hit) {
        play('click');
        setActiveId(hit.id);
      }
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      redrawRef.current = null;
    };
  }, [isStatic, play]);

  /* ------------------------------------------------------- */
  /* Telemetry — plausible drift, frozen under reduced motion */
  /* ------------------------------------------------------- */
  useEffect(() => {
    if (reduced || !stageInView) return;
    const jitter = (span) => (Math.random() - 0.5) * span;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const id = setInterval(() => {
      setTele((t) => ({
        rows: Math.round(clamp(t.rows + jitter(5200), 27600, 56400)),
        p99: Math.round(clamp(t.p99 + jitter(9), 22, 61)),
        lag: Math.round(clamp(t.lag + jitter(70), 6, 430)),
      }));
    }, 1500);
    return () => clearInterval(id);
  }, [reduced, stageInView]);

  const ariaLabel =
    `${ARCHITECTURE.title} pipeline diagram: ` +
    ARCHITECTURE.nodes.map((n) => n.label).join(', ') +
    `, connected by ${ARCHITECTURE.edges.length} data flows from client upload through Kafka ` +
    'into parallel consumers, Redis, MySQL and Trino.';

  return (
    <section className="section arch" id="architecture">
      <div className="shell">
        <SectionHeader num="03" label="System Design" />
        <SectionTitle className="arch__title">
          <span ref={titleRef}>
            How <Accent volt>Scale-Ops</Accent> actually runs.
          </span>
        </SectionTitle>

        <p className="arch__blurb lead reveal">{ARCHITECTURE.blurb}</p>

        <div className="arch__stage reveal" ref={stageRef}>
          <header className="arch__stage-head">
            <div className="arch__stage-id">
              <h3 className="arch__stage-title display">{ARCHITECTURE.title}</h3>
              <p className="arch__stage-sub mono">{ARCHITECTURE.subtitle}</p>
            </div>
            <p className={`arch__live mono${isStatic ? ' is-static' : ''}`}>
              <span className="arch__live-dot" aria-hidden="true" />
              {isStatic ? 'static view' : 'live flow'}
            </p>
          </header>

          <div className="arch__canvas-wrap scroll-x" ref={wrapRef}>
            <canvas className="arch__canvas" ref={canvasRef} role="img" aria-label={ariaLabel} />
          </div>

          {/* Screen-reader equivalent of the diagram. Always rendered. */}
          <div className="sr-only">
            <h4>{ARCHITECTURE.title} pipeline stages</h4>
            <ol>
              {ARCHITECTURE.nodes.map((n) => (
                <li key={n.id}>
                  {n.label} ({n.kind}) — {n.detail} {n.stat} {n.statLabel}. Connects to:{' '}
                  {[...(NEIGHBOURS[n.id] || [])]
                    .map((id) => ARCHITECTURE.nodes.find((x) => x.id === id)?.label)
                    .filter(Boolean)
                    .join(', ') || 'nothing'}
                  .
                </li>
              ))}
            </ol>
          </div>

          <div className="arch__telemetry mono" aria-label="Pipeline telemetry">
            <span className="arch__readout">
              <span className="arch__readout-k">rows/sec</span>
              <span className="arch__readout-v">{tele.rows.toLocaleString('en-US')}</span>
            </span>
            <span className="arch__readout">
              <span className="arch__readout-k">p99</span>
              <span className="arch__readout-v">{tele.p99}ms</span>
            </span>
            <span className="arch__readout">
              <span className="arch__readout-k">consumer lag</span>
              <span className="arch__readout-v">{tele.lag}</span>
            </span>
            <span className="arch__readout arch__readout--ok">
              <FiActivity aria-hidden="true" />
              <span className="arch__readout-v">healthy</span>
            </span>
          </div>
        </div>

        <div className="arch__below">
          {/* Keyboard-operable parallel control for every canvas node. */}
          <div className="arch__legend" role="group" aria-label="Pipeline nodes">
            {ARCHITECTURE.nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`arch__key mono${activeId === n.id ? ' is-active' : ''}`}
                data-kind={n.kind}
                data-cursor="hover"
                aria-pressed={activeId === n.id}
                onFocus={() => select(n.id)}
                onMouseEnter={() => select(n.id)}
                onClick={() => {
                  play('click');
                  setActiveId(n.id);
                }}
              >
                <span className="arch__key-bar" aria-hidden="true" />
                <span className="arch__key-label">{n.label}</span>
                <span className="arch__key-kind">{n.kind}</span>
              </button>
            ))}
          </div>

          <aside className="arch__detail panel" aria-live="polite">
            {active ? (
              <>
                <p className="arch__detail-kind mono" data-kind={active.kind}>
                  {active.kind}
                </p>
                <h4 className="arch__detail-title display">{active.label}</h4>
                <p className="arch__detail-body">{active.detail}</p>
                <p className="arch__detail-stat">
                  <span className="arch__detail-stat-v display">{active.stat}</span>
                  <span className="arch__detail-stat-l mono">{active.statLabel}</span>
                </p>
              </>
            ) : (
              <>
                <p className="arch__detail-kind mono">idle</p>
                <h4 className="arch__detail-title display">Pick a stage</h4>
                <p className="arch__detail-body">
                  Hover a node on the diagram — or tab through the list — to see what it does and
                  the number it is responsible for.
                </p>
                <p className="arch__detail-hint mono">
                  <FiCornerDownRight aria-hidden="true" /> {ARCHITECTURE.edges.length} flows ·{' '}
                  {ARCHITECTURE.nodes.length} stages
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
