import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchButton from './SearchButton';
import MobileDrawer from './MobileDrawer';
import { HEADER_NAV } from './navigation';
export const NAV = HEADER_NAV;

// Slim top toolbar rendered inside the main column (sticky). The logo only shows on <1024px and on full-screen pages.
export default function Header({ categories }) {
  return (
    <header className="hdr tb">
      <div className="tb-in">
        <MobileDrawer categories={categories} />
        <Link href="/" className="logo tb-logo" aria-label="Promptzyra home"><span className="logo-mark"><Sparkles size={16} /></span><span className="logo-t">Promptzyra</span></Link>
        <SearchButton />
        <div className="tb-r"><ThemeToggle /><Link href="/resume-builder/editor" className="btn btn-primary btn-sm tb-cta">Build resume</Link></div>
      </div>
    </header>
  );
}
