import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/v2/JsonLd';
export const metadata = buildMetadata({ title: 'Free Online Tools — Resume, Cover Letter, ATS Check & More', description: 'Free browser-based tools for students and job seekers: resume builder, cover letter builder, ATS resume checker, prompt builder and study planner. No sign-up.', path: '/tools' });
const T = [['Resume builder', '/resume-builder', '100 templates, live editor, PDF download.'], ['Cover letter builder', '/cover-letter-builder', 'A clean letter from a few answers.'], ['ATS resume checker', '/ats-resume-checker', 'Format checks and keyword gaps.'], ['Prompt builder', '/prompt-builder', 'Build structured prompts for any AI assistant.'], ['Study planner', '/study-planner', 'A day-by-day plan for your exam.']];
export default function Page() {
  return (<div className="wrap" style={{ paddingBottom: 64 }}><h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Free tools</h1><p className="muted prose">Every tool runs in your browser. Nothing you type is uploaded.</p>
    <div className="grid g3">{T.map(([n, h, d]) => <Link key={h} href={h} className="card spot"><h3>{n}</h3><p>{d}</p><div className="ft"><span>Free</span><span>Open →</span></div></Link>)}</div>
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Free tools', path: '/tools' }])} /></div>);
}
