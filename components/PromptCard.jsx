'use client';
import Link from "next/link";
import { ArrowUpRight, Clock3, Share2, Heart, Instagram, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function PromptCard({ post, featured = false }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => { try { setLiked((JSON.parse(localStorage.getItem("pz_likes") || "[]")).includes(post.id)); } catch {} }, [post.id]);
  const toggleLike = (e) => { e.preventDefault(); e.stopPropagation(); try { const ids = JSON.parse(localStorage.getItem("pz_likes") || "[]"); const next = ids.includes(post.id) ? ids.filter(id => id !== post.id) : [...ids, post.id]; localStorage.setItem("pz_likes", JSON.stringify(next)); setLiked(next.includes(post.id)); } catch {} };
  const sharePrompt = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${location.origin}${detailHref}`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url });
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`, "_blank", "noopener,noreferrer");
    } catch {}
  };
  const isBlog = ["blog", "Blog", "SEO guide", "Gemini watermark guide"].includes(post.kind);
  const detailHref = isBlog ? `/blog/${post.slug}` : `/prompt/${post.slug}`;
  return <article className={`prompt-card ${featured ? "featured-card" : ""}`}>
    <Link href={detailHref} className="card-image-link" aria-label={`Read ${post.title}`}>
      <div className="card-image">{(post.thumbnail || post.image2 || post.image1) ? <img src={post.thumbnail || post.image2 || post.image1} alt={`${post.title} visual example`} loading="lazy"/> : <div className="card-image-empty">Image not uploaded</div>}
        <span className="image-tag">{String(post.category || "AI Photo Trends").toLowerCase().includes("gemini") ? "GPT" : post.category}</span><span className="image-open"><ArrowUpRight size={18}/></span>
      </div>
    </Link>
    <div className="card-body">
      <h3><Link href={detailHref}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <div className="card-bottom"><div className="card-actions"><button type="button" className={`card-action ${liked?"liked":""}`} onClick={toggleLike} aria-label={liked?"Unlike prompt":"Like prompt"}><Heart size={15} fill={liked?"currentColor":"none"}/><span>{liked?"Liked":"Like"}</span></button><button type="button" className="card-action" onClick={sharePrompt} aria-label="Share prompt"><Share2 size={15}/><span>Share</span></button><button type="button" className="card-action social-action" onClick={(e)=>{e.preventDefault();e.stopPropagation();const url=`${location.origin}${detailHref}`;window.open(`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`,"_blank","noopener,noreferrer");}} aria-label="Share on WhatsApp"><MessageCircle size={15}/><span>WhatsApp</span></button><button type="button" className="card-action social-action" onClick={(e)=>{e.preventDefault();e.stopPropagation();window.open('https://www.instagram.com/','_blank','noopener,noreferrer');}} aria-label="Open Instagram"><Instagram size={15}/><span>Instagram</span></button><Link className="text-link" href={detailHref}>Open <ArrowUpRight size={15}/></Link></div></div>
    </div>
  </article>;
}
