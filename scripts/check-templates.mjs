import { TEMPLATES } from '../lib/resume/templates.js';
const sig = (t) => [t.layout, t.header, t.tone, t.heading, t.bullet, t.date, t.skill, t.font, t.palette].join('|');
const seen = new Map(); let dup = 0;
for (const t of TEMPLATES) { const s = sig(t); if (seen.has(s)) { dup++; console.log('DUP', t.id, seen.get(s)); } else seen.set(s, t.id); }
console.log('templates', TEMPLATES.length, 'unique', seen.size, 'dups', dup);
const vis = new Set(TEMPLATES.map((t) => [t.layout, t.header, t.tone, t.heading, t.font, t.palette].join('|')));
console.log('unique on look-defining axes (layout,header,tone,heading,font,palette):', vis.size);
