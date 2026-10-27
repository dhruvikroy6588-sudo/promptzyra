'use client';
import Link from "next/link";
import { ArrowUpRight, Copy, Clock3, Check, Share2, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function PromptCard({ post, featured = false }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  useEffect(() => { try { setLiked((JSON.parse(localStorage.getItem("pz_likes") || "[]")).includes(post.id)); } catch {} }, [post.id]);
  const toggleLike = (e) => { e.preventDefault(); e.stopPropagation(); try { const ids = JSON.parse(localStorage.getItem("pz_likes") || "[]"); const next = ids.includes(post.id) ? ids.filter(id => id !== post.id) : [...ids, post.id]; localStorage.setItem("pz_likes", JSON.stringify(next)); setLiked(next.includes(post.id)); } catch {} };
  const copyPrompt = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await navigator.clipboard.writeText(post.prompt || ""); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };
  const sharePrompt = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${location.origin}${detailHref}`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    } catch {}
  };
  const detailHref = (post.kind === "SEO guide" || post.kind === "Gemini watermark guide") ? `/blog/${post.slug}` : `/prompt/${post.slug}`;
  return <article className={`prompt-card ${featured ? "featured-card" : ""}`}>
    <Link href={detailHref} className="card-image-link" aria-label={`Read ${post.title}`}>
      <div className="card-image">{(post.thumbnail || post.image2 || post.image1) ? <img src={post.thumbnail || post.image2 || post.image1} alt={`${post.title} visual example`} loading="lazy"/> : <div className="card-image-empty">Image not uploaded</div>}
        <span className="image-tag">{post.category}</span><span className="image-open"><ArrowUpRight size={18}/></span>
      </div>
    </Link>
    <div className="card-body">
      <div className="card-meta"><span>{post.kind || post.category}</span><span className="dot"/> <span><Clock3 size={12}/>{post.readTime || "4 min read"}</span></div>
      <h3><Link href={detailHref}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <div className="card-bottom"><span className="prompt-ready"><span/> Copy-ready prompt</span><div className="card-actions"><button type="button" className={`card-action ${liked?"liked":""}`} onClick={toggleLike} aria-label={liked?"Unlike prompt":"Like prompt"}>{<Heart size={15} fill={liked?"currentColor":"none"}/>}<span>{liked?"Liked":"Like"}</span></button><button type="button" className="card-action" onClick={copyPrompt} aria-label="Copy prompt">{copied?<Check size={15}/>:<Copy size={15}/>}<span>{copied?"Copied":"Copy"}</span></button><button type="button" className="card-action" onClick={sharePrompt} aria-label="Share prompt"><Share2 size={15}/><span>Share</span></button><Link className="text-link" href={detailHref}>Open <ArrowUpRight size={15}/></Link></div></div>
    </div>
  </article>;
}
