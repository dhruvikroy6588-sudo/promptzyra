import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { listCourses, courseCounts } from '@/lib/data';
import { COURSE_CATS, COURSE_COSTS, COURSE_FORMATS, COURSE_LEVELS } from '@/lib/courses-meta';
import CourseCard from '@/components/v2/CourseCard';
import Pager from '@/components/v2/Pager';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
const FAQ = [
  { q: 'Are these AI courses really free?', a: 'Each course shows its cost: Free, Free + paid certificate, Freemium or Paid. Prices and offers change, so check the course page before you enrol.' },
  { q: 'Do you earn money from these links?', a: 'These are plain links to the course providers. Read our advertising disclosure for how the site is funded.' },
  { q: 'Which course should a beginner start with?', a: 'Filter by Beginner level and the AI Basics or Prompt Engineering category. Pick one course, finish it, then move on instead of collecting many.' },
  { q: 'How are courses chosen?', a: 'Courses are reviewed by hand and checked for a working link, a clear provider and a clear cost before they are published.' },
];
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams; const filtered = sp.q || sp.category || sp.cost || sp.format || sp.level || sp.sort;
  return buildMetadata({ title: 'Free & Paid AI Courses: Learn AI Step by Step', description: 'A hand-reviewed list of free and paid AI courses, YouTube playlists and tutorials for beginners to advanced learners, with cost, level and format shown clearly.', path: '/courses', noindex: !!filtered || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams; const page = Math.max(1, parseInt(sp.page) || 1);
  const q = sp.q || '', category = sp.category || '', cost = sp.cost || '', format = sp.format || '', level = sp.level || '', sort = sp.sort || 'popular';
  const [counts, res] = await Promise.all([courseCounts(), listCourses({ category, cost, format, level, q, sort, page, pageSize: 24 })]);
  const filtered = !!(q || category || cost || format || level || sort !== 'popular');
  return (<>
    <div className="wrap sk-hero">
      <h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{counts.__total > 0 ? `${counts.__total} AI courses` : 'AI courses'}: free and paid</h1>
      <p className="muted prose">Learn AI at your own pace with courses, YouTube playlists and tutorials from well-known providers. Every entry shows the cost, level, format and language so you can choose quickly.</p>
    </div>
    <div className="wrap sk-list">
      <form className="toolbar pzl-bar" action="/courses" role="search">
        <input name="q" defaultValue={q} placeholder="Search courses, providers…" aria-label="Search courses" style={{ flex: 1, minWidth: 180 }} />
        <select name="category" defaultValue={category} aria-label="Category"><option value="">All topics</option>{COURSE_CATS.map(([s, n]) => <option key={s} value={s}>{n}</option>)}</select>
        <select name="cost" defaultValue={cost} aria-label="Cost"><option value="">Free or paid</option>{COURSE_COSTS.map((c) => <option key={c}>{c}</option>)}</select>
        <select name="format" defaultValue={format} aria-label="Format"><option value="">Any format</option>{COURSE_FORMATS.map((c) => <option key={c}>{c}</option>)}</select>
        <select name="level" defaultValue={level} aria-label="Level"><option value="">Any level</option>{COURSE_LEVELS.map((c) => <option key={c}>{c}</option>)}</select>
        <button className="btn btn-primary" type="submit">Apply</button>
        {filtered && <Link className="btn" href="/courses" rel="nofollow">Clear</Link>}
      </form>
      <p className="muted small pzl-count">{res.total} {res.total === 1 ? 'course' : 'courses'}</p>
      {res.rows.length ? <div className="pz-grid">{res.rows.map((c) => <CourseCard key={c.slug} c={c} />)}</div> : <div className="empty">{filtered ? 'No courses match these filters.' : 'New courses are being reviewed and will appear here soon.'}</div>}
      <Pager page={page} total={res.total} pageSize={24} base="/courses" params={{ q, category, cost, format, level, sort: sort !== 'popular' ? sort : '' }} />
    </div>
    <PromptFaq items={FAQ} title="AI courses FAQ" />
    <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Courses', path: '/courses' }])]} />
  </>);
}
