import Link from 'next/link';
import { Flame, Copy, ArrowUpRight } from 'lucide-react';
import { modelLabel, icon } from '@/lib/site';
import FavButton from './FavButton';
import ToolLogo from './ToolLogo';

const dateFmt = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };

export function PromptCard({ p, catName }) {
  const popular = p.featured || p.copy_count >= 25;
  const href = `/prompts/${p.slug}`;
  const models = (p.models || []).slice(0, 3);
  return (
    <article className="pz-card pz-pc">
      {p.type === 'image' && p.example_image_url && <div className="pz-thumb"><img src={p.example_image_url} alt={`Example result for ${p.title}`} loading="lazy" /></div>}
      <div className="pz-tags">
        {catName && <span className="tag ac">{catName}</span>}
        {p.type === 'image' && <span className="tag">Image prompt</span>}
        {p.level && <span className="tag">{p.level}</span>}
        {popular && <span className="pz-pop"><Flame size={12} aria-hidden="true" />Popular</span>}
      </div>
      <h3 className="pz-title"><Link href={href} className="pz-stretch">{p.title}</Link></h3>
      <p className="pz-sum">{p.summary}</p>
      <div className="pz-meta">
        <span className="pz-models">{models.map((m) => <span key={m} className="pz-mb">{modelLabel(m)}</span>)}</span>
        <span className="pz-cnt">{p.copy_count > 0 ? <><Copy size={13} aria-hidden="true" />{p.copy_count} {p.copy_count === 1 ? 'copy' : 'copies'}</> : <>View<ArrowUpRight size={14} aria-hidden="true" /></>}</span>
      </div>
      <div className="pz-fav"><FavButton kind="prompt" slug={p.slug} /></div>
    </article>
  );
}

export function ToolCard({ t, catName }) {
  const href = `/ai-tools/${t.slug}`;
  return (
    <article className="pz-card pz-tc">
      <div className="pz-tool-top">
        <ToolLogo tool={t} size={44} />
        <div className="pz-tool-id">
          <h3 className="pz-title"><Link href={href} className="pz-stretch">{t.name}</Link></h3>
          <div className="pz-tags">{t.pricing && <span className="tag ac">{t.pricing}</span>}{t.featured && <span className="pz-pop"><Flame size={12} aria-hidden="true" />Popular</span>}</div>
        </div>
      </div>
      <p className="pz-sum">{t.tagline}</p>
      <div className="pz-meta">
        <span className="pz-models"><span className="pz-mb">{catName || t.category}</span></span>
        <span className="pz-cnt">{t.best_for ? t.best_for.slice(0, 30) : <>Read guide<ArrowUpRight size={14} aria-hidden="true" /></>}</span>
      </div>
      <div className="pz-fav"><FavButton kind="tool" slug={t.slug} /></div>
    </article>
  );
}

export function CatCard({ c, href, n }) {
  return (
    <Link href={href} className="pz-card pz-cat">
      <div className="pz-cat-ic" aria-hidden="true">{icon(c.icon)}</div>
      <h3 className="pz-title">{c.name}</h3>
      <p className="pz-sum">{c.description}</p>
      <div className="pz-meta"><span className="pz-cnt">{n ? `${n} ${n === 1 ? 'item' : 'items'}` : 'Coming soon'}</span><span className="pz-cnt" aria-hidden="true"><ArrowUpRight size={15} /></span></div>
    </Link>
  );
}

export function PostCard({ p }) {
  const img = p.thumbnail || p.image2 || p.image1;
  const date = dateFmt(p.publish_at || p.created_at);
  return (
    <article className="pz-card pz-post">
      {img && <div className="pz-thumb"><img src={img} alt={p.image_alt || `${p.title} cover image`} loading="lazy" /></div>}
      <div className="pz-tags">{p.category && <span className="tag ac">{p.category}</span>}</div>
      <h3 className="pz-title"><Link href={`/blog/${p.slug}`} className="pz-stretch">{p.title}</Link></h3>
      <p className="pz-sum">{p.excerpt}</p>
      <div className="pz-meta"><span className="pz-cnt">{p.author || 'Promptzyra Team'}{date ? ` · ${date}` : ''}</span><span className="pz-cnt">{p.read_time || '5 min read'}</span></div>
    </article>
  );
}
