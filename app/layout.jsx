import "./globals.css";
import Script from "next/script";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-MBDBKQHL54';
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata = {
  title: { default: "Promptzyra — Trending AI Photo Prompts & Creator Guides", template: "%s | Promptzyra" },
  description: "Explore original AI photo prompts, Gemini and ChatGPT image ideas, copy-ready creative cards, practical AI tutorials and SEO guides from Promptzyra.",
  metadataBase: new URL("https://promptzyra.com"),
  openGraph: { title: "Promptzyra — Trending AI Photo Prompts", description: "Explore visual ideas, copy prompts and learn practical AI workflows.", type: "website", url: "https://promptzyra.com" },
  robots: { index: true, follow: true },
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {})
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <SiteHeader />{children}<SiteFooter />
    {gaId ? <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      `}</Script>
    </> : null}
  </body></html>;
}
