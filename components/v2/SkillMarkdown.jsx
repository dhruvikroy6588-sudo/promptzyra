import { splitFrontmatter, makeIdGen } from '@/lib/skill-md';
// Tiny safe markdown renderer: headings, lists, code fences, quotes, tables, bold/italic/code/links. Everything is rendered as React text (escaped); only http(s), mailto and #anchor links are allowed.
const SAFE_HREF = /^(https?:\/\/|mailto:|#|\/(?!\/))/i;
const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*|__[^_\n]+__)|(\[[^\]\n]+\]\([^)\s]+\))|(\*[^*\s][^*\n]*\*|_[^_\s][^_\n]*_)/g;

function inline(text, k = 'i') {
  const out = []; let last = 0; let n = 0; const s = String(text || '');
  for (const m of s.matchAll(INLINE)) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0]; const key = `${k}-${n++}`;
    if (m[1]) out.push(<code key={key}>{t.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key}>{inline(t.slice(2, -2), key)}</strong>);
    else if (m[3]) {
      const lm = t.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (lm && SAFE_HREF.test(lm[2])) out.push(<a key={key} href={lm[2]} {...(lm[2][0] === '#' ? {} : { target: '_blank', rel: 'noopener noreferrer nofollow' })}>{inline(lm[1], key)}</a>);
      else out.push(lm ? lm[1] : t);
    } else out.push(<em key={key}>{inline(t.slice(1, -1), key)}</em>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

const splitRow = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const isSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes('-');

export default function SkillMarkdown({ md, idPrefix = '' }) {
  const { meta, body } = splitFrontmatter(md);
  const lines = body.split(/\r?\n/); const gen = makeIdGen(idPrefix); const blocks = []; let i = 0; let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*(```|~~~)\s*([\w+-]*)/);
    if (fence) {
      const buf = []; i++;
      while (i < lines.length && !new RegExp(`^\\s*${fence[1]}`).test(lines[i])) { buf.push(lines[i]); i++; }
      i++; blocks.push(<pre key={key++} className="sk-codeblock"><code>{buf.join('\n')}</code></pre>); continue;
    }
    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) { const L = h[1].length; const Tag = `h${L}`; blocks.push(<Tag key={key++} id={gen(h[2])}>{inline(h[2], `h${key}`)}</Tag>); i++; continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { blocks.push(<hr key={key++} />); i++; continue; }
    if (/^\s*>/.test(line)) { const buf = []; while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; } blocks.push(<blockquote key={key++}>{inline(buf.join(' '), `q${key}`)}</blockquote>); continue; }
    if (line.includes('|') && i + 1 < lines.length && isSep(lines[i + 1])) {
      const head = splitRow(line); i += 2; const rows = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) { rows.push(splitRow(lines[i])); i++; }
      blocks.push(<div key={key++} className="sk-tablewrap"><table><thead><tr>{head.map((c, j) => <th key={j}>{inline(c, `th${j}`)}</th>)}</tr></thead><tbody>{rows.map((r, a) => <tr key={a}>{head.map((_, j) => <td key={j}>{inline(r[j] || '', `td${a}-${j}`)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    const ul = line.match(/^(\s*)[-*+]\s+/); const ol = line.match(/^(\s*)\d+[.)]\s+/);
    if (ul || ol) {
      const ordered = !!ol; const items = []; const re = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/;
      while (i < lines.length) {
        const m = lines[i].match(re);
        if (m) { items.push(m[1]); i++; }
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) { items[items.length - 1] += ` ${lines[i].trim()}`; i++; }
        else break;
      }
      const Tag = ordered ? 'ol' : 'ul'; blocks.push(<Tag key={key++}>{items.map((t, a) => <li key={a}>{inline(t, `li${key}-${a}`)}</li>)}</Tag>); continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(```|~~~|#{1,6}\s|>|[-*+]\s|\d+[.)]\s)/.test(lines[i]) && !(lines[i].includes('|') && lines[i + 1] && isSep(lines[i + 1]))) { buf.push(lines[i].trim()); i++; }
    if (!buf.length) { buf.push(lines[i].trim()); i++; }
    blocks.push(<p key={key++}>{inline(buf.join(' '), `p${key}`)}</p>);
  }
  return (<div className="sk-md">
    {meta.length > 0 && <dl className="sk-front">{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
    {blocks}
  </div>);
}
