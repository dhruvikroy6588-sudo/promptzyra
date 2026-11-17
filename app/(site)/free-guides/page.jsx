import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { listBlog } from '@/lib/data';
import { PostCard } from '@/components/v2/Cards';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Free AI Guides for Students, Teachers & Job Seekers', description: 'Free, plain-language guides on prompts, study, careers and AI tools, plus free browser tools you can use without signing up.', path: '/free-guides' });
const FAQ = [
  { q: 'Are these guides really free?', a: 'Yes. Every guide and tool linked here is free to read and use, with no sign-up.' },
  { q: 'Who writes the guides?', a: 'The Promptzyra editorial team writes and reviews them. See our editorial policy for how we check and update pages.' },
  { q: 'Where should a beginner start?', a: 'Start with a prompt basics guide, try the prompt builder, then browse prompts for your goal, such as studying or applying for jobs.' },
];
const TOOLS = [['Resume builder', '/resume-builder', '100 templates, live editor, PDF download.'], ['Prompt builder', '/prompt-builder', 'Structure a clear prompt step by step.'], ['ATS resume checker', '/ats-resume-checker', 'Check keywords and format basics.'], ['Cover letter builder', '/cover-letter-builder', 'A clean letter from a few answers.'], ['Study planner', '/study-planner', 'A day-by-day exam plan.']];
export default async function Page() {
  const res = await listBlog({ pageSize: 12 });
  return (<div className="wrap" style={{ paddingBottom: 56 }}>
    <nav className="crumbs"><Link href="/">Home</Link>/<span>Free guides</span></nav>
    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Free guides</h1>
    <p className="muted prose">Learn how to use AI well without paying for a course. These guides explain prompts, study methods, resumes and tools in plain language, and the free tools below let you practise straight away in your browser.</p>
    <h2 style={{ marginTop: 28 }}>Latest guides</h2>
    {res.rows.length ? <div className="grid g3">{res.rows.map((p) => <PostCard key={p.slug} p={p} />)}</div> : <div className="empty">New guides are coming soon.</div>}
    {res.total > res.rows.length && <p style={{ marginTop: 16 }}><Link className="btn" href="/blog">See all articles</Link></p>}
    <h2 style={{ marginTop: 36 }}>Free tools to practise with</h2>
    <div className="grid g3">{TOOLS.map(([n, h, d]) => <Link key={h} href={h} className="card spot"><h3>{n}</h3><p>{d}</p><div className="ft"><span>Free</span><span>Open →</span></div></Link>)}</div>
    <h2 style={{ marginTop: 36 }}>FAQ</h2><div className="prose">{FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p style={{ margin: 0 }}>{f.a}</p></details>)}</div>
    <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Free guides', path: '/free-guides' }])]} />
  </div>);
}
