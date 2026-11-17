'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { isFullWidth } from './navigation';

// toolbar / footer are server elements passed as props. Sidebar layout everywhere except the
// resume editor + preview, which are full screen (slim toolbar only, no sidebar/footer).
export default function SiteShell({ categories, toolbar, footer, children }) {
  const pathname = usePathname() || '/';
  const full = isFullWidth(pathname);
  return (
    <div className={`app${full ? ' is-full' : ''}`}>
      {!full && <Sidebar categories={categories} />}
      <div className="app-main">
        {toolbar}
        <main id="main" className={full ? 'shell-full' : 'shell-main'}>{children}</main>
        {!full && footer}
      </div>
    </div>
  );
}
