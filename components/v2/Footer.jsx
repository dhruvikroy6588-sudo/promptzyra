import Link from 'next/link';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/site';
import { FOOTER_GROUPS } from './navigation';
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-brand"><div className="logo">{SITE_NAME}</div><p className="muted small">Free, education-first AI prompts, tool guides and a resume builder that runs in your browser.</p><p className="small"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></div>
          {FOOTER_GROUPS.map((g) => <nav key={g.label} aria-label={g.label}><h4>{g.label}</h4><ul>{g.links.map(([n, h]) => <li key={h}><Link href={h}>{n}</Link></li>)}</ul></nav>)}
        </div>
        <p className="muted small ftr-b">© {new Date().getFullYear()} {SITE_NAME}. Prompts and guides are for learning; always review AI output before you rely on it. Product names belong to their owners.</p>
      </div>
    </footer>
  );
}
