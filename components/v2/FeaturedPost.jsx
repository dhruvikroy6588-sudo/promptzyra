import Link from 'next/link';
export default function FeaturedPost({ p }) {
  const img = p.thumbnail || p.image2 || p.image1;
  const date = new Date(p.publish_at || p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <Link href={`/blog/${p.slug}`} className="card spot featured-post" style={{ marginBottom: 24 }}>
      {img ? <img src={img} alt={p.image_alt || `${p.title} cover image`} loading="eager" className="featured-img" /> : <div className="featured-img featured-ph" aria-hidden="true">✍️</div>}
      <div className="featured-body">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className="tag ac">Featured</span>{p.category && <span className="tag">{p.category}</span>}</div>
        <h2 style={{ margin: '8px 0 6px', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>{p.title}</h2>
        <p>{p.excerpt}</p>
        <div className="ft"><span>{p.author || 'Promptzyra Editorial Team'} · {date}</span><span>{p.read_time || '5 min read'} · Read →</span></div>
      </div>
    </Link>
  );
}
