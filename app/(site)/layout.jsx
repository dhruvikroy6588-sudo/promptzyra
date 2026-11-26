import './v2.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/jetbrains-mono';
import Script from 'next/script';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, GA_ID } from '@/lib/site';
import Header from '@/components/v2/Header';
import Footer from '@/components/v2/Footer';
import CommandPalette from '@/components/v2/CommandPalette';
import CookieBanner from '@/components/v2/CookieBanner';
import JsonLd from '@/components/v2/JsonLd';
import SiteShell from '@/components/v2/SiteShell';
import { orgJsonLd, websiteJsonLd } from '@/lib/seo';
import * as data from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — AI prompts, tools directory & free resume builder`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  other: { "google-adsense-account": "ca-pub-7797090685469336" },
  openGraph: { siteName: SITE_NAME, type: 'website', url: SITE_URL, images: [{ url: '/og-default.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};
export const viewport = { themeColor: '#0b0d14' };

const themeInit = `try{var t=localStorage.getItem('pz-theme');document.documentElement.dataset.theme=t||'dark'}catch(e){document.documentElement.dataset.theme='dark'}try{document.documentElement.dataset.side=localStorage.getItem('pz-side')==='rail'?'rail':'wide'}catch(e){}`;

const shape = (cats, counts) => (cats || []).map((c) => ({ slug: c.slug, name: c.name, n: Number(counts?.[c.slug]) || 0 }));
const total = (m) => Number(m?.__total) || 0;
// skillCounts / getCategories('skill') may not exist yet: every call is guarded so the layout never breaks.
async function loadNav() {
  const safe = async (fn, fb) => { try { return (await fn()) ?? fb; } catch (e) { return fb; } };
  const [pc, ph, tc, sc, pn, tn, hn, sn, cn, crs] = await Promise.all([
    safe(() => data.getCategories('prompt'), []), safe(() => data.getCategories('photo'), []), safe(() => data.getCategories('tool'), []),
    safe(() => data.getCategories('skill'), []),
    safe(() => data.promptCounts(), {}), safe(() => data.toolCounts(), {}), safe(() => data.photoCounts(), {}),
    safe(() => (data.skillCounts ? data.skillCounts() : {}), {}),
    safe(() => (data.componentCounts ? data.componentCounts() : {}), {}),
    safe(() => (data.courseCounts ? data.courseCounts() : {}), {}),
  ]);
  return {
    prompt: shape(pc, pn), photo: shape(ph, hn), tool: shape(tc, tn), skill: shape(sc, sn),
    totals: { prompt: total(pn), photo: total(hn), tool: total(tn), skill: total(sn), courses: crs.__total || 0, agents: cn.agents || 0, commands: cn.commands || 0, settings: cn.settings || 0, hooks: cn.hooks || 0, mcps: cn.mcps || 0, mods: cn.mods || 0, plugins: cn.plugins || 0 },
  };
}

export default async function SiteLayout({ children }) {
  const categories = await loadNav();
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body suppressHydrationWarning>
        
        <SiteShell categories={categories} toolbar={<Header categories={categories} />} footer={<Footer />}>{children}</SiteShell>
        <CommandPalette />
        <CookieBanner />
        <JsonLd data={[orgJsonLd(), websiteJsonLd()]} />
        <Script id="ga-consent" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}try{var c=localStorage.getItem('pz-consent')||'unset';gtag('consent','default',{ad_storage:c==='yes'?'granted':'denied',analytics_storage:c==='yes'?'granted':'denied',ad_user_data:c==='yes'?'granted':'denied',ad_personalization:c==='yes'?'granted':'denied'})}catch(e){}`}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
      </body>
    </html>
  );
}
