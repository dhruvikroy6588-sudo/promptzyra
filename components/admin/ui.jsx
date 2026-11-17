'use client';
export function Loading({ what = 'Loading' }) { return <p className="ad-load" role="status"><span className="spin" aria-hidden="true" /> {what}…</p>; }
export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return <div className="ad-err" role="alert"><span>{String(error)}</span>{onRetry && <button className="btn sm" onClick={onRetry}>Retry</button>}</div>;
}
