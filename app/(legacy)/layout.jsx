import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Script from "next/script";

export const metadata = {
  title: { default: "Promptzyra — Trending AI Photo Prompts & Creator Guides", template: "%s | Promptzyra" },
  description: "Explore original GPT image prompts, AI photo ideas, copy-ready creative cards, practical tutorials and SEO guides from Promptzyra.",
  metadataBase: new URL("https://promptzyra.com"),
  alternates: { canonical: "https://promptzyra.com" },
  twitter: { card: "summary_large_image", title: "Promptzyra — Trending AI Photo Prompts & Creator Guides" },
  openGraph: { title: "Promptzyra — Trending AI Photo Prompts", description: "Explore visual ideas, copy prompts and learn practical AI workflows.", type: "website", url: "https://promptzyra.com" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter />
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-MBDBKQHL54" strategy="afterInteractive" />
    <Script id="google-analytics-4" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-MBDBKQHL54');`}</Script>
  </body></html>;
}
