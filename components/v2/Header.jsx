import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchButton from './SearchButton';
import MobileDrawer from './MobileDrawer';
import { HEADER_NAV } from './navigation';
export const NAV = HEADER_NAV;
export default function Header({ categories }) {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <MobileDrawer categories={categories} />
        <Link href="/" className="logo" aria-label="Promptzyra home"><span className="logo-mark"><Sparkles size={16} /></span>Promptzyra</Link>
        <nav className="nav" aria-label="Main">{HEADER_NAV.map(([n, h]) => <Link key={h} href={h}>{n}</Link>)}</nav>
        <div className="hdr-r"><SearchButton /><ThemeToggle /><Link href="/resume-builder/editor" className="btn btn-primary btn-sm hide-sm">Build resume</Link></div>
      </div>
    </header>
  );
}
