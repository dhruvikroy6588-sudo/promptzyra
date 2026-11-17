'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { NAV_GROUPS, CATEGORY_BASE, isActive } from './navigation';

// Shared by Sidebar and MobileDrawer. categories = { prompt:[{slug,name,n}], photo:[...], tool:[...] }
export default function NavTree({ categories = {}, onNavigate, idPrefix = 'nt' }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState({});
  useEffect(() => {
    const next = {};
    NAV_GROUPS.forEach((g) => g.items.forEach((it) => { if (it.expand && isActive(pathname, it.href)) next[it.expand] = true; }));
    setOpen((o) => ({ ...o, ...next }));
  }, [pathname]);
  return (
    <nav aria-label="Site sections" className="sb-nav">
      {NAV_GROUPS.map((g) => (
        <div className="sb-group" key={g.label}>
          <div className="sb-label" id={`${idPrefix}-${g.label}`}>{g.label}</div>
          <ul aria-labelledby={`${idPrefix}-${g.label}`}>
            {g.items.map((it) => {
              const Icon = it.icon;
              const active = isActive(pathname, it.href);
              const cats = it.expand ? categories[it.expand] || [] : [];
              const expandable = !!it.expand && cats.length > 0;
              const isOpen = expandable && !!open[it.expand];
              const listId = `${idPrefix}-list-${it.expand}`;
              return (
                <li key={it.href}>
                  <div className={`sb-row${active ? ' active' : ''}`}>
                    <Link href={it.href} className="sb-link" aria-current={pathname === it.href ? 'page' : undefined} onClick={() => { if (expandable) setOpen((o) => ({ ...o, [it.expand]: true })); onNavigate && onNavigate(); }}>
                      <Icon size={17} aria-hidden="true" /><span>{it.label}</span>
                    </Link>
                    {expandable && (
                      <button type="button" className="sb-chev" aria-expanded={isOpen} aria-controls={listId} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${it.label} categories`} onClick={() => setOpen((o) => ({ ...o, [it.expand]: !o[it.expand] }))}>
                        <ChevronDown size={16} aria-hidden="true" className={isOpen ? 'rot' : ''} />
                      </button>
                    )}
                  </div>
                  {expandable && isOpen && (
                    <ul className="sb-sub" id={listId}>
                      {cats.map((c) => {
                        const href = `${CATEGORY_BASE[it.expand]}/${c.slug}`;
                        const ca = pathname === href;
                        return (
                          <li key={c.slug}>
                            <Link href={href} className={`sb-sublink${ca ? ' active' : ''}`} aria-current={ca ? 'page' : undefined} onClick={onNavigate}>
                              <span>{c.name}</span>{c.n > 0 && <em>{c.n}</em>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
