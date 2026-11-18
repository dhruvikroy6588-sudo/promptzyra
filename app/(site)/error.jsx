'use client';
export default function SiteError({ reset }) {
  return (
    <main className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p className="muted">This page could not load. Please try again.</p>
      <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </main>
  );
}
