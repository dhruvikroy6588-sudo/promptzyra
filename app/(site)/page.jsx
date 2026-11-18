import { icon } from '@/lib/site';
import Link from 'next/link';
import { Search, FileText, Wand2, ShieldCheck, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { getCategories, promptCounts, toolCounts, listPrompts, listTools, listBlog, listPhotoPrompts, getSetting } from '@/lib/data';
import { CatCard, PromptCard, ToolCard, PostCard } from '@/components/v2/Cards';
import { RESUME_TEMPLATE_COUNT } from '@/lib/resume/count';
import JsonLd from '@/components/v2/JsonLd';
import { CardPhoto } from '@/components/v2/PhotoCards';
import UseCaseTabs from '@/components/v2/UseCaseTabs';
import Newsletter from '@/components/v2/Newsletter';
import SkillsStrip from '@/components/v2/SkillsStrip';
import { MODELS } from '@/lib/site';
const AUDIENCES = [['student', 'Students'], ['teacher', 'Teachers'], ['job-seeker', 'Job seekers'], ['creator', 'Creators'], ['professional', 'Professionals'], ['entrepreneur', 'Entrepreneurs']];
const PRICE_CHIPS = [['free', 'Free'], ['freemium', 'Freemium'], ['free-trial', 'Free trial'], ['paid', 'Paid'], ['open-source', 'Open source']];
export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Promptzyra — AI prompts, tools directory & free resume builder', description: 'Original AI prompts for students, teachers and job seekers, an AI tools directory with plain-language guides, and a free resume builder with 100 templates.', path: '/' });

const FAQ = [
  { q: 'Is Promptzyra free?', a: 'Yes. Browsing the prompt library and AI tools directory, and building and downloading a resume as PDF, are free with no watermark and no sign-up.' },
  { q: 'Where is my resume data stored?', a: 'In your own browser (local storage) only. Nothing you type into the resume builder is uploaded to our servers.' },
  { q: 'Are the prompts copied from other websites?', a: 'No. Prompts are written and reviewed by our team for learning use cases, and each one explains when and how to use it.' },
  { q: 'How do you choose which AI tools to list?', a: 'We list tools we have reviewed for real use cases, show pricing as a general type (free, freemium, paid), and link to the official site so you can check current plans.' },
];

const Head = ({ id, title, sub, href, cta }) => (
  <div className="pzh-sh"><div><h2 id={id}>{title}</h2>{sub && <p>{sub}</p>}</div>{href && <Link className="pzh-more" href={href}>{cta || 'View all'} <ArrowRight size={15} aria-hidden="true" /></Link>}</div>
);

export default async function Home() {
  const [pc, tc, pcat, tcat, phcat, trending, latest, copied, tl, bl, ph, hs] = await Promise.all([
    promptCounts(), toolCounts(), getCategories('prompt'), getCategories('tool'), getCategories('photo'),
    listPrompts({ pageSize: 6, sort: 'popular' }), listPrompts({ pageSize: 6, sort: 'latest' }), listPrompts({ pageSize: 6, sort: 'copied' }),
    listTools({ pageSize: 6 }), listBlog({ pageSize: 3 }), listPhotoPrompts({ pageSize: 6, sort: 'popular' }), getSetting('home_sections', {}),
  ]);
  const pname = Object.fromEntries(pcat.map((c) => [c.slug, c.name]));
  const tname = Object.fromEntries(tcat.map((c) => [c.slug, c.name]));
  const show = (k) => hs?.[k] !== false;
  const copiedRows = copied.rows.filter((p) => p.copy_count > 0);
  const phRows = ph.rows.slice(0, 6);
  const phNames = Object.fromEntries(phcat.map((c) => [c.slug, c.name]));
  return (
    <div className="pzh">
      <section className="pzh-hero" aria-labelledby="h-hero">
        <div className="pzh-in">
          <span className="pzh-pill"><Sparkles size={14} aria-hidden="true" />Free · Education-first · No sign-up</span>
          <h1 id="h-hero">Learn AI faster with <em>tested prompts</em>, honest tool guides and a resume builder.</h1>
          <p className="pzh-lead">Original prompts for students, teachers and job seekers. A tools directory that explains who each tool is for. A resume editor with {RESUME_TEMPLATE_COUNT} templates that runs entirely in your browser.</p>
          <form className="pzh-search" action="/search" role="search"><Search size={20} aria-hidden="true" /><input name="q" placeholder="Search prompts, tools, skills" aria-label="Search prompts and tools" /><button className="btn btn-primary" type="submit">Search</button></form>
          <div className="pzh-quick" aria-label="Quick links">{pcat.slice(0, 6).map((c) => <Link key={c.slug} className="chip" href={`/prompts/category/${c.slug}`}>{icon(c.icon)} {c.name}</Link>)}<Link className="chip" href="/prompt-builder"><Wand2 size={14} aria-hidden="true" /> Prompt builder</Link></div>
          <div className="pzh-stats">
            <div><b>{pc.__total || '—'}</b><span>Prompts</span></div>
            <div><b>{tc.__total || '—'}</b><span>AI tools</span></div>
            <div><b>{RESUME_TEMPLATE_COUNT}</b><span>Resume templates</span></div>
          </div>
        </div>
      </section>

      {pcat.length > 0 && <section className="pzh-sec" aria-labelledby="h-cats">
        <Head id="h-cats" title="Browse by category" sub="Each prompt explains when to use it, how to adapt it, and what good output looks like." href="/prompts" cta="All prompts" />
        <div className="pz-grid pz-grid-cats">{pcat.map((c) => <CatCard key={c.slug} c={c} href={`/prompts/category/${c.slug}`} n={pc[c.slug]} />)}</div>
      </section>}

      {show('prompts') && trending.rows.length > 0 && <section className="pzh-sec" aria-labelledby="h-trend">
        <Head id="h-trend" title="Trending prompts" sub="Featured and popular picks from the library." href="/prompts" />
        <div className="pz-grid">{trending.rows.map((p) => <PromptCard key={p.slug} p={p} catName={pname[p.category]} />)}</div>
      </section>}

      {show('prompts') && latest.rows.length > 0 && <section className="pzh-sec" aria-labelledby="h-latest">
        <Head id="h-latest" title="Latest prompts" sub="Freshly published and reviewed." href="/prompts?sort=latest" />
        <div className="pz-grid">{latest.rows.map((p) => <PromptCard key={p.slug} p={p} catName={pname[p.category]} />)}</div>
      </section>}

      {show('prompts') && copiedRows.length > 0 && <section className="pzh-sec" aria-labelledby="h-copied">
        <Head id="h-copied" title="Most copied" sub="What people are actually copying and using." href="/prompts" />
        <div className="pz-grid">{copiedRows.map((p) => <PromptCard key={p.slug} p={p} catName={pname[p.category]} />)}</div>
      </section>}

      <section className="pzh-sec" aria-labelledby="h-browse">
        <Head id="h-browse" title="Find prompts for your AI assistant and audience" />
        <div className="pzh-browse">
          <div className="pzh-panel"><h3>By AI tool</h3><div className="chips" style={{ justifyContent: 'flex-start' }}>{MODELS.map((m) => <Link key={m.id} className="chip" href={`/prompts/model/${m.id}`}>{m.label}</Link>)}</div></div>
          <div className="pzh-panel"><h3>By audience</h3><div className="chips" style={{ justifyContent: 'flex-start' }}>{AUDIENCES.map(([k, l]) => <Link key={k} className="chip" href={`/prompts/for/${k}`}>{l}</Link>)}</div></div>
        </div>
      </section>

      <section className="pzh-sec" aria-labelledby="h-use">
        <Head id="h-use" title="What do you want to do?" sub="Pick a goal and jump straight to a prompt or tool that helps." />
        <UseCaseTabs />
        <div className="pzh-cta"><div><h3>Generate your own prompt</h3><p>Answer a few questions and get a clear, structured prompt for any AI assistant.</p></div><Link className="btn btn-primary" href="/prompt-builder"><Wand2 size={16} />Open prompt builder</Link></div>
      </section>

      <SkillsStrip />

      {show('tools') && tl.rows.length > 0 && <section className="pzh-sec" aria-labelledby="h-ai">
        <Head id="h-ai" title="AI tools directory" sub="Browse by what you want to get done, not by hype." href="/ai-tools" cta="Browse tools" />
        <div className="pzh-chiprow">{PRICE_CHIPS.map(([k, l]) => <Link key={k} className="chip" href={`/ai-tools/pricing/${k}`}>{l} tools</Link>)}</div>
        <div className="pzh-chiprow">{tcat.map((c) => <Link key={c.slug} className="chip" href={`/ai-tools/category/${c.slug}`}>{icon(c.icon)} {c.name}{tc[c.slug] ? ` · ${tc[c.slug]}` : ''}</Link>)}</div>
        <div className="pz-grid">{tl.rows.map((t) => <ToolCard key={t.slug} t={t} catName={tname[t.category]} />)}</div>
      </section>}

      <section className="pzh-sec" aria-labelledby="h-tools">
        <Head id="h-tools" title="Free tools that run in your browser" sub="No uploads, no accounts — your data stays on your device." />
        <div className="pz-grid pz-grid-4">
          {[['Resume builder', '/resume-builder', 'Pick a template, edit live, download PDF.', <FileText key="a" />],
            ['Prompt builder', '/prompt-builder', 'Turn a rough idea into a structured prompt.', <Wand2 key="b" />],
            ['ATS resume checker', '/ats-resume-checker', 'Check keywords and formatting basics.', <ShieldCheck key="c" />],
            ['Cover letter builder', '/cover-letter-builder', 'Write a clean letter in minutes.', <Layers key="d" />]].map(([n, h, d, ic]) => (
            <Link key={h} href={h} className="pz-card pz-cat"><div className="pz-cat-ic" aria-hidden="true">{ic}</div><h3 className="pz-title">{n}</h3><p className="pz-sum">{d}</p><div className="pz-meta"><span className="pz-cnt">Free</span><span className="pz-cnt">Open <ArrowRight size={14} aria-hidden="true" /></span></div></Link>))}
        </div>
      </section>

      {show('resume') && <section className="pzh-sec" aria-labelledby="h-res">
        <div className="pzh-resume">
          <div><h2 id="h-res">Resume builder with {RESUME_TEMPLATE_COUNT} templates</h2><p className="muted">Click any template, type straight onto the page, add or remove sections, and download a clean text-based PDF. No watermark, no sign-up, nothing leaves your browser.</p><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-primary" href="/resume-builder">Choose a template</Link><Link className="btn" href="/resume-builder/editor">Start from blank</Link></div></div>
          <div className="pzh-thumbs">{['t001', 't014', 't042'].map((id) => <img key={id} className="rs-thumb" src={`/resume-thumbs/${id}.webp`} alt="Resume template preview" loading="lazy" width="210" height="297" />)}</div>
        </div>
      </section>}

      {show('photos') && phRows.length > 0 && <section className="pzh-sec" aria-labelledby="h-photo">
        <Head id="h-photo" title="Photo prompts" sub="Image-first prompts you can copy into your favourite AI image tool." href="/photo-prompts" cta="All photo prompts" />
        <div className="ph-grid">{phRows.map((r) => <CardPhoto key={r.slug} p={r} catName={phNames[r.category]} />)}</div>
      </section>}

      {show('blog') && bl.rows.length > 0 && <section className="pzh-sec" aria-labelledby="h-blog">
        <Head id="h-blog" title="Latest from the blog" sub="Guides and articles on using AI well." href="/blog" cta="All articles" />
        <div className="pz-grid">{bl.rows.map((p) => <PostCard key={p.slug} p={p} />)}</div>
      </section>}

      <section className="pzh-sec"><Newsletter source="home" /></section>

      <section className="pzh-sec"><div className="prose"><h2>How we make Promptzyra</h2><p>Every prompt and tool guide is written for people, then reviewed before publishing. We explain limitations as clearly as strengths, avoid copying other sites, and update pages when tools change. Read our <Link href="/editorial-policy">editorial policy</Link> and <Link href="/about">about page</Link>.</p></div></section>

      <section className="pzh-sec" aria-labelledby="h-faq"><h2 id="h-faq">Frequently asked questions</h2><div className="pzh-faq">{FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
      <JsonLd data={faqJsonLd(FAQ)} />
    </div>
  );
}
