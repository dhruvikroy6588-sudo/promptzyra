'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { NAV_GROUPS, CATEGORY_BASE, isActive } from './navigation';

// Shared by Sidebar and MobileDrawer.
// categories = { prompt:[{slug,name,n}], photo:[...], tool:[...], skill:[...], totals:{prompt,photo,tool,skill} }
export default function NavTree({ categories = {}, onNavigate, idPrefix = 'nt' }) {
  const pathname = usePathname() || '/';
  const totals = categories.totals || {};
  const [open, setOpen] = useState({});
  const keyOf = (it) => it.expand || (it.staticSub ? 'photo' : '');
  useEffect(() => {
    const next = {};
    NAV_GROUPS.forEach((g) => g.items.forEach((it) => { const k = keyOf(it); if (k && isActive(pathname, it.href)) next[k] = true; }));
    setOpen((o) => ({ ...o, ...next }));
  }, [pathname]);
  return (
    <nav aria-label="Site sections" className="sb-nav">
      {NAV_GROUPS.map((g) => (
        <div className="sb-group" key={g.label}>
          <div className="sb-label" id={`${idPrefix}-${g.label}`}><span>{g.label}</span></div>
          <ul aria-labelledby={`${idPrefix}-${g.label}`}>
            {g.items.map((it) => {
              const Icon = it.icon;
              const k = keyOf(it);
              const active = isActive(pathname, it.href);
              const subs = it.staticSub
                ? it.staticSub
                : it.expand ? (categories[it.expand] || []).map((c) => ({ name: c.name, href: `${CATEGORY_BASE[it.expand]}/${c.slug}`, n: c.n })) : [];
              const expandable = subs.length > 0;
              const isOpen = expandable && !!open[k];
              const listId = `${idPrefix}-list-${k}`;
              const total = it.count ? Number(totals[it.count]) || 0 : 0;
              return (
                <li key={it.href}>
                  <div className={`sb-row${active ? ' active' : ''}`}>
                    <Link href={it.href} className="sb-link" title={it.label} aria-current={pathname === it.href ? 'page' : undefined} onClick={() => { if (expandable) setOpen((o) => ({ ...o, [k]: true })); onNavigate && onNavigate(); }}>
                      <Icon size={18} aria-hidden="true" /><span className="sb-text">{it.label}</span>
                      {total > 0 && <em className="sb-count">{total}</em>}
                    </Link>
                    {expandable && (
                      <button type="button" className="sb-chev" aria-expanded={isOpen} aria-controls={listId} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${it.label}`} onClick={() => setOpen((o) => ({ ...o, [k]: !o[k] }))}>
                        <ChevronDown size={16} aria-hidden="true" className={isOpen ? 'rot' : ''} />
                      </button>
                    )}
                  </div>
                  {expandable && isOpen && (
                    <ul className="sb-sub" id={listId}>
                      {subs.map((c) => {
                        const ca = pathname === c.href;
                        return (
                          <li key={c.href}>
                            <Link href={c.href} className={`sb-sublink${ca ? ' active' : ''}`} aria-current={ca ? 'page' : undefined} onClick={onNavigate}>
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
