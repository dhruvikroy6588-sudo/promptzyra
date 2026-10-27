"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import { Sparkles, Search, ArrowUpRight, Instagram, Github, Sun, Moon } from "lucide-react";

export function SiteHeader() {
  const [dark,setDark]=useState(false);
  useEffect(()=>{const saved=localStorage.getItem('promptzyra-theme');const prefers=window.matchMedia('(prefers-color-scheme: dark)').matches;const value=saved?saved==='dark':prefers;setDark(value);document.documentElement.dataset.theme=value?'dark':'light';},[]);
  function toggleTheme(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?'dark':'light';localStorage.setItem('promptzyra-theme',next?'dark':'light');}
  return <header className="site-header">
    <div className="nav-wrap">
      <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>prompt<span className="brand-accent">zyra</span><small>CREATE WHAT'S TRENDING</small></span></Link>
      <nav className="main-nav">
        <Link href="/">Prompt Library</Link><Link href="/blog">Blog</Link><Link href="/gemini-watermark-guide">Gemini Watermark Remover</Link>
      </nav>
      <div className="nav-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark?"Switch to light mode":"Switch to dark mode"}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><Link className="nav-cta" href="/#trending">Browse library <ArrowUpRight size={15}/></Link></div>
    </div>
  </header>;
}
export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner">
    <Link href="/" className="brand footer-brand"><span className="brand-mark"><Sparkles size={18}/></span><span>prompt<span className="brand-accent">zyra</span><small>IDEAS INTO IMAGES</small></span></Link>
    <p>Useful prompts. Original ideas. Your next creative spark.</p>
    <div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/advertising-disclosure">Advertising</Link><Link href="/editorial-policy">Editorial policy</Link><Link href="/gemini-watermark-guide">Creator resources</Link><a href="mailto:dhruvikroy6588@gmail.com">Email</a></div>
    <small>© {new Date().getFullYear()} Promptzyra. Replace demo contact details before launch.</small>
  </div></footer>;
}
