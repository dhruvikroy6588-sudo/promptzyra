import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { listSkills, getCategories } from '@/lib/data';
import SkillCard from './SkillCard';

// Home page strip: 6 latest skills. Renders nothing when there are none (or the table is missing).
export default async function SkillsStrip() {
  const [res, cats] = await Promise.all([listSkills({ pageSize: 6, sort: 'latest' }), getCategories('skill')]);
  if (!res.rows.length) return null;
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  return (
    <section className="pzh-sec" aria-labelledby="h-skills">
      <div className="pzh-sh"><div><h2 id="h-skills">Skills for learning</h2><p>Downloadable SKILL.md packages that teach your AI assistant how to help with studying, teaching and writing.</p></div><Link className="pzh-more" href="/skills">All skills <ArrowRight size={15} aria-hidden="true" /></Link></div>
      <div className="pz-grid">{res.rows.map((s) => <SkillCard key={s.slug} s={s} catName={names[s.category]} />)}</div>
    </section>
  );
}
