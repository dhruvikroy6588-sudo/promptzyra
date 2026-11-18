'use client';
import { Component, useEffect, useState } from 'react';
import AdminApp from './AdminApp';

// The admin panel is client-only: render it after mount so browser extensions / translators that edit the
// page before hydration cannot cause a hydration crash, and show a readable error (with a reset) if anything throws.
const resetSite = () => {
  try { Object.keys(localStorage).filter((k) => k.startsWith('sb-')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
  try { Object.keys(sessionStorage).forEach((k) => sessionStorage.removeItem(k)); } catch (e) {}
  location.reload();
};
class Boundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (<div className="login"><div className="ad-card" style={{ maxWidth: 520 }}>
      <h1>Admin could not load</h1>
      <p style={{ color: 'var(--mu)' }}>Something broke on this browser. Usually a stale sign-in or a browser extension. Try the reset below, then sign in again.</p>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{String(this.state.err?.message || this.state.err)}</pre>
      <button className="btn pri" onClick={resetSite}>Reset sign-in and reload</button></div></div>);
  }
}
export default function AdminGate() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  if (!ready) return <div className="login">Loading…</div>;
  return <Boundary><AdminApp /></Boundary>;
}
