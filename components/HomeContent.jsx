'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, Copy, TrendingUp, Flame, CalendarDays, WandSparkles } from "lucide-react";
import PromptCard from "./PromptCard";

import { getSupabase } from "@/lib/supabase";

export default function HomeContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All prompts");
  const [sortBy, setSortBy] = useState("featured");
  const [posts, setPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState(["AI Photo Trends", "Portrait Prompts", "Fashion & Editorial", "3D & Characters", "Digital Art", "Product Photography", "Seasonal & Festivals"]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 50;
  const requestId = useRef(0);
  const normalize = (rows) => (rows || []).map(p => ({...p, readTime:p.read_time || "4 min read", thumbnail:p.thumbnail || "", tags:p.tags || [], tips:p.tips || []}));
  const fetchPromptPage = async (offset, append = false) => {
    const currentRequest = ++requestId.current;
    const sb = getSupabase();
    if (!sb) { setLoading(false); setLoadingMore(false); return; }
    if (append) setLoadingMore(true); else { setLoading(true); setPosts([]); setHasMore(false); }
    let request = sb.from("promptzyra_posts").select("*", { count: "exact" }).eq("published", true).neq("kind", "SEO guide").neq("kind", "Gemini watermark guide").neq("kind", "blog").neq("kind", "Blog");
    if (category !== "All prompts") request = request.eq("category", category);
    const term = query.trim().replace(/[%,()]/g, " ");
    if (term) request = request.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,prompt.ilike.%${term}%,keywords.ilike.%${term}%`);
    request = request.order(sortBy === "title" ? "title" : "updated_at", { ascending: sortBy === "title" });
    const { data, error, count } = await request.range(offset, offset + PAGE_SIZE - 1);
    if (currentRequest !== requestId.current) return;
    if (error) { console.error("Prompt library query failed:", error.message); if (!append) setPosts([]); }
    else {
      const rows = normalize(data);
      setPosts(prev => append ? [...prev, ...rows] : rows);
      setTotal(count || 0);
      setHasMore(offset + rows.length < (count || 0));
    }
    setLoading(false); setLoadingMore(false);
  };
  useEffect(() => {
    let active = true;
    const sb = getSupabase();
    if (!sb) return () => { active = false; };
    Promise.all([
      sb.from("promptzyra_categories").select("name").order("name"),
      sb.from("promptzyra_posts").select("*").eq("published", true).in("kind", ["blog", "Blog", "SEO guide", "Gemini watermark guide"]).order("updated_at", { ascending: false }).limit(6)
    ]).then(([cats, blogs]) => {
      if (!active) return;
      if (cats.data?.length) setCategories(prev => [...new Set([...prev, ...cats.data.map(c => c.name)])].sort((a,b)=>a.localeCompare(b)));
      setBlogPosts(normalize(blogs.data));
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    fetchPromptPage(0, false);
  // Reload the first page when a search/filter/sort changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, sortBy]);
  const promptPosts = posts;
  const filtered = posts;
  const featured = promptPosts.slice(0, 3);
  const loadMore = () => fetchPromptPage(posts.length, true);
  return <main>
    <section className="hero">
      <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      <div className="hero-inner">
        <div className="eyebrow"><span className="live-dot"/> THE CREATOR'S PROMPT LIBRARY <span className="eyebrow-line"/></div>
        <h1>Make your next idea<br/><span>impossible to scroll past.</span></h1>
        <p className="hero-copy">Viral AI photo trends, festival poster concepts and ready-to-copy prompts — made for creators who want to create, not start from scratch.</p>
        <div className="hero-search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prompts, festivals, styles..." aria-label="Search prompts"/><span className="search-shortcut">⌕</span></div>
        <div className="hero-tags"><span>Try:</span>{["80s photo","Diwali poster","3D character","cinematic"].map(t=><button key={t} onClick={()=>setQuery(t)}>{t}</button>)}</div>
        <div className="hero-proof"><div className="avatar-stack"><span>✦</span><span>✳</span><span>◉</span></div><span><strong>{total} published resources</strong><br/>Images and prompts uploaded by our creator</span><span className="proof-divider"/><span className="proof-mini"><Sparkles size={15}/> Copy. Create. Share.</span></div>
      </div>
      <div className="hero-art" aria-label="Your uploaded prompt images appear here">
        {featured[0]?.thumbnail ? <div className="art-panel art-panel-main"><img src={featured[0].thumbnail} alt={featured[0].title}/><div className="art-caption"><span className="art-caption-icon"><WandSparkles size={17}/></span><span><b>{featured[0].title}</b><small>FEATURED PROMPT</small></span><span className="art-caption-arrow">↗</span></div></div> : <div className="hero-upload-empty studio-preview" aria-label="Promptzyra visual preview"><div className="preview-orbit orbit-a"/><div className="preview-orbit orbit-b"/><div className="preview-poster"><span className="poster-label">PROMPTZYRA / CREATIVE STUDIO</span><div className="poster-sun"/><div className="poster-mountain mountain-a"/><div className="poster-mountain mountain-b"/><span className="poster-title">MAKE IT<br/>VISUAL.</span><span className="poster-foot">AI PROMPT COLLECTION · 2026</span></div><div className="preview-chip chip-one"><Sparkles size={13}/> Image prompts</div><div className="preview-chip chip-two"><WandSparkles size={13}/> Creator tools</div></div>}
      </div>
    </section>

    <section className="trust-strip"><div><TrendingUp size={17}/><span>Trend-inspired ideas</span></div><i/><div><Copy size={17}/><span>Copy-ready prompts</span></div><i/><div><WandSparkles size={17}/><span>Made for creators</span></div><i/><div><CalendarDays size={17}/><span>Seasonal collections</span></div></section>

    <section className="section-wrap" id="trending">
      <div className="section-heading"><div><div className="section-kicker"><Flame size={15}/> THE CREATOR'S FEED</div><h2>Ideas worth <em>trying.</em></h2><p>Explore practical prompts for the styles and occasions creators are experimenting with.</p></div><a href="#all-prompts" className="section-link">Browse all prompts <ArrowRight size={16}/></a></div>
      <div className="feature-grid">{featured.map((p,i)=><PromptCard key={p.id} post={p} featured={i===0}/>)}</div>
    </section>

    <section className="festival-band" id="festivals"><div className="festival-copy"><div className="section-kicker light-kicker"><Sparkles size={15}/> SEASONAL STUDIO</div><h2>Make every celebration<br/><em>look unforgettable.</em></h2><p>Festival-ready visual directions, clean poster prompts and space for your own typography. Start with the idea, finish with your style.</p><Link href="/blog" className="festival-button">Explore festival prompts <ArrowRight size={16}/></Link><div className="festival-note"><span className="note-dot"/> Seasonal dates vary by region — verify before publishing event-specific details.</div></div><div className="festival-visual">{featured[1]?.thumbnail ? <img src={featured[1].thumbnail} alt={featured[1].title}/> : <div className="hero-upload-empty"><WandSparkles size={26}/><b>Creator image showcase</b><span>Published uploads appear here.</span></div>}</div></section>

    <section className="section-wrap category-section" id="categories"><div className="section-heading"><div><div className="section-kicker">FIND YOUR NEXT STYLE</div><h2>Explore by <em>category.</em></h2><p>From photo transformations to seasonal campaigns and 3D characters.</p></div></div><div className="category-grid">{categories.map((c,i)=><button className="category-tile" key={c} onClick={()=>{setCategory(c);document.getElementById("all-prompts")?.scrollIntoView({behavior:"smooth"});}}><span className={`category-icon cat-${i%6}`}>{["✦","◈","✺","▧","◉","✳"][i%6]}</span><span><b>{c}</b><small>Explore prompts</small></span><ArrowRight size={17}/></button>)}</div></section>

    <section className="section-wrap all-section" id="all-prompts"><div className="section-heading"><div><div className="section-kicker">THE PROMPT LIBRARY</div><h2>Find your next <em>starting point.</em></h2><p>Search the starter library or filter by creative category.</p></div><span className="result-count">{total} prompts</span></div>
      <div className="filter-row"><button className={`filter-pill ${category==="All prompts"?"active":""}`} onClick={()=>setCategory("All prompts")}>All prompts</button>{categories.map(c=><button key={c} className={`filter-pill ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <div className="results-toolbar"><span>{loading ? "Loading…" : `${total} results`}</span><label>Sort by <select value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="featured">Recommended</option><option value="newest">Newest</option><option value="title">Title A–Z</option></select></label></div>
      {loading && !filtered.length ? <div className="empty-state"><Search size={28}/><h3>Loading prompt library…</h3></div> : filtered.length ? <><div className="prompt-grid">{filtered.map(p=><PromptCard key={p.id} post={p}/>)}</div>{hasMore && <div className="load-more-wrap"><button className="primary-button load-more-button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? "Loading more…" : `Load more prompts (${Math.max(0,total-posts.length)} remaining)`}</button></div>}</> : <div className="empty-state"><Search size={28}/><h3>No prompts found</h3><p>Try a different keyword or category.</p><button className="primary-button" onClick={()=>{setQuery("");setCategory("All prompts");setSortBy("featured")}}>Clear filters</button></div>}
    </section>
    <section className="section-wrap guide-section" id="guides"><div className="section-heading"><div><div className="section-kicker"><Sparkles size={15}/> PRACTICAL LEARNING</div><h2>Guides for smarter <em>creating.</em></h2><p>Original, practical articles published by the Promptzyra team.</p></div><span className="result-count">Latest guides</span></div>{blogPosts.length?<div className="prompt-grid">{blogPosts.map(p=><article className="prompt-card blog-list-card" key={p.id}><Link href={`/blog/${p.slug}`} className="card-image-link"><div className="card-image">{p.thumbnail||p.image2||p.image1?<img src={p.thumbnail||p.image2||p.image1} alt={p.title} loading="lazy"/>:<div className="card-image-empty">Blog guide</div>}<span className="image-tag">Creator guide</span></div></Link><div className="card-body"><div className="card-meta"><span>{p.category||'AI WORKFLOW'}</span><span className="dot"/><span>{p.read_time||'4 min read'}</span></div><h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{p.excerpt||''}</p><div className="card-bottom"><span className="prompt-ready">Practical guide</span><Link className="text-link" href={`/blog/${p.slug}`}>Read guide <ArrowRight size={15}/></Link></div></div></article>)}</div>:<div className="empty-state"><h3>No published blog posts yet</h3><p>Publish your first blog from Admin and it will appear here.</p></div>}<div className="guide-cta"><Link href="/blog" className="section-link">All blog guides <ArrowRight size={16}/></Link></div></section>

    <section className="newsletter-band"><div className="newsletter-icon"><Sparkles size={24}/></div><div><h2>Your next great idea starts here.</h2><p>Save this library and come back when inspiration strikes.</p></div><Link href="/about" className="newsletter-link">How it works <ArrowRight size={16}/></Link></section>
  </main>;
}
