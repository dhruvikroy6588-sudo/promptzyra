import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { getCourse, relatedCourses } from '@/lib/data';
import { abs } from '@/lib/site';
import { COURSE_CAT_MAP } from '@/lib/courses-meta';
import CourseLink from '@/components/v2/CourseLink';
import CourseCard from '@/components/v2/CourseCard';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params; const c = await getCourse(slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: c.seo_title || `${c.title} (${c.cost}): ${c.provider}`, description: c.seo_description || c.description, path: `/courses/${slug}`, type: 'article', image: c.og_image || undefined, modifiedTime: c.updated_at });
}
export default async function Page({ params }) {
  const { slug } = await params; const c = await getCourse(slug); if (!c) notFound();
  const related = await relatedCourses(c, 3);
  const learn = (c.what_you_learn || []).filter(Boolean);
  const faq = [
    { q: `Is ${c.title} free?`, a: `Listed cost: ${c.cost}. Prices and offers change, so confirm on the provider's page before you enrol.` },
    { q: 'Who is this course for?', a: c.who_for || `Learners at the ${c.level.toLowerCase()} level who want to understand ${COURSE_CAT_MAP[c.category]?.toLowerCase() || 'AI'}.` },
    { q: 'Where does the course open?', a: `It opens on the provider's own site (${c.provider}) in a new tab. Promptzyra does not host or run the course.` },
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'Course', name: c.title, description: c.description, url: abs(`/courses/${slug}`), provider: { '@type': 'Organization', name: c.provider }, inLanguage: c.language, educationalLevel: c.level, ...(c.url ? { sameAs: c.url } : {}) };
  return (
    <div className="wrap sk-detail" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/courses">courses</Link>/<span>{c.title}</span></nav>
      <header className="sk-head"><div><h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.3rem)', margin: 0 }}>{c.title} <span className="sk-badge">{c.cost}</span></h1><p className="muted" style={{ margin: '6px 0 0' }}>by {c.provider}</p></div></header>
      <div className="sk-grid">
        <div className="sk-main sk-overview">
          <section><h2 className="sk-h2">About this course</h2><p>{c.description}</p></section>
          {learn.length > 0 && <section><h2 className="sk-h2">What you will learn</h2><ul>{learn.map((u, i) => <li key={i}>{u}</li>)}</ul></section>}
          {c.who_for && <section><h2 className="sk-h2">Who it is for</h2><p>{c.who_for}</p></section>}
          <section><h2 className="sk-h2">FAQ</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: '8px 0 0' }}>{f.a}</p></details>)}</section>
          <p className="disclose">Course details are checked by hand but can change. Always confirm price, content and availability on the provider's page. {c.last_checked && c.last_checked !== 'unverified' ? `Last checked ${c.last_checked}.` : ''}</p>
        </div>
        <aside className="sk-side">
          <section className="panel sk-install"><h2 className="sk-h2">Start learning</h2><CourseLink slug={c.slug} url={c.url} /><p className="muted small" style={{ margin: '10px 0 0' }}>Opens {c.provider} in a new tab.</p></section>
          <section className="panel sk-about"><h2 className="sk-h2">Details</h2>
            <dl className="sk-dl"><div><dt>Cost</dt><dd>{c.cost}</dd></div><div><dt>Format</dt><dd>{c.format}</dd></div><div><dt>Level</dt><dd>{c.level}</dd></div><div><dt>Language</dt><dd>{c.language}</dd></div>{c.duration && <div><dt>Duration</dt><dd>{c.duration}</dd></div>}<div><dt>Topic</dt><dd>{COURSE_CAT_MAP[c.category] || '—'}</dd></div></dl>
            {(c.tags || []).length > 0 && <div className="sk-tagrow">{c.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
          </section>
        </aside>
      </div>
      {related.length > 0 && <section style={{ marginTop: 40 }}><h2>More {COURSE_CAT_MAP[c.category] || ''} courses</h2><div className="pz-grid">{related.map((r) => <CourseCard key={r.slug} c={r} />)}</div></section>}
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Courses', path: '/courses' }, { name: c.title, path: `/courses/${slug}` }])]} />
    </div>
  );
}
