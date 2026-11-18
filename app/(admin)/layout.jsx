import '@fontsource-variable/inter';
import '@/components/admin/admin.css';
export const metadata = {
  title: 'Promptzyra Admin',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true, nocache: true } },
  referrer: 'no-referrer',
};
export const viewport = { width: 'device-width', initialScale: 1 };
export default function AdminLayout({ children }) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head><meta name="google" content="notranslate" /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
