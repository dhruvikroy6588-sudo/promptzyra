'use client';
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, Copy, Check, TrendingUp, Flame, CalendarDays, WandSparkles } from "lucide-react";
import PromptCard from "./PromptCard";
import { seedPosts, seedCategories } from "@/lib/seed-posts";

export default function HomeContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All prompts");
  const [posts, setPosts] = useState(seedPosts);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pz_posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        const ids = new Set(parsed.map(p => p.id));
        setPosts([...parsed, ...seedPosts.filter(p => !ids.has(p.id))]);
      }
    } catch {}
  }, []);
  const filtered = useMemo(() => posts.filter(p => {
    const text = `${p.title} ${p.excerpt} ${p.category} ${(p.keywords || "")} ${(p.tags || []).join(" ")}`.toLowerCase();
    return (category === "All prompts" || p.category === category) && text.includes(query.toLowerCase());
  }), [posts, query, category]);
  const featured = posts.slice(0, 3);
  return <main>
    <section className="hero">
      <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      <div className="hero-inner">
        <div className="eyebrow"><span className="live-dot"/> THE CREATOR'S PROMPT LIBRARY <span className="eyebrow-line"/></div>
        <h1>Make your next idea<br/><span>impossible to scroll past.</span></h1>
        <p className="hero-copy">Viral AI photo trends, festival poster concepts and ready-to-copy prompts — made for creators who want to create, not start from scratch.</p>
        <div className="hero-search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prompts, festivals, styles..." aria-label="Search prompts"/><span className="search-shortcut">⌕</span></div>
        <div className="hero-tags"><span>Try:</span>{["80s photo","Diwali poster","3D character","cinematic"].map(t=><button key={t} onClick={()=>setQuery(t)}>{t}</button>)}</div>
        <div className="hero-proof"><div className="avatar-stack"><span>✦</span><span>✳</span><span>◉</span></div><span><strong>30 starter guides</strong><br/>Fresh ideas for your next creation</span><span className="proof-divider"/><span className="proof-mini"><Sparkles size={15}/> Copy. Create. Share.</span></div>
      </div>
      <div className="hero-art" aria-label="Featured prompt preview">
        <div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/>
        <div className="art-panel art-panel-back"><img src="/images/03-after.svg" alt="3D action figure concept"/></div>
        <div className="art-panel art-panel-main"><img src="/images/01-after.svg" alt="Retro portrait prompt preview"/><div className="art-caption"><span className="art-caption-icon"><WandSparkles size={17}/></span><span><b>Retro portrait</b><small>01 / TRENDING STYLE</small></span><span className="art-caption-arrow">↗</span></div></div>
        <div className="floating-chip chip-top"><span className="chip-spark">✦</span> Prompt of the day</div>
        <div className="floating-chip chip-bottom"><Copy size={14}/> One-click copy</div>
      </div>
    </section>

    <section className="trust-strip"><div><TrendingUp size={17}/><span>Trend-inspired ideas</span></div><i/><div><Copy size={17}/><span>Copy-ready prompts</span></div><i/><div><WandSparkles size={17}/><span>Made for creators</span></div><i/><div><CalendarDays size={17}/><span>Seasonal collections</span></div></section>

    <section className="section-wrap" id="trending">
      <div className="section-heading"><div><div className="section-kicker"><Flame size={15}/> THE CREATOR'S FEED</div><h2>Ideas worth <em>trying.</em></h2><p>Explore practical prompts for the styles and occasions creators are experimenting with.</p></div><a href="#all-prompts" className="section-link">Browse all prompts <ArrowRight size={16}/></a></div>
      <div className="feature-grid">{featured.map((p,i)=><PromptCard key={p.id} post={p} featured={i===0}/>)}</div>
    </section>

    <section className="festival-band" id="festivals"><div className="festival-copy"><div className="section-kicker light-kicker"><Sparkles size={15}/> SEASONAL STUDIO</div><h2>Make every celebration<br/><em>look unforgettable.</em></h2><p>Festival-ready visual directions, clean poster prompts and space for your own typography. Start with the idea, finish with your style.</p><Link href={`/blog/${posts.find(p=>p.title.startsWith("Diwali Poster"))?.slug || posts[0].slug}`} className="festival-button">Explore festival prompts <ArrowRight size={16}/></Link><div className="festival-note"><span className="note-dot"/> Seasonal dates vary by region — verify before publishing event-specific details.</div></div><div className="festival-visual"><img src="/images/11-after.svg" alt="Diwali festival poster concept"/><img className="festival-small" src="/images/12-after.svg" alt="Dhanteras poster concept"/><div className="festival-sticker">FESTIVE<br/>EDITION <span>✦</span></div></div></section>

    <section className="section-wrap category-section" id="categories"><div className="section-heading"><div><div className="section-kicker">FIND YOUR NEXT STYLE</div><h2>Explore by <em>category.</em></h2><p>From photo transformations to seasonal campaigns and 3D characters.</p></div></div><div className="category-grid">{seedCategories.map((c,i)=><button className="category-tile" key={c} onClick={()=>{setCategory(c);document.getElementById("all-prompts")?.scrollIntoView({behavior:"smooth"});}}><span className={`category-icon cat-${i%6}`}>{["✦","◈","✺","▧","◉","✳"][i%6]}</span><span><b>{c}</b><small>Explore prompts</small></span><ArrowRight size={17}/></button>)}</div></section>

    <section className="section-wrap all-section" id="all-prompts"><div className="section-heading"><div><div className="section-kicker">THE PROMPT LIBRARY</div><h2>Find your next <em>starting point.</em></h2><p>Search the starter library or filter by creative category.</p></div><span className="result-count">{filtered.length} guides</span></div>
      <div className="filter-row"><button className={`filter-pill ${category==="All prompts"?"active":""}`} onClick={()=>setCategory("All prompts")}>All prompts</button>{seedCategories.map(c=><button key={c} className={`filter-pill ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      {filtered.length ? <div className="prompt-grid">{filtered.map(p=><PromptCard key={p.id} post={p}/>)}</div> : <div className="empty-state"><Search size={28}/><h3>No prompts found</h3><p>Try a different keyword or category.</p><button className="primary-button" onClick={()=>{setQuery("");setCategory("All prompts")}}>Clear filters</button></div>}
    </section>
    <section className="newsletter-band"><div className="newsletter-icon"><Sparkles size={24}/></div><div><h2>Your next great idea starts here.</h2><p>Save this library and come back when inspiration strikes.</p></div><Link href="/about" className="newsletter-link">How it works <ArrowRight size={16}/></Link></section>
  </main>;
}
