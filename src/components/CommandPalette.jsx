/* =========================================================
   COMMAND PALETTE — ⌘K
   Fuzzy subsequence search with match highlighting,
   grouped commands, full keyboard control.
   ========================================================= */

import { useEffect, useMemo, useRef, useState, useCallback, Fragment } from 'react';
import {
  FiSearch,
  FiArrowRight,
  FiCopy,
  FiLinkedin,
  FiTerminal,
  FiVolume2,
  FiVolumeX,
  FiActivity,
  FiCornerDownLeft,
} from 'react-icons/fi';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import { useCopy } from '../hooks/useInteractions.js';
import { scrollToId } from '../hooks/useSmoothScroll.js';
import { SECTIONS, PERSON } from '../data/content.js';
import '../styles/palette.css';

const NAV_OFFSET = -72;
const GROUPS = ['Navigate', 'Actions', 'Settings'];

/**
 * Subsequence match. Returns null when the query cannot be threaded through
 * the text at all; otherwise a score plus the matched character indices so
 * the renderer can highlight exactly what the user typed.
 */
function fuzzyMatch(text, query) {
  if (!query) return { score: 0, indices: [] };

  const t = text.toLowerCase();
  const q = query.toLowerCase();
  const indices = [];

  let cursor = 0;
  let score = 0;
  let streak = 0;

  for (let i = 0; i < q.length; i++) {
    const found = t.indexOf(q[i], cursor);
    if (found === -1) return null;
    indices.push(found);

    if (found === cursor && i > 0) {
      streak += 1;
      score += 8 + streak * 3; // contiguous runs are what people mean
    } else {
      streak = 0;
      score += 1;
    }
    if (found === 0) score += 14;
    else if (/[\s\-/·_]/.test(t[found - 1])) score += 7; // word-start hit

    cursor = found + 1;
  }

  // Earlier and tighter matches rank above scattered ones.
  score -= indices[0] * 0.6;
  score -= (indices[indices.length - 1] - indices[0] - q.length + 1) * 0.3;
  if (t.startsWith(q)) score += 30;

  return { score, indices };
}

/** Groups matched indices into runs so highlighting emits few nodes. */
function Highlight({ text, indices }) {
  if (!indices?.length) return text;
  const set = new Set(indices);
  const parts = [];
  let buf = '';
  let on = set.has(0);

  for (let i = 0; i < text.length; i++) {
    const hit = set.has(i);
    if (hit !== on) {
      parts.push({ on, buf });
      buf = '';
      on = hit;
    }
    buf += text[i];
  }
  parts.push({ on, buf });

  return parts.map((p, i) =>
    p.on ? (
      <mark className="pal__hit" key={i}>
        {p.buf}
      </mark>
    ) : (
      <Fragment key={i}>{p.buf}</Fragment>
    )
  );
}

function isTypingTarget(el) {
  if (!(el instanceof Element)) return false;
  return !!el.closest('input, textarea, select, [contenteditable="true"]');
}

