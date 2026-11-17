'use client';
import { useEffect, useRef } from 'react';

// Pointer effects (fine pointers only, off for reduced motion): eased glow + ring, magnetic pull on .btn/.magnetic,
// and the .spot card spotlight (--cx/--cy). Everything runs in one rAF loop and uses transforms only (no layout shift).
const HOVER = 'a[href],button,.spot,input,select,textarea,summary,[role=button]';
const MAG = '.btn,.magnetic';
const MAX_PULL = 6;

export default function CursorFX() {
  const glow = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer:fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (!fine || reduce) return;
    const root = document.documentElement;
    const g = glow.current, r = ring.current;
    if (!g || !r) return;
    let tx = -200, ty = -200;          // pointer target
    let gx = tx, gy = ty, rx = tx, ry = ty; // eased glow / ring
    let scale = 1, scaleT = 1, down = false, seen = false, raf = 0;
    let mag = null, spot = null;

    const setMag = (el, e) => {
      if (mag && mag !== el) { mag.style.transform = ''; mag = null; }
      if (!el) return;
      mag = el;
      const b = el.getBoundingClientRect();
      const dx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
      const dy = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
      const k = (v) => Math.max(-1, Math.min(1, v)) * MAX_PULL;
      el.style.transform = `translate3d(${k(dx).toFixed(2)}px,${k(dy).toFixed(2)}px,0)`;
    };
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; gx = rx = tx; gy = ry = ty; root.classList.add('fx-on'); }
      const t = e.target instanceof Element ? e.target : null;
      const hot = t && t.closest(HOVER);
      scaleT = down ? 0.7 : hot ? 1.9 : 1;
      r.classList.toggle('on-hot', !!hot);
      const c = t && t.closest('.spot');
      if (c) { const b = c.getBoundingClientRect(); c.style.setProperty('--cx', (tx - b.left) + 'px'); c.style.setProperty('--cy', (ty - b.top) + 'px'); }
      setMag(t && t.closest(MAG), e);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onDown = () => { down = true; scaleT = 0.7; if (!raf) raf = requestAnimationFrame(tick); };
    const onUp = () => { down = false; scaleT = r.classList.contains('on-hot') ? 1.9 : 1; if (!raf) raf = requestAnimationFrame(tick); };
    const onLeave = () => { seen = false; root.classList.remove('fx-on'); setMag(null); };
    const tick = () => {
      raf = 0;
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      scale += (scaleT - scale) * 0.2;
      g.style.transform = `translate3d(${gx.toFixed(1)}px,${gy.toFixed(1)}px,0) translate(-50%,-50%)`;
      r.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      const moving = Math.abs(tx - gx) > 0.2 || Math.abs(ty - gy) > 0.2 || Math.abs(tx - rx) > 0.2 || Math.abs(ty - ry) > 0.2 || Math.abs(scaleT - scale) > 0.005;
      if (moving) raf = requestAnimationFrame(tick);
    };
    const onHide = () => { if (document.hidden) onLeave(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave); document.removeEventListener('visibilitychange', onHide);
      if (raf) cancelAnimationFrame(raf);
      if (mag) mag.style.transform = '';
      root.classList.remove('fx-on');
    };
  }, []);
  return (<>
    <div className="cursor-glow" ref={glow} aria-hidden="true" />
    <div className="cursor-ring" ref={ring} aria-hidden="true" />
  </>);
}
