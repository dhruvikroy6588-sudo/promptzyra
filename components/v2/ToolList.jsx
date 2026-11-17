import AutoForm from './AutoForm';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { listTools, getCategories, toolCounts } from '@/lib/data';
import { ToolCard } from './Cards';
import Pager from './Pager';
import { PRICING, PAGE_SIZE, icon } from '@/lib/site';

export const TOOL_PLATFORMS = ['Web', 'iOS', 'Android', 'Windows', 'macOS', 'Linux', 'API', 'Browser extension'];
const SORTS = [['featured', 'Featured'], ['latest', 'Newest'], ['name', 'A–Z']];

export default async function ToolList({ category, sp, base, fixedPricing }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = String(sp.q || '').slice(0, 80);
  const pricing = fixedPricing || (PRICING.includes(sp.pricing) ? sp.pricing : '');
  const platform = TOOL_PLATFORMS.includes(sp.platform) ? sp.platform : '';
  const sort = SORTS.some(([k]) => k === sp.sort) ? sp.sort : 'featured';
  const [cats, counts, res] = await Promise.all([getCategories('tool'), toolCounts(), listTools({ category, q, pricing, platform, sort, page })]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const topCats = cats.filter((c) => counts[c.slug]).sort((a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0)).slice(0, 12);
  if (category && !topCats.some((c) => c.slug === category)) { const cur = cats.find((c) => c.slug === category); if (cur) topCats.unshift(cur); }
  const filtered = !!(q || (pricing && !fixedPricing) || platform || sort !== 'featured' || page > 1);
  const clean = { q, pricing: fixedPricing ? '' : pricing, platform, sort: sort !== 'featured' ? sort : '' };
  const href = (over = {}) => { const m = { ...clean, ...over }; const p = new URLSearchParams(); Object.entries(m).forEach(([k, v]) => v && p.set(k, v)); const s = p.toString(); return s ? `${base}?${s}` : base; };
  const pages = Math.max(1, Math.ceil(res.total / PAGE_SIZE));
  const from = res.total ? (page - 1) * PAGE_SIZE + 1 : 0, to = Math.min(res.total, page * PAGE_SIZE);
  return (
    <div className="pzl tl">
      <div>
        <div className="chips tab-row" style={{ justifyContent: 'flex-start', marginBottom: 12 }} role="navigation" aria-label="Tool categories">
          <Link href="/ai-tools" className={`chip${!category ? ' on' : ''}`}>All</Link>
          {topCats.map((c) => <Link key={c.slug} href={`/ai-tools/category/${c.slug}`} className={`chip${category === c.slug ? ' on' : ''}`}>{icon(c.icon)} {c.name}{counts[c.slug] ? <b className="tl-n">{counts[c.slug]}</b> : null}</Link>)}
        </div>
        {!fixedPricing && <div className="chips tab-row tl-price" style={{ justifyContent: 'flex-start', marginBottom: 12 }} role="navigation" aria-label="Pricing filter">
          <Link href={href({ pricing: '', page: '' })} className={`chip${!pricing ? ' on' : ''}`}>Any price</Link>
          {PRICING.map((l) => <Link key={l} href={href({ pricing: l, page: '' })} className={`chip${pricing === l ? ' on' : ''}`}>{l}</Link>)}
        </div>}
        <AutoForm className="toolbar pzl-bar" action={base} role="search">
          <div className="tl-search"><Search size={16} aria-hidden="true" /><input name="q" type="search" defaultValue={q} placeholder="Search AI tools by name or task…" aria-label="Search AI tools" maxLength={80} /></div>
          {!fixedPricing && pricing && <input type="hidden" name="pricing" value={pricing} />}
          <select name="platform" defaultValue={platform} aria-label="Platform"><option value="">Any platform</option>{TOOL_PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
          <select name="sort" defaultValue={sort} aria-label="Sort by">{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <button className="btn btn-primary" type="submit">Apply</button>
          {filtered && <Link className="btn tl-clear" href={base}><X size={14} aria-hidden="true" />Clear</Link>}
        </AutoForm>
        <p className="muted small pzl-count" role="status">{res.total ? <>Showing {from}–{to} of {res.total.toLocaleString('en-US')} {res.total === 1 ? 'tool' : 'tools'}{pages > 1 ? ` · page ${page} of ${pages}` : ''}</> : '0 tools'}</p>
        {res.rows.length ? <div className="pz-grid">{res.rows.map((t) => <ToolCard key={t.slug} t={t} catName={names[t.category]} />)}</div> : <div className="empty">{filtered ? 'No tools match these filters. Try a shorter search or clear the filters.' : 'Tool guides will be added here soon.'}</div>}
        <Pager page={page} total={res.total} pageSize={PAGE_SIZE} base={base} params={clean} />
        <p className="disclose" style={{ marginTop: 24 }}>Pricing types are general guidance and change often — always confirm on the tool’s official site. Listings are chosen editorially; any paid placement or affiliate link will be labelled clearly and never changes how we describe a tool. <Link href="/ai-tools/submit">Submit a tool</Link>.</p>
      </div>
    </div>
  );
}
