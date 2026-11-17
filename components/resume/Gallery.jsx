import Link from 'next/link';
export default function Gallery({ list }) {
  return <div className="grid g4 rs-gal">{list.map((t) => (
    <Link key={t.id} href={`/resume-builder/editor?template=${t.id}`} className="card spot" style={{ padding: 10 }}>
      <img className="rs-thumb" src={`/resume-thumbs/${t.id}.webp`} alt={`${t.name} resume template preview`} loading="lazy" width="210" height="297" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>{t.name}</b><span className="tag">{t.layout.replace('side-l', 'sidebar').replace('side-r', 'sidebar').replace('grid2', '2-column').replace('two', '2-column')}</span></div>
      <span className="btn btn-sm btn-primary" style={{ justifyContent: 'center' }}>Use this template</span>
    </Link>))}</div>;
}
