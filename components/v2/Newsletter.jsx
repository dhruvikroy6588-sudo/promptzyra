'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
export default function Newsletter({ source = 'site', title = 'Get new prompts and guides by email', text = 'A short weekly email with new prompts, tool guides and resume tips. No spam, unsubscribe any time.' }) {
  const [email, setEmail] = useState(''); const [st, setSt] = useState('idle'); const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault(); const sb = getSupabase();
    if (!sb) { setSt('err'); setMsg('Newsletter is not available right now.'); return; }
    setSt('busy');
    const { error } = await sb.from('pz_subscribers').insert({ email: email.trim().toLowerCase(), source });
    if (!error) { setSt('ok'); setMsg('Thanks! You are subscribed.'); setEmail(''); }
    else if (String(error.code) === '23505') { setSt('ok'); setMsg('You are already subscribed.'); }
    else { setSt('err'); setMsg('Please enter a valid email address.'); }
  };
  return (
    <section className="panel spot" aria-labelledby="nl-h" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Mail size={20} /><h2 id="nl-h" style={{ margin: 0, fontSize: '1.3rem' }}>{title}</h2></div>
      <p className="muted" style={{ margin: 0 }}>{text}</p>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input type="email" required placeholder="you@example.com" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
        <button className="btn btn-primary" disabled={st === 'busy'} type="submit">{st === 'busy' ? 'Subscribing…' : 'Subscribe'}</button>
      </form>
      {msg && <p role="status" className="small" style={{ margin: 0, color: st === 'err' ? 'var(--warn)' : 'var(--ac2)' }}>{msg}</p>}
      <p className="muted small" style={{ margin: 0 }}>By subscribing you agree to our <a href="/privacy-policy">privacy policy</a>.</p>
    </section>
  );
}
