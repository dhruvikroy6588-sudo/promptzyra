import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata = {
  title: { default: "Promptzyra — Trending AI Prompts & Creative Studio", template: "%s | Promptzyra" },
  description: "Discover original viral AI photo prompts, trending ChatGPT ideas, creative tutorials and ready-to-copy prompts.",
  metadataBase: new URL("https://promptzyra.com"),
  openGraph: { title: "Promptzyra — Trending AI Prompts", description: "Discover and copy creative AI prompts.", type: "website" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
