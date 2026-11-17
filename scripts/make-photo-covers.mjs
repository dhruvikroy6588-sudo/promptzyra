// Generates flat illustrator-style PLACEHOLDER covers (800x1000 WebP, no text) for content/seed-photo-prompts.json
// usage: node scripts/make-photo-covers.mjs  -> public/photo-covers/<slug>.webp
// Replace with real example images from the admin panel (Photo prompts > image upload).
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp';
const items = JSON.parse(fs.readFileSync('content/seed-photo-prompts.json', 'utf8'));
fs.mkdirSync('public/photo-covers', { recursive: true });
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed) => () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const W = 800, H = 1000;
const PAL = {
  men: [['#0f172a', '#1d4ed8', '#93c5fd'], ['#1c1917', '#b45309', '#fcd34d'], ['#042f2e', '#0f766e', '#99f6e4']],
  women: [['#4c0519', '#be185d', '#fbcfe8'], ['#431407', '#ea580c', '#fed7aa'], ['#3b0764', '#9333ea', '#e9d5ff']],
  couple: [['#500724', '#e11d48', '#fecdd3'], ['#7c2d12', '#f59e0b', '#fef3c7'], ['#312e81', '#db2777', '#fbcfe8']],
  family: [['#14532d', '#16a34a', '#bbf7d0'], ['#78350f', '#d97706', '#fde68a'], ['#7f1d1d', '#ea580c', '#fed7aa']],
  birthday: [['#581c87', '#c026d3', '#f5d0fe'], ['#831843', '#f43f5e', '#fde68a'], ['#1e3a8a', '#0ea5e9', '#fef08a']],
  pets: [['#713f12', '#ca8a04', '#fef9c3'], ['#134e4a', '#14b8a6', '#fde68a'], ['#7c2d12', '#f97316', '#e0f2fe']],
  portrait: [['#1e1b4b', '#6366f1', '#fde68a'], ['#0c4a6e', '#06b6d4', '#fecdd3'], ['#3f3f46', '#a1a1aa', '#fef3c7']],
};
const sparkle = (x, y, s, f = '#fde047', o = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8z" fill="${f}" opacity="${o}"/>`;
// camera body (centre 0,0)
const camera = (c) => `<g><rect x="-190" y="-120" width="380" height="250" rx="40" fill="#fff"/><path d="M-80 -120 l22 -44 h116 l22 44z" fill="#fff"/><rect x="-190" y="-60" width="380" height="36" fill="${c[2]}"/><circle cx="0" cy="30" r="86" fill="${c[0]}"/><circle cx="0" cy="30" r="64" fill="${c[1]}"/><circle cx="0" cy="30" r="38" fill="${c[0]}"/><circle cx="-16" cy="14" r="12" fill="#fff" opacity=".8"/><circle cx="140" cy="-88" r="14" fill="${c[1]}"/><rect x="-160" y="-96" width="60" height="22" rx="8" fill="${c[1]}"/></g>`;
// framed portrait silhouette
const frame = (c) => `<g><rect x="-170" y="-220" width="340" height="440" rx="18" fill="#fff"/><rect x="-146" y="-196" width="292" height="392" rx="8" fill="${c[2]}"/><circle cx="0" cy="-60" r="60" fill="${c[1]}"/><path d="M-110 196 C-110 90 -60 30 0 30 C60 30 110 90 110 196z" fill="${c[1]}"/><path d="M-146 196 L-60 100 L10 170 L60 120 L146 196z" fill="${c[0]}" opacity=".18"/></g>`;
const polaroid = (c) => `<g><rect x="-160" y="-200" width="320" height="400" rx="10" fill="#fff"/><rect x="-136" y="-176" width="272" height="272" rx="4" fill="${c[2]}"/><circle cx="60" cy="-100" r="30" fill="#fff" opacity=".9"/><path d="M-136 96 L-50 -30 L20 50 L70 0 L136 96z" fill="${c[1]}"/><rect x="-100" y="130" width="140" height="14" rx="7" fill="${c[2]}"/></g>`;
const filmstrip = (c) => `<g><rect x="-100" y="-230" width="200" height="460" rx="14" fill="#fff"/>${[0, 1, 2].map((i) => `<rect x="-66" y="${-205 + i * 148}" width="132" height="124" rx="10" fill="${[c[2], c[1], c[0]][i]}"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="-90" y="${-220 + i * 58}" width="12" height="20" rx="4" fill="${c[0]}" opacity=".45"/><rect x="78" y="${-220 + i * 58}" width="12" height="20" rx="4" fill="${c[0]}" opacity=".45"/>`).join('')}</g>`;
const motifs = { men: [camera, frame], women: [frame, polaroid], couple: [polaroid, frame], family: [frame, filmstrip], birthday: [polaroid, camera], pets: [polaroid, frame], portrait: [filmstrip, camera] };
const extras = (sub, c) => ({
  couple: `<path transform="translate(560 270) scale(1.6)" d="M0 26 C-40 -4 -20 -30 0 -12 C20 -30 40 -4 0 26z" fill="#fb7185"/><path transform="translate(250 700) scale(1)" d="M0 26 C-40 -4 -20 -30 0 -12 C20 -30 40 -4 0 26z" fill="#fff" opacity=".7"/>`,
  birthday: `<g>${[['#fde047', 210, 250], ['#fb7185', 600, 220], ['#67e8f9', 650, 700]].map(([f, x, y]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="42" fill="${f}"/><path d="M${x} ${y + 42} q-10 30 6 60" stroke="#fff" stroke-width="3" fill="none"/>`).join('')}</g>`,
  pets: `<g fill="#fff" opacity=".85"><circle cx="190" cy="760" r="20"/><circle cx="240" cy="725" r="14"/><circle cx="290" cy="760" r="14"/><circle cx="240" cy="800" r="26"/></g>`,
  family: `<g fill="#fff" opacity=".8"><circle cx="190" cy="760" r="20"/><path d="M160 840 q30 -60 60 0z"/><circle cx="610" cy="780" r="26"/><path d="M570 880 q40 -80 80 0z"/></g>`,
}[sub] || '');
function svg(p) {
  const h = hash(p.slug), r = rng(h); const set = PAL[p.subject] || PAL.portrait; const c = set[h % set.length];
  const blobs = Array.from({ length: 5 }, () => `<circle cx="${Math.round(r() * W)}" cy="${Math.round(r() * H)}" r="${Math.round(80 + r() * 200)}" fill="${c[2]}" opacity="${(.08 + r() * .14).toFixed(2)}"/>`).join('');
  const dots = Array.from({ length: 30 }, () => `<circle cx="${Math.round(r() * W)}" cy="${Math.round(r() * H)}" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" opacity="${(.2 + r() * .35).toFixed(2)}"/>`).join('');
  const sp = Array.from({ length: 4 }, () => sparkle(Math.round(60 + r() * 680), Math.round(60 + r() * 880), (.3 + r() * .5).toFixed(2), ['#fde047', '#fff'][Math.floor(r() * 2)], (.5 + r() * .5).toFixed(2))).join('');
  const rings = `<circle cx="${Math.round(100 + r() * 200)}" cy="${Math.round(120 + r() * 300)}" r="${Math.round(60 + r() * 60)}" fill="none" stroke="#fff" stroke-width="6" opacity=".25"/><rect x="${Math.round(520 + r() * 150)}" y="${Math.round(620 + r() * 200)}" width="110" height="110" rx="26" fill="none" stroke="#fff" stroke-width="6" opacity=".22" transform="rotate(${Math.round(r() * 40)} 600 700)"/>`;
  const list = motifs[p.subject] || motifs.portrait; const mf = list[(h >>> 4) % list.length];
  const flip = (h >>> 7) % 2 ? -1 : 1; const sc = (1.0 + ((h >>> 9) % 4) * 0.07).toFixed(2); const rot = ((h >>> 12) % 11) - 5; const dy = ((h >>> 15) % 5) * 12 - 24;
  const main = `<g transform="translate(400 ${480 + dy}) rotate(${rot}) scale(${flip * sc} ${sc})" filter="url(#s)">${mf(c)}</g>`;
  const badges = [`<path d="M0 -26 L8 -8 L28 -6 L12 8 L17 28 L0 17 L-17 28 L-12 8 L-28 -6 L-8 -8z" fill="#fde047"/>`, `<circle r="26" fill="#22c55e"/><path d="M-12 0 l9 10 l17 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, `<circle r="26" fill="#fff" opacity=".92"/><circle r="12" fill="${c[1]}"/>`];
  const bx = [110, 690][(h >>> 17) % 2], by = [130, 870][(h >>> 19) % 2];
  const badge = `<g transform="translate(${bx} ${by}) scale(1.6)">${badges[(h >>> 21) % badges.length]}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".3"/></filter></defs><rect width="${W}" height="${H}" fill="url(#g)"/>${blobs}${rings}${dots}${extras(p.subject, c)}${main}${sp}${badge}</svg>`;
}
let n = 0;
for (const p of items) {
  await sharp(Buffer.from(svg(p))).webp({ quality: 82 }).toFile(path.join('public/photo-covers', p.slug + '.webp'));
  p.image_url = `/photo-covers/${p.slug}.webp`; if (!p.image_alt) p.image_alt = p.title; n++;
}
fs.writeFileSync('content/seed-photo-prompts.json', JSON.stringify(items, null, 2));
console.log('photo covers', n);
