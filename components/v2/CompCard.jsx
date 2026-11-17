import Link from 'next/link';
import { Star, Files, ExternalLink } from 'lucide-react';
import { COMPONENT_CAT_MAP } from '@/lib/components-meta';

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
export default function CompCard({ c, base }) {
  const href = `${base}/${c.slug}`;
  const tags = (c.tags || []).slice(0, 3);
  return (
    <article className="pz-card pz-pc cp-card">
      <div className="cp-top">
        <span className="cp-av" aria-hidden="true">{(c.name || '?').trim().charAt(0).toUpperCase()}</span>
        <div className="cp-id"><h3 className="pz-title"><Link href={href} className="pz-stretch">{c.name}</Link></h3><span className="muted small">by {c.author || 'Promptzyra'}</span></div>
        {c.stars > 0 && <span className="cp-stars"><Star size={12} fill="currentColor" aria-hidden="true" />{fmt(c.stars)}</span>}
      </div>
      <p className="pz-sum sk-sum">{c.description}</p>
      <div className="pz-tags">{COMPONENT_CAT_MAP[c.category] && <span className="tag ac">{COMPONENT_CAT_MAP[c.category]}</span>}{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      <div className="pz-meta"><span className="pz-models"><span className="pz-mb"><Files size={12} aria-hidden="true" /> {c.files || 0} {c.files === 1 ? 'file' : 'files'}</span></span>{c.github_url && <span className="pz-cnt">GitHub<ExternalLink size={12} aria-hidden="true" /></span>}</div>
    </article>
  );
}
