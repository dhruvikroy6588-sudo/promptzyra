'use client';
import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export default function ToolSubmitForm({ cats = [] }) {
  const [f, setF] = useState({ name: '', website_url: '', category: '', description: '', contact_email: '', company: '' });
  const [st, setSt] = useState('idle'); const [errs, setErrs] = useState({}); const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const validate = () => {
    const e = {}; const name = f.name.trim(), url = f.website_url.trim(), mail = f.contact_email.trim();
    if (name.length < 2 || name.length > 120) e.name = 'Enter the tool name (2–120 characters).';
    if (!/^https?:\/\/[^\s/$.?#][^\s]*\.[^\s]{2,}$/i.test(url) || url.length < 8 || url.length > 300) e.website_url = 'Enter the full website address starting with http:// or https:// (up to 300 characters).';
    if (f.description.length > 1500) e.description = 'Please keep the description under 1500 characters.';
    if (mail && (!EMAIL_RE.test(mail) || mail.length > 200)) e.contact_email = 'Enter a valid email address or leave this empty.';
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate(); setErrs(e); setMsg('');
    if (Object.keys(e).length) return;
    if (f.company.trim()) { setSt('ok'); return; } // honeypot: pretend success
    const sb = getSupabase();
    if (!sb) { setSt('err'); setMsg('Submissions are not available right now. Please try again later or use the contact page.'); return; }
    setSt('busy');
    const { error } = await sb.from('pz_tool_submissions').insert({ name: f.name.trim(), website_url: f.website_url.trim(), category: f.category, description: f.description.trim(), contact_email: f.contact_email.trim(), status: 'new' });
    if (error) { setSt('err'); setMsg('Sorry, we could not save your submission. Please check the fields and try again.'); return; }
    setSt('ok');
  };
  if (st === 'ok') return <div className="panel td-ok" role="status"><h2 style={{ marginTop: 0 }}>Thanks — we review every submission before listing</h2><p className="muted" style={{ marginBottom: 0 }}>Submitting does not guarantee a listing. If we add the tool, you will find it in the <a href="/ai-tools">directory</a>.</p></div>;
  const E = ({ k }) => (errs[k] ? <p className="td-err" id={`e-${k}`} role="alert">{errs[k]}</p> : null);
  return (
    <form onSubmit={submit} className="panel td-form" noValidate>
      <div><label htmlFor="ts-name">Tool name *</label><input id="ts-name" value={f.name} onChange={set('name')} maxLength={120} required aria-invalid={!!errs.name} aria-describedby={errs.name ? 'e-name' : undefined} /><E k="name" /></div>
      <div><label htmlFor="ts-url">Website URL *</label><input id="ts-url" type="url" inputMode="url" placeholder="https://example.com" value={f.website_url} onChange={set('website_url')} maxLength={300} required aria-invalid={!!errs.website_url} aria-describedby={errs.website_url ? 'e-website_url' : undefined} /><E k="website_url" /></div>
      <div><label htmlFor="ts-cat">Category</label><select id="ts-cat" value={f.category} onChange={set('category')}><option value="">Not sure</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <div><label htmlFor="ts-desc">Short description</label><textarea id="ts-desc" rows={5} value={f.description} onChange={set('description')} maxLength={1500} placeholder="What does it do and who is it for?" aria-describedby={errs.description ? 'e-description' : undefined} /><div className="muted small" style={{ textAlign: 'right' }}>{f.description.length}/1500</div><E k="description" /></div>
      <div><label htmlFor="ts-mail">Contact email <span className="muted">(optional)</span></label><input id="ts-mail" type="email" value={f.contact_email} onChange={set('contact_email')} maxLength={200} autoComplete="email" aria-invalid={!!errs.contact_email} aria-describedby={errs.contact_email ? 'e-contact_email' : undefined} /><E k="contact_email" /></div>
      <div className="td-hp" aria-hidden="true"><label htmlFor="ts-company">Company</label><input id="ts-company" name="company" tabIndex={-1} autoComplete="off" value={f.company} onChange={set('company')} /></div>
      <button className="btn btn-primary" type="submit" disabled={st === 'busy'}>{st === 'busy' ? 'Sending…' : 'Submit tool'}</button>
      {msg && <p className="td-err" role="alert" style={{ margin: 0 }}>{msg}</p>}
      <p className="muted small" style={{ margin: 0 }}>Submitting does not guarantee a listing. We never sell placements.</p>
    </form>
  );
}
