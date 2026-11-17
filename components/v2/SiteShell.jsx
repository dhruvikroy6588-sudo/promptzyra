'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { isFullWidth } from './navigation';

export default function SiteShell({ categories, children }) {
  const pathname = usePathname() || '/';
  if (isFullWidth(pathname)) return <main id="main" className="shell-full">{children}</main>;
  return (
    <div className="shell">
      <Sidebar categories={categories} />
      <main id="main" className="shell-main">{children}</main>
    </div>
  );
}
