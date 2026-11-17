import Link from 'next/link';
export const metadata = { title: 'Page not found', robots: { index: false } };
export default function NotFound() {
  return (<html lang="en"><body style={{ margin: 0, fontFamily: 'system-ui,sans-serif', background: '#0b0d14', color: '#eef0f6', minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
    <div><h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1><p style={{ color: '#9aa3b8' }}>This page doesn’t exist or has moved.</p>
      <p><Link href="/" style={{ color: '#8b7bff' }}>Home</Link> · <Link href="/prompts" style={{ color: '#8b7bff' }}>Prompts</Link> · <Link href="/ai-tools" style={{ color: '#8b7bff' }}>AI tools</Link> · <Link href="/resume-builder" style={{ color: '#8b7bff' }}>Resume builder</Link></p></div></body></html>);
}
