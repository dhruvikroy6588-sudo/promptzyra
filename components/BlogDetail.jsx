'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Copy, Share2, Sparkles, WandSparkles } from "lucide-react";
import { seedPosts } from "@/lib/seed-posts";
import PromptCard from "./PromptCard";

export default function BlogDetail({ slug }) {
  const [posts,setPosts] = useState(seedPosts);
  const [copied,setCopied] = useState(false);
  const [copyLabel,setCopyLabel] = useState("Copy full prompt");
  useEffect(()=>{try{const raw=localStorage.getItem("pz_posts");if(raw){const saved=JSON.parse(raw);const ids=new Set(saved.map(p=>p.id));setPosts([...saved,...seedPosts.filter(p=>!ids.has(p.id))]);}}catch{}},[]);
  const post=posts.find(p=>p.slug===slug);
  if(!post) return <main className="not-found"><span className="section-kicker">404 / PROMPT NOT FOUND</span><h1>This idea wandered off.</h1><p>The article may have been removed or its URL has changed.</p><Link className="primary-button" href="/">Back to prompts <ArrowRight size={16}/></Link></main>;
  const related=posts.filter(p=>p.category===post.category&&p.slug!==post.slug).slice(0,3);
  const copy=async()=>{try{await navigator.clipboard.writeText(post.prompt);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopyLabel("Select and copy below");}};
  const share=async()=>{try{await navigator.share({title:post.title,text:post.excerpt,url:location.href});}catch{}};
  return <main className="article-page">
    <div className="article-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to library</Link><span className="article-breadcrumb">Prompt library <span>/</span> {post.category}</span></div>
    <article className="article-layout">
      <div className="article-main">
        <div className="article-kicker"><span>{post.category}</span><span className="kicker-line"/><span><Clock3 size={13}/> {post.readTime || "4 min read"}</span></div>
        <h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p>
        <div className="article-byline"><div className="author-avatar">PV</div><span><b>{post.author || "Promptzyra Team"}</b><small>Creative prompt guide · Updated {post.publishedAt || "2026-10-27"}</small></span><button className="share-button" onClick={share}><Share2 size={15}/> Share</button></div>
        <div className="article-hero-image"><img src={post.image2 || post.thumbnail} alt={`${post.title} example`} /><span>VISUAL CONCEPT / 02</span></div>
        <div className="article-body"><p>{post.content || post.excerpt}</p><h2>What this prompt helps you create</h2><p>{post.excerpt} Use the prompt as a starting point rather than a fixed recipe. Your reference image, chosen generator and settings can change the result, so test variations before using the final artwork publicly.</p>
        <div className="before-after"><figure><img src={post.image1} alt={`First visual concept for ${post.title}`}/><figcaption>01 / Starting direction</figcaption></figure><figure><img src={post.image2 || post.thumbnail} alt={`Second visual concept for ${post.title}`}/><figcaption>02 / Style direction</figcaption></figure></div>
        <h2>Copy-ready AI prompt</h2><p>Copy the prompt below, then customize the subject, color palette or setting to match your idea.</p>
        <div className="prompt-box"><div className="prompt-box-head"><span><span className="prompt-status-dot"/> MASTER PROMPT</span><span className="prompt-word-count">{post.prompt.trim().split(/\s+/).length} words</span></div><p>{post.prompt}</p><button className="copy-prompt-button" onClick={copy}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?"Copied to clipboard":copyLabel}</button></div>
        <h2>Tips for a better result</h2><ul className="tip-list">{(post.tips || ["Use a clear reference image.","Try a few variations.","Review details before publishing."]).map((t,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span>{t}</li>)}</ul>
        <div className="article-note"><Sparkles size={18}/><p><b>Creator tip:</b> If your image generator struggles with lettering, generate the artwork without text and add accurate typography afterward in your design editor.</p></div>
        <div className="tag-list">{(post.tags||[]).map(tag=><span key={tag}>#{tag.replace(/\s+/g,"")}</span>)}</div>
        </div>
      </div>
      <aside className="article-sidebar"><div className="sidebar-card"><div className="sidebar-icon"><WandSparkles size={21}/></div><h3>Make it your own.</h3><p>Use the prompt as a base, then adjust details until the result fits your project.</p><button onClick={copy} className="sidebar-copy">{copied?<Check size={16}/>:<Copy size={16}/>} Copy prompt</button><small>Works as a starting point in compatible AI image tools.</small></div><div className="sidebar-card sidebar-index"><b>IN THIS GUIDE</b><a href="#top">Visual examples</a><a href="#top">Copy-ready prompt</a><a href="#top">Creator tips</a></div><div className="sidebar-mini"><span>KEEP EXPLORING</span><p>Good prompts are starting points. Your taste makes them yours.</p><Link href="/">Browse the library <ArrowRight size={14}/></Link></div></aside>
    </article>
    {related.length>0&&<section className="related-section"><div className="section-heading"><div><div className="section-kicker">KEEP CREATING</div><h2>More in <em>{post.category}.</em></h2></div><Link href="/" className="section-link">View all <ArrowRight size={15}/></Link></div><div className="prompt-grid">{related.map(p=><PromptCard key={p.id} post={p}/>)}</div></section>}
  </main>;
}
