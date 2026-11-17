import Link from 'next/link';
import { Clock, Languages } from 'lucide-react';
import { COURSE_CAT_MAP } from '@/lib/courses-meta';
export default function CourseCard({ c }) {
  const free = /^free/i.test(c.cost);
  return (
    <article className="pz-card pz-pc cp-card">
      <div className="cp-top">
        <span className="cp-av" aria-hidden="true">{(c.provider || c.title || '?').trim().charAt(0).toUpperCase()}</span>
        <div className="cp-id"><h3 className="pz-title"><Link href={`/courses/${c.slug}`} className="pz-stretch">{c.title}</Link></h3><span className="muted small">{c.provider}</span></div>
      </div>
      <p className="pz-sum sk-sum">{c.description}</p>
      <div className="pz-tags"><span className={`cp-cost${free ? ' free' : ''}`}>{c.cost}</span>{COURSE_CAT_MAP[c.category] && <span className="tag ac">{COURSE_CAT_MAP[c.category]}</span>}<span className="tag">{c.level}</span><span className="tag">{c.format}</span></div>
      <div className="pz-meta"><span className="pz-models">{c.duration && <span className="pz-mb"><Clock size={12} aria-hidden="true" /> {c.duration}</span>}</span><span className="pz-cnt"><Languages size={12} aria-hidden="true" /> {c.language}</span></div>
    </article>
  );
}
