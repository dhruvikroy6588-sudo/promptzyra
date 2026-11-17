import Link from 'next/link';
import { listSkills, getCategories, skillCounts } from '@/lib/data';
import SkillCard from './SkillCard';
import Pager from './Pager';
import { SKILL_AUDIENCES, SKILL_LEVELS } from '@/lib/skill-md';

const PAGE = 24;
const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); return p.toString(); };

// category: pinned category slug (category pages). sp: searchParams. base: path for form + pager.
export default async function SkillList({ category, sp = {}, base = '/skills' }) {
  const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', level = sp.level || '', audience = sp.audience || '', sort = sp.sort || 'popular';
  const [cats, counts, res] = await Promise.all([getCategories('skill'), skillCounts(), listSkills({ category, q, level, audience, sort, page, pageSize: PAGE })]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const filtered = !!(q || level || audience || sort !== 'popular');
  const keep = { q, level, audience, sort: sort !== 'popular' ? sort : '' };
  return (
    <div className="wrap sk-list">
      <div className="chips sk-chips" aria-label="Skill categories">
        <Link className={`chip${!category ? ' on' : ''}`} href="/skills">All <b>{counts.__total || 0}</b></Link>
        {cats.map((c) => <Link key={c.slug} className={`chip${category === c.slug ? ' on' : ''}`} href={`/skills/category/${c.slug}`}>{c.name} <b>{counts[c.slug] || 0}</b></Link>)}
      </div>
      <form className="toolbar pzl-bar" action={base} role="search">
        <input name="q" defaultValue={q} placeholder="Search skills…" aria-label="Search skills" style={{ flex: 1, minWidth: 180 }} />
        <select name="level" defaultValue={level} aria-label="Level"><option value="">Any level</option>{SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        <select name="audience" defaultValue={audience} aria-label="Audience"><option value="">Any audience</option>{SKILL_AUDIENCES.map((a) => <option key={a}>{a}</option>)}</select>
        <select name="sort" defaultValue={sort} aria-label="Sort"><option value="popular">Popular</option><option value="latest">Latest</option><option value="copied">Most copied</option><option value="name">A–Z</option></select>
        <button className="btn btn-primary" type="submit">Apply</button>
        {filtered && <Link className="btn" href={base} rel="nofollow">Clear</Link>}
      </form>
      <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'skill' : 'skills'}</p>
      {res.rows.length
        ? <div className="pz-grid">{res.rows.map((s) => <SkillCard key={s.slug} s={s} catName={names[s.category]} />)}</div>
        : <div className="empty">{filtered ? 'No skills match these filters.' : 'New skills are being reviewed and will appear here soon.'}</div>}
      <Pager page={page} total={res.total} pageSize={PAGE} base={base} params={keep} />
    </div>
  );
}
