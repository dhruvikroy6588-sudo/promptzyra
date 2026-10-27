'use client';
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, Copy, Check, TrendingUp, Flame, CalendarDays, WandSparkles } from "lucide-react";
import PromptCard from "./PromptCard";

import { getSupabase } from "@/lib/supabase";

export default function HomeContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All prompts");
  const [sortBy, setSortBy] = useState("featured");
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let active = true;
    const sb = getSupabase();
    if (sb) sb.from("promptzyra_posts").select("*").eq("published", true).order("updated_at", { ascending: false }).then(({data}) => {
      if (!active) return;
      if (data) setPosts(data.map(p => ({...p, readTime:p.read_time || "4 min read", thumbnail:p.thumbnail || "", tags:p.tags || [], tips:p.tips || []})));
    });
    return () => { active = false; };
  }, []);
  const promptPosts = posts.filter(p => p.kind !== "SEO guide" && p.kind !== "Gemini watermark guide");
  const blogPosts = posts.filter(p => p.kind === "SEO guide" || p.kind === "Gemini watermark guide");
  const filtered = useMemo(() => {
    const found = promptPosts.filter(p => {
      const text = `${p.title} ${p.excerpt} ${p.prompt || ""} ${p.content || ""} ${p.category} ${(p.keywords || "")} ${(p.tags || []).join(" ")}`.toLowerCase();
      return (category === "All prompts" || p.category === category) && text.includes(query.toLowerCase().trim());
    });
    if (sortBy === "title") found.sort((a,b)=>a.title.localeCompare(b.title));
    if (sortBy === "newest") found.sort((a,b)=>String(b.created_at || b.publishedAt || "").localeCompare(String(a.created_at || a.publishedAt || "")));
    return found;
  }, [promptPosts, query, category, sortBy]);
  const featured = promptPosts.slice(0, 3);
  return <main>
    <section className="hero">
      <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      <div className="hero-inner">
        <div className="eyebrow"><span className="live-dot"/> THE CREATOR'S PROMPT LIBRARY <span className="eyebrow-line"/></div>
        <h1>Make your next idea<br/><span>impossible to scroll past.</span></h1>
        <p className="hero-copy">Viral AI photo trends, festival poster concepts and ready-to-copy prompts — made for creators who want to create, not start from scratch.</p>
        <div className="hero-search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prompts, festivals, styles..." aria-label="Search prompts"/><span className="search-shortcut">⌕</span></div>
        <div className="hero-tags"><span>Try:</span>{["80s photo","Diwali poster","3D character","cinematic"].map(t=><button key={t} onClick={()=>setQuery(t)}>{t}</button>)}</div>
        <div className="hero-proof"><div className="avatar-stack"><span>✦</span><span>✳</span><span>◉</span></div><span><strong>{posts.length} published resources</strong><br/>Images and prompts uploaded by our creator</span><span className="proof-divider"/><span className="proof-mini"><Sparkles size={15}/> Copy. Create. Share.</span></div>
      </div>
      <div className="hero-art" aria-label="Your uploaded prompt images appear here">
        {featured[0]?.thumbnail ? <div className="art-panel art-panel-main"><img src={featured[0].thumbnail} alt={featured[0].title}/><div className="art-caption"><span className="art-caption-icon"><WandSparkles size={17}/></span><span><b>{featured[0].title}</b><small>FEATURED PROMPT</small></span><span className="art-caption-arrow">↗</span></div></div> : <div className="hero-upload-empty"><WandSparkles size={30}/><b>Your uploaded image appears here</b><span>Add a prompt and image in the private admin.</span></div>}
      </div>
    </section>

    <section className="trust-strip"><div><TrendingUp size={17}/><span>Trend-inspired ideas</span></div><i/><div><Copy size={17}/><span>Copy-ready prompts</span></div><i/><div><WandSparkles size={17}/><span>Made for creators</span></div><i/><div><CalendarDays size={17}/><span>Seasonal collections</span></div></section>

    <section className="section-wrap" id="trending">
      <div className="section-heading"><div><div className="section-kicker"><Flame size={15}/> THE CREATOR'S FEED</div><h2>Ideas worth <em>trying.</em></h2><p>Explore practical prompts for the styles and occasions creators are experimenting with.</p></div><a href="#all-prompts" className="section-link">Browse all prompts <ArrowRight size={16}/></a></div>
      <div className="feature-grid">{featured.map((p,i)=><PromptCard key={p.id} post={p} featured={i===0}/>)}</div>
    </section>

    <section className="festival-band" id="festivals"><div className="festival-copy"><div className="section-kicker light-kicker"><Sparkles size={15}/> SEASONAL STUDIO</div><h2>Make every celebration<br/><em>look unforgettable.</em></h2><p>Festival-ready visual directions, clean poster prompts and space for your own typography. Start with the idea, finish with your style.</p><Link href="/blog" className="festival-button">Explore festival prompts <ArrowRight size={16}/></Link><div className="festival-note"><span className="note-dot"/> Seasonal dates vary by region — verify before publishing event-specific details.</div></div><div className="festival-visual">{featured[1]?.thumbnail ? <img src={featured[1].thumbnail} alt={featured[1].title}/> : <div className="hero-upload-empty"><WandSparkles size={26}/><b>Creator image showcase</b><span>Published uploads appear here.</span></div>}</div></section>

    <section className="section-wrap category-section" id="categories"><div className="section-heading"><div><div className="section-kicker">FIND YOUR NEXT STYLE</div><h2>Explore by <em>category.</em></h2><p>From photo transformations to seasonal campaigns and 3D characters.</p></div></div><div className="category-grid">{[...new Set(promptPosts.map(p=>p.category).filter(Boolean))].map((c,i)=><button className="category-tile" key={c} onClick={()=>{setCategory(c);document.getElementById("all-prompts")?.scrollIntoView({behavior:"smooth"});}}><span className={`category-icon cat-${i%6}`}>{["✦","◈","✺","▧","◉","✳"][i%6]}</span><span><b>{c}</b><small>Explore prompts</small></span><ArrowRight size={17}/></button>)}</div></section>

    <section className="section-wrap all-section" id="all-prompts"><div className="section-heading"><div><div className="section-kicker">THE PROMPT LIBRARY</div><h2>Find your next <em>starting point.</em></h2><p>Search the starter library or filter by creative category.</p></div><span className="result-count">{filtered.length} guides</span></div>
      <div className="filter-row"><button className={`filter-pill ${category==="All prompts"?"active":""}`} onClick={()=>setCategory("All prompts")}>All prompts</button>{[...new Set(promptPosts.map(p=>p.category).filter(Boolean))].map(c=><button key={c} className={`filter-pill ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <div className="results-toolbar"><span>{filtered.length} results</span><label>Sort by <select value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="featured">Recommended</option><option value="newest">Newest</option><option value="title">Title A–Z</option></select></label></div>
      {filtered.length ? <div className="prompt-grid">{filtered.map(p=><PromptCard key={p.id} post={p}/>)}</div> : <div className="empty-state"><Search size={28}/><h3>No prompts found</h3><p>Try a different keyword or category.</p><button className="primary-button" onClick={()=>{setQuery("");setCategory("All prompts");setSortBy("featured")}}>Clear filters</button></div>}
    </section>
    <section className="section-wrap guide-section" id="guides"><div className="section-heading"><div><div className="section-kicker"><Sparkles size={15}/> PRACTICAL LEARNING</div><h2>Guides for smarter <em>creating.</em></h2><p>Original how-to articles published by the Promptzyra team.</p></div><span className="result-count">{blogPosts.length} published guides</span></div>{blogPosts.length?<div className="prompt-grid">{blogPosts.slice(0,6).map(p=><PromptCard key={p.id} post={p}/>)}</div>:<div className="empty-state"><h3>No published blog posts yet</h3><p>Upload a thumbnail and publish a useful article from the private admin dashboard.</p></div>}<div className="guide-cta"><Link href="/blog" className="section-link">All blog guides <ArrowRight size={16}/></Link></div></section>

    <section className="newsletter-band"><div className="newsletter-icon"><Sparkles size={24}/></div><div><h2>Your next great idea starts here.</h2><p>Save this library and come back when inspiration strikes.</p></div><Link href="/about" className="newsletter-link">How it works <ArrowRight size={16}/></Link></section>
  </main>;
}