export default function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    sound,
    toggleSound,
    reduced,
    toggleReduced,
    notify,
    play,
  } = useApp();
  const { copy } = useCopy();

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const rootRef = useRef(null);
  const scrimRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const restoreFocus = useRef(null);

  /* ---------------- commands ---------------- */

  const commands = useMemo(() => {
    const list = SECTIONS.map((s) => ({
      key: `nav:${s.id}`,
      group: 'Navigate',
      label: s.label,
      hint: s.num,
      icon: <FiArrowRight aria-hidden="true" />,
      run: () => scrollToId(s.id, NAV_OFFSET),
    }));

    list.push(
      {
        key: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: PERSON.email,
        icon: <FiCopy aria-hidden="true" />,
        run: async () => {
          const ok = await copy(PERSON.email);
          notify(ok ? 'Email copied' : 'Could not copy', ok ? 'success' : 'error');
          play(ok ? 'success' : 'error');
        },
      },
      {
        key: 'linkedin',
        group: 'Actions',
        label: 'Open LinkedIn profile',
        hint: PERSON.linkedinHandle,
        icon: <FiLinkedin aria-hidden="true" />,
        run: () => window.open(PERSON.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        key: 'terminal',
        group: 'Actions',
        label: 'Open the terminal',
        hint: 'interactive',
        icon: <FiTerminal aria-hidden="true" />,
        run: () => scrollToId('terminal', NAV_OFFSET),
      },
      {
        key: 'sound',
        group: 'Settings',
        label: sound ? 'Disable interface sound' : 'Enable interface sound',
        hint: sound ? 'on' : 'off',
        icon: sound ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />,
        run: () => toggleSound(),
        keepOpen: true,
      },
      {
        key: 'reduced',
        group: 'Settings',
        label: reduced ? 'Restore full motion' : 'Reduce motion',
        hint: reduced ? 'reduced' : 'full',
        icon: <FiActivity aria-hidden="true" />,
        run: () => toggleReduced(),
        keepOpen: true,
      }
    );

    return list;
  }, [sound, reduced, toggleSound, toggleReduced, copy, notify, play]);

  const results = useMemo(() => {
    const q = query.trim();
    const scored = [];

    commands.forEach((cmd) => {
      const onLabel = fuzzyMatch(cmd.label, q);
      if (onLabel) {
        scored.push({ ...cmd, score: onLabel.score, indices: onLabel.indices });
        return;
      }
      // Typing a group name ("settings") should still surface its commands,
      // just ranked below any direct label match.
      if (q && fuzzyMatch(cmd.group, q)) {
        scored.push({ ...cmd, score: -50, indices: [] });
      }
    });

    if (!q) return scored;
    return scored.sort((a, b) => b.score - a.score);
  }, [commands, query]);

  /* Flat order drives the keyboard index; grouping is presentation only. */
  const grouped = useMemo(() => {
    if (query.trim()) return [{ group: null, items: results }];
    return GROUPS.map((g) => ({ group: g, items: results.filter((r) => r.group === g) })).filter(
      (g) => g.items.length
    );
  }, [results, query]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  /* ---------------- global shortcut ---------------- */

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key?.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        // Let the palette's own input through; block other fields.
        if (isTypingTarget(e.target) && !rootRef.current?.contains(e.target)) return;
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && paletteOpen) {
        e.preventDefault();
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, setPaletteOpen]);

  /* ---------------- mount / unmount with animation ---------------- */

  useEffect(() => {
    if (paletteOpen) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    if (reduced) {
      setMounted(false);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(panelRef.current, { autoAlpha: 0, scale: 0.97, y: -6, duration: 0.2, ease: 'power2.in' }).to(
      scrimRef.current,
      { autoAlpha: 0, duration: 0.22 },
      0
    );
    return () => tl.kill();
  }, [paletteOpen, mounted, reduced]);

  // Read through a ref so flipping "reduce motion" from inside the palette
  // does not re-run the open sequence and wipe the user's query.
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    if (!mounted || !paletteOpen) return;
    setQuery('');
    setSelected(0);
    playRef.current?.('open');
    const reduced = reducedRef.current;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([scrimRef.current, panelRef.current], { autoAlpha: 1, scale: 1, y: 0 });
        return;
      }
      gsap.fromTo(scrimRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: 'none' });
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, scale: 0.96, y: 12 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.44, ease: 'volt' }
      );
      gsap.fromTo(
        '.pal__row',
        { autoAlpha: 0, y: 7 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.018, delay: 0.08, ease: 'swift' }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [mounted, paletteOpen]);

  /* ---------------- lock, focus trap, focus restore ---------------- */

  useEffect(() => {
    // `mounted` matters as much as `paletteOpen`: opening flips paletteOpen
    // first and only then sets mounted, so on that first pass the component
    // still renders null and inputRef is empty. Without `mounted` in the
    // deps this effect would run once against nothing and never retry.
    if (!paletteOpen || !mounted) return;

    document.body.classList.add('is-locked');
    restoreFocus.current = document.activeElement;

    /* The open animation uses autoAlpha, which sets visibility:hidden
       synchronously and only clears it on GSAP's first tick. A hidden
       element silently refuses focus, so waiting one frame races that
       tick — force visibility, then focus on the following frame. */
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      if (panelRef.current) gsap.set(panelRef.current, { visibility: 'visible' });
      frame2 = requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    });

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll('input, button:not([disabled]), a[href]')
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;

      // Focus must not escape behind the scrim.
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      const back = restoreFocus.current;
      if (back && typeof back.focus === 'function') back.focus();
    };
  }, [paletteOpen, mounted]);

  /* Keep the active row inside the scroll viewport. */
  useEffect(() => {
    rowRefs.current[selected]?.scrollIntoView({ block: 'nearest' });
  }, [selected, flat.length]);

  /* ---------------- run ---------------- */

  const runCommand = useCallback(
    (cmd) => {
      if (!cmd) return;
      play('click');
      if (!cmd.keepOpen) setPaletteOpen(false);
      // Defer so the close animation and the command's own work do not
      // compete for the same frame.
      requestAnimationFrame(() => cmd.run());
    },
    [play, setPaletteOpen]
  );

  const onPanelKeyDown = (e) => {
    if (!flat.length) {
      if (e.key === 'Enter') e.preventDefault();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((i) => (i + 1) % flat.length);
      play('key');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => (i - 1 + flat.length) % flat.length);
      play('key');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(flat[selected]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelected(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelected(flat.length - 1);
    }
  };

  if (!mounted) return null;

  rowRefs.current = [];
  let index = -1;

  return (
    <div className="pal" ref={rootRef}>
      <div
        className="pal__scrim"
        ref={scrimRef}
        onClick={() => {
          play('close');
          setPaletteOpen(false);
        }}
      />

      <div
        className="pal__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onPanelKeyDown}
      >
        <div className="pal__search">
          <FiSearch className="pal__searchicon" aria-hidden="true" />
          <input
            ref={inputRef}
            className="pal__input mono"
            type="text"
            value={query}
            placeholder="Search sections and actions…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck="false"
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
          />
          <span className="pal__esc mono" aria-hidden="true">
            esc
          </span>
        </div>

        <div className="pal__list" ref={listRef} role="listbox" aria-label="Commands">
          {grouped.map((g) => (
            <div className="pal__group" key={g.group || 'results'}>
              <p className="pal__grouplabel label">{g.group || `${flat.length} results`}</p>
              {g.items.map((cmd) => {
                index += 1;
                const i = index;
                const isSel = i === selected;
                return (
                  <button
                    type="button"
                    key={cmd.key}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className={`pal__row${isSel ? ' is-sel' : ''}`}
                    role="option"
                    aria-selected={isSel}
                    tabIndex={-1}
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => runCommand(cmd)}
                    data-cursor="hover"
                  >
                    <span className="pal__icon" aria-hidden="true">
                      {cmd.icon}
                    </span>
                    <span className="pal__rowlabel">
                      <Highlight text={cmd.label} indices={cmd.indices} />
                    </span>
                    {cmd.hint && <span className="pal__hint mono">{cmd.hint}</span>}
                    <FiCornerDownLeft className="pal__enter" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}

          {!flat.length && (
            <div className="pal__empty">
              <p className="pal__emptytitle display">Nothing matches</p>
              <p className="pal__emptysub mono">
                &ldquo;{query}&rdquo; — try a section name, or &ldquo;email&rdquo;.
              </p>
            </div>
          )}
        </div>

        <footer className="pal__foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> run
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </footer>
      </div>
    </div>
  );
}
