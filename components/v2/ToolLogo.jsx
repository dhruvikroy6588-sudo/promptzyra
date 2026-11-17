'use client';
import { useEffect, useRef, useState } from 'react';

export const toolHost = (url) => { try { const u = new URL(/^https?:\/\//i.test(url || '') ? url : `https://${url}`); return u.hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const hueOf = (s) => { let h = 0; for (const ch of String(s || '?')) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };

// Logo chain: tool.logo_url -> site favicon (Google s2) -> coloured letter avatar.
export default function ToolLogo({ tool, size = 40, className = '' }) {
  const t = tool || {};
  const host = toolHost(t.website_url);
  const sources = [t.logo_url, host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : ''].filter(Boolean);
  const key = sources.join('|');
  const [i, setI] = useState(0);
  const ref = useRef(null);
  useEffect(() => { setI(0); }, [key]);
  useEffect(() => { const el = ref.current; if (el && el.complete && el.naturalWidth === 0) setI((n) => n + 1); }, [i, key]);
  const box = { width: size, height: size, borderRadius: Math.round(size * 0.27) };
  if (i >= sources.length) {
    const h = hueOf(t.name);
    return <span className={`pz-logo pz-logo-ph ${className}`} aria-hidden="true" style={{ ...box, fontSize: Math.round(size * 0.45), background: `hsl(${h} 70% 92%)`, color: `hsl(${h} 55% 32%)`, borderColor: `hsl(${h} 50% 80%)` }}>{String(t.name || '?').trim().slice(0, 1).toUpperCase() || '?'}</span>;
  }
  return <img ref={ref} key={`${key}#${i}`} className={`pz-logo ${className}`} src={sources[i]} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" width={size} height={size} style={box} onError={() => setI((n) => n + 1)} />;
}
export { ToolLogo };
