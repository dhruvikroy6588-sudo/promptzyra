// Tiny safe markdown → HTML. All input is escaped first; only a fixed set of tags is produced.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (m, t, u) => `<a href="${u}"${u.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t}</a>`);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function renderMarkdown(src = '') {
  const lines = String(src).replace(/\r/g, '').split('\n');
  const out = []; const toc = []; let list = null; let para = []; let code = null;
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of lines) {
    if (raw.startsWith('```')) { if (code) { out.push(`<pre class="pre">${esc(code.join('\n'))}</pre>`); code = null; } else { flushP(); flushL(); code = []; } continue; }
    if (code) { code.push(raw); continue; }
    const l = raw.trimEnd(); let m;
    if (!l.trim()) { flushP(); flushL(); continue; }
    if ((m = l.match(/^(#{1,3})\s+(.*)$/))) { flushP(); flushL(); const lv = Math.max(2, m[1].length); const id = slug(m[2]); if (lv === 2) toc.push({ id, text: m[2] }); out.push(`<h${lv} id="${id}">${inline(m[2])}</h${lv}>`); continue; }
    if ((m = l.match(/^[-*]\s+(.*)$/))) { flushP(); if (list !== 'ul') { flushL(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { flushP(); if (list !== 'ol') { flushL(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = l.match(/^>\s?(.*)$/))) { flushP(); flushL(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if (/^---+$/.test(l)) { flushP(); flushL(); out.push('<hr />'); continue; }
    flushL(); para.push(l.trim());
  }
  flushP(); flushL(); if (code) out.push(`<pre class="pre">${esc(code.join('\n'))}</pre>`);
  return { html: out.join('\n'), toc };
}
