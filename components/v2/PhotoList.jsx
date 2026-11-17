import AutoForm from './AutoForm';
import Link from 'next/link';
import { listPhotoPrompts, getCategories, photoCounts } from '@/lib/data';
import PhotoGrid from './PhotoGrid';
import Pager from './Pager';
import { PHOTO_PAGE_SIZE } from '@/lib/photo';

const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); return p.toString(); };

// fixed: {category, tool, subject} pinned by the landing page (part of the path, not a query filter)
export default async function PhotoList({ sp = {}, base, fixed = {} }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', sort = sp.sort === 'latest' ? 'latest' : 'popular';
  const category = fixed.category || sp.category || '';
  const tool = '', subject = '';
  const [cats, counts, res] = await Promise.all([
    getCategories('photo'), photoCounts(),
    listPhotoPrompts({ category, tool, subject, q, sort, page, pageSize: PHOTO_PAGE_SIZE }),
  ]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const keep = { q, category: fixed.category ? '' : category, tool: fixed.tool ? '' : tool, subject: fixed.subject ? '' : subject, sort: sort !== 'popular' ? sort : '' };
  const href = (over) => { const s = qs({ ...keep, ...over }); return s ? `${base}?${s}` : base; };
  const filtered = !!(q || sort !== 'popular' || (!fixed.tool && tool) || (!fixed.subject && subject) || (!fixed.category && category));
  return (
    <div className="pzl wrap" style={{ paddingTop: 8 }}>
      <div>
        <AutoForm className="toolbar pzl-bar" action={base} role="search">
          <input name="q" defaultValue={q} placeholder="Search photo prompts..." aria-label="Search photo prompts" style={{ flex: 1, minWidth: 180 }} />
          {cats.length > 1 && !fixed.category && <select name="category" defaultValue={category} aria-label="Category"><option value="">All categories</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>}
          <select name="sort" defaultValue={sort} aria-label="Sort"><option value="popular">Popular</option><option value="latest">Latest</option></select>
          <button className="btn btn-primary" type="submit">Apply</button>
        </AutoForm>
        <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'photo prompt' : 'photo prompts'}</p>
        <PhotoGrid rows={res.rows} names={names} emptyText={filtered ? 'No photo prompts match these filters.' : 'New photo prompts will appear here soon.'} />
        <Pager page={page} total={res.total} pageSize={PHOTO_PAGE_SIZE} base={base} params={keep} />
      </div>
    </div>
  );
}
