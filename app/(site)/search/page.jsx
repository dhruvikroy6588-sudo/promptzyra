import Link from 'next/link';
import { searchAll } from '@/lib/data';
import { PromptCard, ToolCard, PostCard } from '@/components/v2/Cards';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search', robots: { index: false, follow: true } };
export default async function Page({ searchParams }) {
  const sp = await searchParams; const q = (sp.q || '').toString().slice(0, 80);
  const r = await searchAll(q); const n = r.prompts.length + r.tools.length + r.posts.length;
  return (<div className="wrap" style={{ paddingBottom: 56 }}>
    <h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>Search</h1>
    <form className="toolbar" action="/search" role="search"><input name="q" defaultValue={q} placeholder="Search prompts, AI tools and articles…" aria-label="Search" autoFocus /><button className="btn btn-primary" type="submit">Search</button></form>
    {q.length >= 2 && <p className="muted">{n ? `${n} results for “${q}”` : `No results for “${q}”. Try a broader word or browse the `}{!n && <><Link href="/prompts">prompt library</Link>.</>}</p>}
    {r.prompts.length > 0 && <><h2>Prompts</h2><div className="grid g3">{r.prompts.map((p) => <PromptCard key={p.slug} p={p} />)}</div></>}
    {r.tools.length > 0 && <><h2 style={{ marginTop: 32 }}>AI tools</h2><div className="grid g3">{r.tools.map((t) => <ToolCard key={t.slug} t={t} />)}</div></>}
    {r.posts.length > 0 && <><h2 style={{ marginTop: 32 }}>Articles</h2><div className="grid g3">{r.posts.map((p) => <PostCard key={p.slug} p={p} />)}</div></>}
  </div>);
}
