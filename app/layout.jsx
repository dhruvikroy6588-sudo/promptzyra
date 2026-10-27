import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata = {
  title: { default: "Promptzyra — Trending AI Photo Prompts & Creator Guides", template: "%s | Promptzyra" },
  description: "Explore original AI photo prompts, Gemini and ChatGPT image ideas, copy-ready creative cards, practical AI tutorials and SEO guides from Promptzyra.",
  metadataBase: new URL("https://promptzyra.com"),
  openGraph: { title: "Promptzyra — Trending AI Photo Prompts", description: "Explore visual ideas, copy prompts and learn practical AI workflows.", type: "website", url: "https://promptzyra.com" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
