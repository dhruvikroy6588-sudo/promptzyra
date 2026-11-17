'use client';
import Link from 'next/link';
export default function Error({ reset }) {
  return (
    <div className="wrap page-pad err-box" role="alert">
      <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)' }}>Something went wrong</h1>
      <p className="muted">This page could not load. It is usually temporary.</p>
      <p><button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button> <Link href="/" className="btn">Home</Link> <Link href="/prompts" className="btn">Prompts</Link> <Link href="/ai-tools" className="btn">AI tools</Link></p>
    </div>
  );
}
