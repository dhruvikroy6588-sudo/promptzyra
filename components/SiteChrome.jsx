import Link from "next/link";
import { Sparkles, Search, ArrowUpRight, Instagram, Github } from "lucide-react";

export function SiteHeader() {
  return <header className="site-header">
    <div className="nav-wrap">
      <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>prompt<span className="brand-accent">zyra</span><small>CREATE WHAT'S TRENDING</small></span></Link>
      <nav className="main-nav">
        <Link href="/#trending">Trending</Link><Link href="/#categories">Categories</Link><Link href="/#guides">SEO Guides</Link><Link href="/gemini-watermark-guide">Gemini Watermark Guide</Link>
      </nav>
      <Link className="nav-cta" href="/#trending">Explore prompts <ArrowUpRight size={15}/></Link>
    </div>
  </header>;
}
export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner">
    <Link href="/" className="brand footer-brand"><span className="brand-mark"><Sparkles size={18}/></span><span>prompt<span className="brand-accent">zyra</span><small>IDEAS INTO IMAGES</small></span></Link>
    <p>Useful prompts. Original ideas. Your next creative spark.</p>
    <div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/gemini-watermark-guide">Creator resources</Link><a href="mailto:dhruvikroy6588@gmail.com">Email</a></div>
    <small>© {new Date().getFullYear()} Promptzyra. Replace demo contact details before launch.</small>
  </div></footer>;
}
