// Inline placeholder cover (CSS gradient + camera/frame SVG). No external files, so it can never break.
const HUES = [[262, 190], [330, 24], [200, 150], [28, 340], [160, 250], [48, 300]];
const hash = (s) => { let h = 0; const t = String(s || 'photo'); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h; };
export default function PhotoPlaceholder({ seed = '', label = '' }) {
  const [a, b] = HUES[hash(seed) % HUES.length];
  return (
    <div className="ph-cover" role="img" aria-label={label || 'Photo prompt cover'} style={{ background: `linear-gradient(135deg, hsl(${a} 70% 45%), hsl(${b} 70% 40%))` }}>
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 18h10l4-6h20l4 6h10a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z" />
        <circle cx="32" cy="34" r="9" />
        <path d="M14 26h4" />
      </svg>
    </div>
  );
}
