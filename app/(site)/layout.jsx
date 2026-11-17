import './v2.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/jetbrains-mono';
import Script from 'next/script';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, GA_ID } from '@/lib/site';
import Header from '@/components/v2/Header';
import Footer from '@/components/v2/Footer';
import CursorFX from '@/components/v2/CursorFX';
import CommandPalette from '@/components/v2/CommandPalette';
import CookieBanner from '@/components/v2/CookieBanner';
import JsonLd from '@/components/v2/JsonLd';
import SiteShell from '@/components/v2/SiteShell';
import { orgJsonLd, websiteJsonLd } from '@/lib/seo';
import { getCategories, promptCounts, toolCounts, photoCounts } from '@/lib/data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — AI prompts, tools directory & free resume builder`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE_NAME, type: 'website', url: SITE_URL, images: [{ url: '/og-default.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};
export const viewport = { themeColor: '#0b0d14' };

const themeInit = `try{var t=localStorage.getItem('pz-theme');document.documentElement.dataset.theme=t||'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

const shape = (cats, counts) => (cats || []).map((c) => ({ slug: c.slug, name: c.name, n: Number(counts?.[c.slug]) || 0 }));
async function loadNav() {
  try {
    const [pc, ph, tc, pn, tn, hn] = await Promise.all([
      getCategories('prompt'), getCategories('photo'), getCategories('tool'), promptCounts(), toolCounts(), photoCounts(),
    ]);
    return { prompt: shape(pc, pn), photo: shape(ph, hn), tool: shape(tc, tn) };
  } catch (e) { return { prompt: [], photo: [], tool: [] }; }
}

export default async function SiteLayout({ children }) {
  const categories = await loadNav();
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>
        <CursorFX />
        <Header categories={categories} />
        <SiteShell categories={categories}>{children}</SiteShell>
        <Footer />
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
