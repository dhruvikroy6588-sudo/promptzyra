import Link from 'next/link';
import { listTools, getCategories, toolCounts } from '@/lib/data';
import { ToolCard } from './Cards';
import Pager from './Pager';
import { PRICING, PAGE_SIZE, icon } from '@/lib/site';
export default async function ToolList({ category, sp, base, fixedPricing }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', pricing = fixedPricing || sp.pricing || '', sort = sp.sort || 'featured';
  const [cats, counts, res] = await Promise.all([getCategories('tool'), toolCounts(), listTools({ category, q, pricing, sort, page })]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const filtered = !!(q || (pricing && !fixedPricing) || sort !== 'featured' || page > 1);
  return (
    <div className="pzl">
      <div>
        <div className="chips tab-row" style={{ justifyContent: 'flex-start', marginBottom: 14 }} role="tablist" aria-label="Tool categories">
          <Link href="/ai-tools" className={`chip${!category ? ' on' : ''}`}>All</Link>
          {cats.filter((c) => counts[c.slug]).slice(0, 12).map((c) => <Link key={c.slug} href={`/ai-tools/category/${c.slug}`} className={`chip${category === c.slug ? ' on' : ''}`}>{icon(c.icon)} {c.name}</Link>)}
        </div>
        <form className="toolbar pzl-bar" action={base} role="search">
          <input name="q" defaultValue={q} placeholder="Search AI tools…" aria-label="Search AI tools" style={{ flex: 1, minWidth: 180 }} />
          {!fixedPricing && <select name="pricing" defaultValue={pricing} aria-label="Pricing"><option value="">Any pricing</option>{PRICING.map((l) => <option key={l}>{l}</option>)}</select>}
          <select name="sort" defaultValue={sort} aria-label="Sort"><option value="featured">Featured</option><option value="name">A–Z</option><option value="latest">Latest</option></select>
          <button className="btn btn-primary" type="submit">Apply</button>
        </form>
        <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'tool' : 'tools'}</p>
        {res.rows.length ? <div className="pz-grid">{res.rows.map((t) => <ToolCard key={t.slug} t={t} catName={names[t.category]} />)}</div> : <div className="empty">{filtered ? 'No tools match these filters.' : 'Tool guides are being reviewed and will appear here soon.'}</div>}
        <Pager page={page} total={res.total} pageSize={PAGE_SIZE} base={base} params={{ q, pricing: fixedPricing ? '' : pricing, sort: sort !== 'featured' ? sort : '' }} />
        <p className="disclose" style={{ marginTop: 24 }}>Pricing types are general guidance and change often — always confirm on the tool’s official site. Some links may become affiliate links in future; we will label them clearly and never let that change a rating.</p>
      </div>
    </div>
  );
}
