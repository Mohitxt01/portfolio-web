#!/usr/bin/env node
/**
 * Regenerate public/og.png (1200×630) from an inline template.
 *
 *   node scripts/make-og.mjs
 *
 * Renders with whatever Chrome/Chromium is installed rather than pulling
 * in Puppeteer — this runs once when the copy changes, so a 300MB
 * devDependency would be a poor trade.
 */

import { writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og.png');

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome/Chromium found. Tried:\n  ' + CHROME_CANDIDATES.join('\n  '));
  process.exit(1);
}

/* Keep these in sync with src/data/content.js */
const HEADLINE = ['Full-Stack', 'Engineer', 'Systems Architect'];
const SUB =
  'Event-driven <b>Kafka</b> pipelines, agentic <b>LLM</b> workflows, and backends tuned for <b>60% lower P99 latency</b>.';
const STATS = [
  ['100+', 'REST APIs'],
  ['60%', 'P99 cut'],
  ['99.9%', 'Uptime'],
  ['500+', 'DSA solved'],
];

const html = `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;600&display=swap"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#060608;color:#f5f3ee;
  font-family:'Inter Tight',system-ui,sans-serif;position:relative}
.glow-a{position:absolute;width:900px;height:900px;right:-260px;top:-380px;
  background:radial-gradient(circle,rgba(110,86,248,.30),transparent 62%)}
.glow-b{position:absolute;width:760px;height:760px;left:-280px;bottom:-400px;
  background:radial-gradient(circle,rgba(200,255,0,.10),transparent 62%)}
.grid{position:absolute;inset:0;background-image:
  linear-gradient(to right,rgba(245,243,238,.055) 1px,transparent 1px),
  linear-gradient(to bottom,rgba(245,243,238,.055) 1px,transparent 1px);
  background-size:72px 72px;
  -webkit-mask-image:radial-gradient(ellipse 80% 75% at 40% 40%,#000 20%,transparent 76%)}
.wrap{position:relative;height:100%;padding:58px 72px;display:flex;
  flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:14px;font-family:'JetBrains Mono',monospace;
  font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:#78756f}
.dot{width:9px;height:9px;border-radius:50%;background:#c8ff00;box-shadow:0 0 18px rgba(200,255,0,.85)}
.rule{width:60px;height:1px;background:rgba(245,243,238,.2)}
h1{font-family:'Syne',sans-serif;font-weight:800;font-size:72px;line-height:.9;
  letter-spacing:-.045em;text-transform:uppercase}
h1 em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;
  text-transform:none;font-size:1.1em;letter-spacing:-.02em}
.amp{color:#c8ff00;font-family:'Instrument Serif',serif;font-style:italic;
  font-size:.52em;vertical-align:.18em}
.l3{margin-left:40px}
.sub{margin-top:22px;font-size:20px;line-height:1.45;color:#b4b1aa;max-width:720px}
.sub b{color:#f5f3ee;font-weight:600}
.bottom{display:flex;align-items:flex-end;justify-content:space-between}
.stats{display:flex;gap:46px}
.stat .v{font-family:'JetBrains Mono',monospace;font-size:33px;font-weight:600;
  letter-spacing:-.04em;line-height:1}
.stat .k{font-family:'JetBrains Mono',monospace;font-size:12.5px;letter-spacing:.14em;
  text-transform:uppercase;color:#78756f;margin-top:9px}
.stat:nth-child(1) .v{color:#c8ff00}.stat:nth-child(2) .v{color:#6e56f8}
.stat:nth-child(3) .v{color:#4fd8e8}.stat:nth-child(4) .v{color:#ffb020}
.mark{width:84px;height:84px;border-radius:21px;background:#0a0a0e;
  border:1px solid rgba(245,243,238,.14);display:grid;place-items:center}
</style></head><body>
<div class="glow-a"></div><div class="glow-b"></div><div class="grid"></div>
<div class="wrap">
  <div class="top"><span class="dot"></span><span>Mohit Tantway</span>
    <span class="rule"></span><span>Available for work</span></div>
  <div>
    <h1>${HEADLINE[0]}<br/><em>${HEADLINE[1]}</em> <span class="amp">&amp;</span><br/>
      <span class="l3">${HEADLINE[2]}</span></h1>
    <p class="sub">${SUB}</p>
  </div>
  <div class="bottom">
    <div class="stats">${STATS.map(
      ([v, k]) => `<div class="stat"><div class="v">${v}</div><div class="k">${k}</div></div>`
    ).join('')}</div>
    <div class="mark"><svg width="46" height="46" viewBox="0 0 120 120">
      <defs><linearGradient id="v" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c8ff00"/><stop offset="100%" stop-color="#6e56f8"/>
      </linearGradient></defs>
      <path d="M34 82V38L60 64L86 38V82" fill="none" stroke="url(#v)" stroke-width="11"
            stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
</div></body></html>`;

const work = join(tmpdir(), `og-${Date.now()}`);
mkdirSync(work, { recursive: true });
const page = join(work, 'og.html');
writeFileSync(page, html);

try {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      // Fonts come from the network; give them time to land before capture.
      '--virtual-time-budget=8000',
      `--screenshot=${OUT}`,
      page,
    ],
    { stdio: 'ignore' }
  );
  console.log(`✓ wrote ${OUT}`);
} catch (err) {
  console.error('Screenshot failed:', err.message);
  process.exit(1);
} finally {
  rmSync(work, { recursive: true, force: true });
}
