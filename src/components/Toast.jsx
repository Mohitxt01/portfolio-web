/* =========================================================
   TOAST — single transient notification.

   The positioner and the animated pill are separate nodes so GSAP's
   transform never clobbers the translateX(-50%) that centres it.
   ========================================================= */

import { useEffect, useRef } from 'react';
import { FiCheck, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { gsap } from '../lib/gsap.js';
import { useApp } from '../context/AppContext.jsx';
import '../styles/toast.css';

const ICONS = {
  info: FiInfo,
  success: FiCheck,
  error: FiAlertTriangle,
};

export default function Toast() {
  const { toast, reduced } = useApp();
  const pillRef = useRef(null);

  const id = toast?.id;

  useEffect(() => {
    const el = pillRef.current;
    if (!el || !id) return;

    if (reduced) {
      gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { autoAlpha: 0, y: 22, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'volt' }
    ).to(el, { autoAlpha: 0, y: 12, duration: 0.35, ease: 'power2.in' }, '+=1.75');

    return () => tl.kill();
  }, [id, reduced]);

  if (!toast) return null;

  const kind = ICONS[toast.kind] ? toast.kind : 'info';
  const Icon = ICONS[kind];

  return (
    <div className="toast" role="status" aria-live="polite" data-kind={kind}>
      <div className="toast__pill" ref={pillRef}>
        <i className="toast__bar" aria-hidden="true" />
        <Icon className="toast__icon" aria-hidden="true" />
        <span className="toast__msg">{toast.message}</span>
      </div>
    </div>
  );
}
