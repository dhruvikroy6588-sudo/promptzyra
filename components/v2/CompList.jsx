import Link from 'next/link';
import { listComponents } from '@/lib/data';
import { COMPONENT_CATS } from '@/lib/components-meta';
import CompCard from './CompCard';
import Pager from './Pager';

const PAGE = 24;
export default async function CompList({ type, meta, sp = {} }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', sort = sp.sort || 'popular', category = sp.category || '';
  const res = await listComponents({ type, category, q, sort, page, pageSize: PAGE });
  const filtered = !!(q || category || sort !== 'popular');
  return (
    <div className="wrap sk-list">
      <form className="toolbar pzl-bar" action={meta.path} role="search">
        <input name="q" defaultValue={q} placeholder={`Search ${meta.label.toLowerCase()} by name, author or tag…`} aria-label={`Search ${meta.label}`} style={{ flex: 1, minWidth: 180 }} />
        <select name="category" defaultValue={category} aria-label="Category"><option value="">All categories</option>{COMPONENT_CATS.map(([s, n]) => <option key={s} value={s}>{n}</option>)}</select>
        <select name="sort" defaultValue={sort} aria-label="Sort"><option value="popular">Popular</option><option value="stars">Stars</option><option value="latest">Latest</option><option value="name">A–Z</option></select>
        <button className="btn btn-primary" type="submit">Apply</button>
        {filtered && <Link className="btn" href={meta.path} rel="nofollow">Clear</Link>}
      </form>
      <p className="muted small pzl-count">{res.total} {res.total === 1 ? meta.single.toLowerCase() : meta.label.toLowerCase()}</p>
      {res.rows.length ? <div className="pz-grid">{res.rows.map((c) => <CompCard key={c.slug} c={c} base={meta.path} />)}</div>
        : <div className="empty">{filtered ? 'Nothing matches these filters.' : `New ${meta.label.toLowerCase()} are being reviewed and will appear here soon.`}</div>}
      <Pager page={page} total={res.total} pageSize={PAGE} base={meta.path} params={{ q, category, sort: sort !== 'popular' ? sort : '' }} />
    </div>
  );
}
