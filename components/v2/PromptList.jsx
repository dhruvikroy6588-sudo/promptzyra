import AutoForm from './AutoForm';
import Link from 'next/link';
import { listPrompts, getCategories, promptAudiences, promptSubcategories } from '@/lib/data';
import { PromptCard } from './Cards';
import Pager from './Pager';
import { MODELS, LEVELS, PAGE_SIZE } from '@/lib/site';

const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); const s = p.toString(); return s; };

// fixed: {model, audience, category} pinned by the landing page (rendered as part of the path, not as filters)
export default async function PromptList({ category, sp = {}, base, fixed = {} }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', level = sp.level || '', sort = sp.sort || 'popular';
  const model = fixed.model || sp.model || '';
  const audience = fixed.audience || sp.audience || '';
  const type = sp.type === 'image' || sp.type === 'text' ? sp.type : '';
  const sub = sp.sub || '';
  const [cats, res, auds, subs] = await Promise.all([
    getCategories('prompt'),
    listPrompts({ category, q, model, level, sort, page, type, audience, sub }),
    promptAudiences(),
    category ? promptSubcategories(category) : Promise.resolve([]),
  ]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const userFiltered = !!(q || level || sort !== 'popular' || type || sub || (!fixed.model && sp.model) || (!fixed.audience && sp.audience));
  const showSections = !userFiltered && page === 1 && !fixed.model && !fixed.audience && res.rows.length >= 6;
  // Popular section = first 3 by copy/featured rank; New section = 3 most recent (only on the unfiltered first page)
  let popular = [], fresh = [];
  if (showSections) {
    popular = res.rows.slice(0, 3);
    const latest = await listPrompts({ category, sort: 'latest', pageSize: 3 });
    fresh = latest.rows;
  }
  const keep = { q, model: fixed.model ? '' : model, audience: fixed.audience ? '' : audience, level, sort: sort !== 'popular' ? sort : '', sub };
  const tab = (t, label) => <Link key={t || 'all'} role="tab" aria-selected={type === t} className={`chip${type === t ? ' on' : ''}`} href={`${base}${qs({ ...keep, type: t }) ? '?' + qs({ ...keep, type: t }) : ''}`} rel="nofollow">{label}</Link>;
  return (
    <div className="pzl">
      <div>
        <div className="chips tab-row pl-tabs" role="tablist" aria-label="Prompt type">{tab('', 'All')}{tab('text', 'Text prompts')}{tab('image', 'Image prompts')}</div>
        {subs.length > 0 && <div className="chips pl-subs" aria-label="Subcategories"><Link className={`chip${!sub ? ' on' : ''}`} href={`${base}${qs({ ...keep, sub: '', type }) ? '?' + qs({ ...keep, sub: '', type }) : ''}`} rel="nofollow">All</Link>{subs.map((s) => <Link key={s.name} rel="nofollow" className={`chip${sub === s.name ? ' on' : ''}`} href={`${base}?${qs({ ...keep, sub: s.name, type })}`}>{s.name} <b>{s.n}</b></Link>)}</div>}
        <AutoForm className="toolbar pzl-bar" action={base} role="search">
          <input name="q" defaultValue={q} placeholder="Search prompts…" aria-label="Search prompts" style={{ flex: 1, minWidth: 180 }} />
          {type && <input type="hidden" name="type" value={type} />}
          {sub && <input type="hidden" name="sub" value={sub} />}
          {!fixed.model && <select name="model" defaultValue={model} aria-label="AI model"><option value="">Any model</option>{MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>}
          {!fixed.audience && <select name="audience" defaultValue={audience} aria-label="Audience"><option value="">Any audience</option>{auds.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}</select>}
          <select name="level" defaultValue={level} aria-label="Level"><option value="">Any level</option>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
          <select name="sort" defaultValue={sort} aria-label="Sort"><option value="popular">Popular</option><option value="latest">Latest</option><option value="title">A–Z</option></select>
          <button className="btn btn-primary" type="submit">Apply</button>
        </AutoForm>
        <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'prompt' : 'prompts'}</p>
        {showSections && <>
          <h2 className="pl-h">Popular right now</h2>
          <div className="pz-grid">{popular.map((p) => <PromptCard key={p.slug} p={p} catName={names[p.category]} />)}</div>
          {fresh.length > 0 && <><h2 className="pl-h">New this week</h2><div className="pz-grid">{fresh.map((p) => <PromptCard key={p.slug} p={p} catName={names[p.category]} />)}</div></>}
          <h2 className="pl-h">All prompts</h2>
        </>}
        {res.rows.length ? <div className="pz-grid">{(showSections ? res.rows : res.rows).map((p) => <PromptCard key={p.slug} p={p} catName={names[p.category]} />)}</div> : <div className="empty">{userFiltered ? 'No prompts match these filters.' : 'New prompts will be added here soon.'}</div>}
        <Pager page={page} total={res.total} pageSize={PAGE_SIZE} base={base} params={{ q, model: fixed.model ? '' : model, audience: fixed.audience ? '' : audience, level, type, sub, sort: sort !== 'popular' ? sort : '' }} />
      </div>
    </div>
  );
}
