import Link from 'next/link';
import { listPhotoPrompts, getCategories, photoCounts } from '@/lib/data';
import PhotoGrid from './PhotoGrid';
import Pager from './Pager';
import { PHOTO_TOOLS, PHOTO_SUBJECTS, PHOTO_PAGE_SIZE } from '@/lib/photo';

const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); return p.toString(); };
const VALID_TOOLS = PHOTO_TOOLS.map((t) => t.id);
const VALID_SUBJECTS = PHOTO_SUBJECTS.map((s) => s.id);

// fixed: {category, tool, subject} pinned by the landing page (part of the path, not a query filter)
export default async function PhotoList({ sp = {}, base, fixed = {} }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', sort = sp.sort === 'latest' ? 'latest' : 'popular';
  const category = fixed.category || sp.category || '';
  const tool = fixed.tool || (VALID_TOOLS.includes(sp.tool) ? sp.tool : '');
  const subject = fixed.subject || (VALID_SUBJECTS.includes(sp.subject) ? sp.subject : '');
  const [cats, counts, res] = await Promise.all([
    getCategories('photo'), photoCounts(),
    listPhotoPrompts({ category, tool, subject, q, sort, page, pageSize: PHOTO_PAGE_SIZE }),
  ]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const keep = { q, category: fixed.category ? '' : category, tool: fixed.tool ? '' : tool, subject: fixed.subject ? '' : subject, sort: sort !== 'popular' ? sort : '' };
  const href = (over) => { const s = qs({ ...keep, ...over }); return s ? `${base}?${s}` : base; };
  const filtered = !!(q || sort !== 'popular' || (!fixed.tool && tool) || (!fixed.subject && subject) || (!fixed.category && category));
  return (
    <div className="pzl">
      <div>
        <div className="chips tab-row pl-tabs" role="tablist" aria-label="AI tool">
          {!fixed.tool && <>
            <Link role="tab" aria-selected={!tool} className={`chip${!tool ? ' on' : ''}`} href={href({ tool: '' })} rel="nofollow">All tools</Link>
            {PHOTO_TOOLS.map((t) => <Link key={t.id} role="tab" aria-selected={tool === t.id} className={`chip${tool === t.id ? ' on' : ''}`} href={href({ tool: t.id })} rel="nofollow">{t.label}</Link>)}
          </>}
        </div>
        {!fixed.subject && <div className="chips pl-subs" aria-label="Subject">
          <Link className={`chip${!subject ? ' on' : ''}`} href={href({ subject: '' })} rel="nofollow">Everyone</Link>
          {PHOTO_SUBJECTS.map((s) => <Link key={s.id} rel="nofollow" className={`chip${subject === s.id ? ' on' : ''}`} href={href({ subject: s.id })}>{s.label}</Link>)}
        </div>}
        {!fixed.category && cats.length > 1 && <div className="chips pl-subs" aria-label="Category">
          <Link className={`chip${!category ? ' on' : ''}`} href={href({ category: '' })} rel="nofollow">All categories <b>{counts.__total || 0}</b></Link>
          {cats.map((c) => <Link key={c.slug} rel="nofollow" className={`chip${category === c.slug ? ' on' : ''}`} href={href({ category: c.slug })}>{c.name} <b>{counts[c.slug] || 0}</b></Link>)}
        </div>}
        <form className="toolbar pzl-bar" action={base} role="search">
          <input name="q" defaultValue={q} placeholder="Search photo prompts..." aria-label="Search photo prompts" style={{ flex: 1, minWidth: 180 }} />
          {!fixed.tool && tool && <input type="hidden" name="tool" value={tool} />}
          {!fixed.subject && subject && <input type="hidden" name="subject" value={subject} />}
          {!fixed.category && category && <input type="hidden" name="category" value={category} />}
          <select name="sort" defaultValue={sort} aria-label="Sort"><option value="popular">Popular</option><option value="latest">Latest</option></select>
          <button className="btn btn-primary" type="submit">Apply</button>
        </form>
        <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'photo prompt' : 'photo prompts'}</p>
        <PhotoGrid rows={res.rows} names={names} emptyText={filtered ? 'No photo prompts match these filters.' : 'New photo prompts are being reviewed and will appear here soon.'} />
        <Pager page={page} total={res.total} pageSize={PHOTO_PAGE_SIZE} base={base} params={keep} />
      </div>
    </div>
  );
}
