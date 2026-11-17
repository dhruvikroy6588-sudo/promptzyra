import Link from 'next/link';
import { Copy, Files, ArrowUpRight, Flame } from 'lucide-react';
import SkillSave from './SkillSave';

// s: row from listSkills/relatedSkills ({ slug, name, description, category, level, files, copy_count, featured })
export default function SkillCard({ s, catName }) {
  const href = `/skills/${s.slug}`;
  const files = s.files || 1;
  return (
    <article className="pz-card pz-pc sk-card">
      <div className="pz-tags">
        {catName && <span className="tag ac">{catName}</span>}
        {s.level && <span className="tag">{s.level}</span>}
        {s.featured && <span className="pz-pop"><Flame size={12} aria-hidden="true" />Featured</span>}
      </div>
      <h3 className="pz-title"><Link href={href} className="pz-stretch">{s.name}</Link></h3>
      <p className="pz-sum sk-sum">{s.description}</p>
      <div className="pz-meta">
        <span className="pz-models"><span className="pz-mb"><Files size={12} aria-hidden="true" /> {files} {files === 1 ? 'file' : 'files'}</span></span>
        <span className="pz-cnt">{s.copy_count > 0 ? <><Copy size={13} aria-hidden="true" />{s.copy_count} {s.copy_count === 1 ? 'copy' : 'copies'}</> : <>View<ArrowUpRight size={14} aria-hidden="true" /></>}</span>
      </div>
      <div className="pz-fav"><SkillSave slug={s.slug} /></div>
    </article>
  );
}
