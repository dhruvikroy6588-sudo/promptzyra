// Pure helpers for skills (safe on server and client).
export const SKILL_AUDIENCES = ['Anyone', 'Students', 'Teachers', 'Job seekers', 'Professionals', 'Developers'];
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const byteLen = (s) => new TextEncoder().encode(String(s || '')).length;
export const lineCount = (s) => { const t = String(s || ''); if (!t) return 0; const n = t.split('\n').length; return t.endsWith('\n') ? n - 1 : n; };
export const kbLabel = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

// The files a skill package contains (SKILL.md always; references/guide.md only when present).
export function skillFiles(skill) {
  const files = [{ path: 'SKILL.md', text: String(skill?.skill_md || '') }];
  if (String(skill?.references_md || '').trim()) files.push({ path: 'references/guide.md', text: String(skill.references_md) });
  return files.map((f) => ({ ...f, lines: lineCount(f.text), bytes: byteLen(f.text) }));
}

// Removes a leading ---frontmatter--- block. Returns { meta: [[key, value]], body }.
export function splitFrontmatter(md) {
  const t = String(md || '').replace(/^﻿/, '');
  const m = t.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!m) return { meta: [], body: t };
  const meta = [];
  m[1].split(/\r?\n/).forEach((line) => { const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/); if (kv) meta.push([kv[1], kv[2].replace(/^["']|["']$/g, '')]); });
  return { meta, body: t.slice(m[0].length) };
}

export const plainInline = (s) => String(s || '').replace(/`([^`]*)`/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2').trim();
export function makeIdGen(prefix = '') {
  const seen = {};
  return (text) => {
    const base = plainInline(text).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
    seen[base] = (seen[base] || 0) + 1;
    return `${prefix}${base}${seen[base] > 1 ? `-${seen[base]}` : ''}`;
  };
}
// Headings (levels 1-3) outside code fences, with ids matching the Preview renderer.
export function headingsOf(md, prefix = '') {
  const { body } = splitFrontmatter(md); const gen = makeIdGen(prefix); const out = []; let fence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (m) { const id = gen(m[2]); if (m[1].length <= 3) out.push({ level: m[1].length, text: plainInline(m[2]), id }); }
  }
  return out;
}
// Safe folder name for the zip (the skill slug).
export const safeFolder = (slug) => String(slug || 'skill').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'skill';
