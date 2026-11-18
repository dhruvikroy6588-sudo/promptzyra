'use client';
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en"><body style={{ fontFamily: 'system-ui,sans-serif', background: '#0c0e0d', color: '#ecefe9', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
      <div style={{ maxWidth: 480, padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Something went wrong</h1>
        <p style={{ color: '#9aa79e' }}>This page hit an error. Reload to try again. If it keeps happening, clear this site&apos;s data in your browser settings.</p>
        <button onClick={() => reset()} style={{ padding: '10px 18px', borderRadius: 10, border: 0, background: '#3ddc97', color: '#06130d', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
      </div>
    </body></html>
  );
}
