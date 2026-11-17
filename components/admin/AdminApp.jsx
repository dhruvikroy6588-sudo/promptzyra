'use client';
import { useCallback, useEffect, useState } from 'react';
import { getSupabase, ADMIN_EMAIL } from '@/lib/supabase';
import { PROMPT_FIELDS, TOOL_FIELDS, PHOTO_FIELDS, PHOTO_SIMPLE, SKILL_FIELDS, COMPONENT_FIELDS, COMP_CAT_OPTS, COURSE_FIELDS, COURSE_CAT_OPTS, STATUSES } from './common';
import Manager from './Manager';
import BlogManager from './BlogManager';
import Subscribers from './Subscribers';
import ToolSubmissions from './ToolSubmissions';
import Categories from './Categories';
import ImportPanel from './ImportPanel';
import { Loading, ErrorBanner } from './ui';
import { BLOG_KINDS } from '@/lib/blog-kinds';

const fmtBytes = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`);
const ago = (iso) => { if (!iso) return '—'; const m = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000)); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };

const COMP_TYPES = [['agents', 'Agents'], ['commands', 'Commands'], ['settings', 'Settings'], ['hooks', 'Hooks'], ['mcps', 'MCPs'], ['mods', 'Mods'], ['plugins', 'Plugins']];
function Components({ sb, cats, notify }) {
  const [t, setT] = useState('agents');
  return (<div><div className="bar" style={{ gap: 6, flexWrap: 'wrap' }}>{COMP_TYPES.map(([k, l]) => <button key={k} className={`btn sm ${t === k ? 'pri' : ''}`} onClick={() => setT(k)}>{l}</button>)}</div>
    <Manager key={t} sb={sb} table="pz_components" kind="component" label={COMP_TYPES.find((x) => x[0] === t)[1]} fields={COMPONENT_FIELDS} titleKey="name" path={`/${t}`} cats={cats} fixed={{ type: t }} notify={notify} /></div>);
}
function Overview({ sb, go }) {
  const [d, setD] = useState(null); const [err, setErr] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const cnt = async (q) => { const { count, error } = await q; if (error) throw new Error(error.message); return count || 0; };
      const head = (t) => sb.from(t).select('id', { count: 'exact', head: true });
      const statusCounts = async (t) => { const v = await Promise.all(STATUSES.map((s) => cnt(head(t).eq('status', s)))); return Object.fromEntries(STATUSES.map((s, i) => [s, v[i]])); };
      const postCounts = async () => {
        const now = new Date().toISOString(); const base = () => head('promptzyra_posts').in('kind', BLOG_KINDS);
        const [total, pub, sched] = await Promise.all([cnt(base()), cnt(base().eq('published', true)), cnt(base().eq('published', true).gt('publish_at', now))]);
        return { draft: total - pub, reviewed: 0, scheduled: sched, published: pub - sched };
      };
      const latest = async (t, col, label, tab, extra) => { let q = sb.from(t).select(`id,${col},updated_at,created_at`); if (extra) q = extra(q); const { data, error } = await q.order('updated_at', { ascending: false, nullsFirst: false }).limit(5); if (error) throw new Error(error.message); return (data || []).map((r) => ({ id: r.id, label, tab, title: r[col], at: r.updated_at || r.created_at })); };
      const [prompts, photo, tools, posts, subs, l1, l2, l3, l4, st] = await Promise.all([
        statusCounts('pz_prompts'), statusCounts('pz_photo_prompts'), statusCounts('pz_tools'), postCounts(), cnt(sb.from('pz_subscribers').select('id', { count: 'exact', head: true })),
        latest('pz_prompts', 'title', 'Prompt', 'prompts'), latest('pz_photo_prompts', 'title', 'Photo prompt', 'photo'), latest('pz_tools', 'name', 'AI tool', 'tools'), latest('promptzyra_posts', 'title', 'Blog', 'blog', (q) => q.in('kind', BLOG_KINDS)),
        sb.from('pz_settings').select('key,value').in('key', ['ads_txt', 'admin_checklist']),
      ]);
      if (st.error) throw new Error(st.error.message);
      const set = Object.fromEntries((st.data || []).map((r) => [r.key, r.value]));
      setD({ prompts, photo, tools, posts, subs, latest: [...l1, ...l2, ...l3, ...l4].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5), ads: !!(set.ads_txt?.text || '').trim(), sitemap: !!set.admin_checklist?.sitemap });
    } catch (e) { setErr(e.message || 'Could not load the overview.'); }
    setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  const toggleSitemap = async (v) => { const { error } = await sb.from('pz_settings').upsert({ key: 'admin_checklist', value: { sitemap: v } }); if (!error) setD((x) => ({ ...x, sitemap: v })); else setErr(error.message); };
  const cards = d ? [['Prompts', 'prompts', d.prompts], ['Photo Prompts', 'photo', d.photo], ['AI Tools', 'tools', d.tools], ['Blog', 'blog', d.posts]] : [];
  const reviewed = d ? d.prompts.reviewed + d.photo.reviewed + d.tools.reviewed : 0;
  return (<div><h1>Overview</h1>
    <ErrorBanner error={err} onRetry={load} />
    {loading && !d && <Loading what="Loading overview" />}
    {d && <>
      <div className="ad-grid g4">
        {cards.map(([n, k, o]) => <div key={k} className="ad-card ad-stat"><span>{n}</span><b>{o.published} live</b><span>{o.scheduled} scheduled · {o.reviewed} reviewed · {o.draft} drafts</span><div style={{ marginTop: 10 }}><button className="btn sm" onClick={() => go(k)}>Manage</button></div></div>)}
      </div>
      <div className="ad-grid g2">
        <div className="ad-card ad-stat"><span>Subscribers</span><b>{d.subs}</b><div style={{ marginTop: 10 }}><button className="btn sm" onClick={() => go('subscribers')}>View</button></div></div>
        <div className="ad-card"><h2>Quick links</h2><div className="bar" style={{ marginBottom: 0 }}><button className="btn sm" onClick={() => go('import')}>Import drafts</button><button className="btn sm" onClick={() => go('categories')}>Categories</button><button className="btn sm" onClick={() => go('settings')}>Settings</button><a className="btn sm" href="/" target="_blank" rel="noreferrer">View site ↗</a><a className="btn sm" href="/sitemap.xml" target="_blank" rel="noreferrer">sitemap.xml ↗</a></div></div>
      </div>
      <div className="ad-grid g2">
        <div className="ad-card"><h2>Latest 5 edits</h2>{d.latest.length ? <ul className="ad-list">{d.latest.map((r) => <li key={`${r.tab}${r.id}`}><button className="lnk" onClick={() => go(r.tab)}>{r.title || '(untitled)'}</button><span>{r.label} · {ago(r.at)}</span></li>)}</ul> : <p style={{ margin: 0, color: 'var(--mu)' }}>Nothing edited yet.</p>}</div>
        <div className="ad-card"><h2>Checklist</h2><ul className="ad-list">
          <li><span>{d.ads ? '✅' : '⬜'} ads.txt {d.ads ? 'is set' : 'not set yet (add after AdSense approval)'}</span><button className="lnk" onClick={() => go('settings')}>Settings</button></li>
          <li><label className="chk" style={{ margin: 0 }}><input type="checkbox" checked={d.sitemap} onChange={(e) => toggleSitemap(e.target.checked)} /> Sitemap submitted in Google Search Console</label></li>
          <li><span>{reviewed ? `📝 ${reviewed} reviewed item(s) waiting to be published or scheduled` : '✅ No reviewed items waiting'}</span></li>
        </ul></div>
      </div>
      <div className="ad-card"><h2>Daily publishing routine</h2><ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}><li>Import drafts (Import Drafts tab) or write new items.</li><li>Open an item, read and fix it, then <b>Save as reviewed</b>.</li><li>Use <b>Publish next 5 reviewed now</b> or <b>Schedule all reviewed</b> at 5 per day; scheduled items go live automatically.</li></ol><p style={{ margin: '10px 0 0', color: 'var(--mu)' }}>Publish only what you have read and improved. Thin, repeated or untouched AI text can get the whole site rejected by AdSense.</p></div>
    </>}
  </div>);
}

function StorageCleanup({ sb, notify }) {
  const [res, setRes] = useState(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const call = async (method, body) => {
    const { data } = await sb.auth.getSession(); const token = data?.session?.access_token; if (!token) throw new Error('Sign in again.');
    const r = await fetch(`/api/admin/r2${method === 'GET' ? '?action=orphans' : ''}`, { method, headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`); return j;
  };
  const scan = async () => { setBusy(true); setErr(''); try { setRes(await call('GET')); } catch (e) { setErr(e.message); } setBusy(false); };
  const clean = async () => {
    if (!res?.orphans?.length || !confirm(`Permanently delete ${res.orphans.length} unused image(s) (${fmtBytes(res.totalBytes)}) from R2? This cannot be undone.`)) return;
    setBusy(true); setErr(''); let n = 0, bad = 0;
    try {
      const keys = res.orphans.map((o) => o.key);
      for (let i = 0; i < keys.length; i += 500) { const j = await call('POST', { action: 'delete-orphans', keys: keys.slice(i, i + 500) }); n += j.deleted.length; bad += (j.failed || []).length; }
      notify(`${n} image(s) deleted${bad ? `, ${bad} failed` : ''}.`, !!bad); setRes(await call('GET'));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (<div className="ad-card"><h2>Storage cleanup (R2)</h2>
    <p style={{ color: 'var(--mu)' }}>Images are deleted from storage automatically when you delete or replace them. This finds any leftovers: files in the bucket that no prompt, tool, photo prompt or post uses any more. Images uploaded in the last hour are never listed.</p>
    <div className="bar"><button className="btn" disabled={busy} onClick={scan}>{busy ? 'Working…' : 'Scan for orphan images'}</button>{res?.orphans?.length > 0 && <button className="btn dng" disabled={busy} onClick={clean}>Delete orphans</button>}</div>
    <ErrorBanner error={err} onRetry={scan} />
    {res && <p style={{ margin: 0 }}>{res.orphans.length ? <><b>{res.orphans.length}</b> orphan image(s), <b>{fmtBytes(res.totalBytes)}</b> in total.</> : 'No orphan images found.'} <span style={{ color: 'var(--mu)' }}>({res.scanned} files in bucket, {res.referenced} in use)</span></p>}
    {res?.orphans?.length > 0 && <div style={{ maxHeight: 220, overflow: 'auto', marginTop: 8 }}><table><thead><tr><th>File</th><th>Size</th><th>Uploaded</th></tr></thead><tbody>{res.orphans.slice(0, 200).map((o) => <tr key={o.key}><td className="mono">{o.key}</td><td>{fmtBytes(o.size)}</td><td>{o.uploaded ? new Date(o.uploaded).toLocaleDateString('en-GB') : '—'}</td></tr>)}</tbody></table>{res.orphans.length > 200 && <p style={{ color: 'var(--mu)' }}>Showing first 200.</p>}</div>}
  </div>);
}

function Settings({ sb, notify }) {
  const [ads, setAds] = useState(''); const [hs, setHs] = useState({ prompts: true, tools: true, resume: true, blog: true });
  const [loading, setLoading] = useState(true); const [err, setErr] = useState('');
  const load = useCallback(async () => { setLoading(true); setErr(''); const { data, error } = await sb.from('pz_settings').select('key,value'); if (error) setErr(error.message); (data || []).forEach((r) => { if (r.key === 'ads_txt') setAds(r.value?.text || ''); if (r.key === 'home_sections') setHs((h) => ({ ...h, ...r.value })); }); setLoading(false); }, [sb]);
  useEffect(() => { load(); }, [load]);
  const save = async (key, value) => { const { error } = await sb.from('pz_settings').upsert({ key, value }); if (error) return notify(error.message, true); notify('Saved'); };
  return (<div><h1>Settings</h1>
    <ErrorBanner error={err} onRetry={load} />
    {loading ? <Loading what="Loading settings" /> : <>
    <div className="ad-card"><h2>ads.txt</h2><p style={{ color: 'var(--mu)' }}>After Google AdSense approves your site, paste the line they give you (e.g. <code>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code>). It is served at /ads.txt. Leave empty until approved.</p><textarea rows={4} className="mono" value={ads} onChange={(e) => setAds(e.target.value)} /><div style={{ marginTop: 8 }}><button className="btn pri" onClick={() => save('ads_txt', { text: ads })}>Save ads.txt</button></div></div>
    <div className="ad-card"><h2>Home page sections</h2><div className="chk">{[['prompts', 'Prompt library'], ['tools', 'AI tools'], ['resume', 'Resume builder'], ['blog', 'Blog']].map(([k, l]) => <label key={k}><input type="checkbox" checked={hs[k] !== false} onChange={(e) => setHs({ ...hs, [k]: e.target.checked })} />{l}</label>)}</div><div style={{ marginTop: 10 }}><button className="btn pri" onClick={() => save('home_sections', hs)}>Save</button></div></div>
    </>}
    <StorageCleanup sb={sb} notify={notify} />
    <div className="ad-card"><h2>Public settings only</h2><p style={{ margin: 0, color: 'var(--mu)' }}>The settings table is publicly readable. Never paste passwords or secret keys here.</p></div>
  </div>);
}

export default function AdminApp() {
  const sb = getSupabase();
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('overview');
  const [cats, setCats] = useState({ prompt: [], tool: [], blog: [], photo: [], skill: [] });
  const [note, setNote] = useState(null);
  const notify = useCallback((m, err) => { setNote({ m, err }); setTimeout(() => setNote(null), err ? 7000 : 3000); }, []);

  useEffect(() => { if (!sb) { setSession(null); return; } sb.auth.getSession().then(({ data }) => setSession(data.session || null)); const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s || null)); return () => data.subscription.unsubscribe(); }, [sb]);
  const email = session?.user?.email?.toLowerCase(); const ok = email === ADMIN_EMAIL;
  const loadCats = useCallback(async () => { if (!sb) return; const { data, error } = await sb.from('pz_categories').select('kind,slug,name,sort_order').order('sort_order').order('name'); const g = { prompt: [], tool: [], blog: [], photo: [], skill: [] }; if (error) notify(`Could not load categories: ${error.message}`, true); (data || []).forEach((r) => g[r.kind]?.push(r)); setCats(g); }, [sb, notify]);
  useEffect(() => { if (ok) loadCats(); }, [ok, loadCats]);

  if (!sb) return <div className="login"><div><h1>Supabase not configured</h1><p>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</p></div></div>;
  if (session === undefined) return <div className="login">Loading…</div>;
  if (!session) return <div className="login"><div className="ad-card" style={{ maxWidth: 380 }}><h1>Promptzyra Admin</h1><p style={{ color: 'var(--mu)' }}>Sign in with the authorised Google account.</p><button className="btn pri" onClick={() => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/admin` } })}>Continue with Google</button></div></div>;
  if (!ok) return <div className="login"><div className="ad-card" style={{ maxWidth: 420 }}><h1>Access denied</h1><p style={{ color: 'var(--mu)' }}>{session.user.email} is not authorised. Only one account can use this panel.</p><button className="btn" onClick={() => sb.auth.signOut()}>Sign out</button></div></div>;

  const NAV = [['overview', 'Overview'], ['prompts', 'Prompts'], ['photo', 'Photo Prompts'], ['skills', 'Skills'], ['courses', 'AI Courses'], ['components', 'Agents, MCPs & more'], ['tools', 'AI Tools'], ['blog', 'Blog'], ['categories', 'Categories'], ['import', 'Import Drafts'], ['subscribers', 'Subscribers'], ['submissions', 'Submissions'], ['settings', 'Settings']];
  return (<div className="ad-shell">
    <aside className="ad-side"><div className="ad-brand">Promptzyra<small>Admin · {email}</small></div>
      {NAV.map(([k, l]) => <button key={k} className={`ad-nav ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
      <div className="ad-side-foot"><a className="ad-nav" href="/" target="_blank" rel="noreferrer">View site ↗</a><button className="ad-nav" onClick={() => sb.auth.signOut()}>Sign out</button></div></aside>
    <main className="ad-main">
      {tab === 'overview' && <Overview sb={sb} go={setTab} />}
      {tab === 'prompts' && <Manager key="p" sb={sb} table="pz_prompts" kind="prompt" label="Prompts" fields={PROMPT_FIELDS} titleKey="title" path="/prompts" cats={cats.prompt} notify={notify} />}
      {tab === 'tools' && <Manager key="t" sb={sb} table="pz_tools" kind="tool" label="AI Tools" fields={TOOL_FIELDS} titleKey="name" path="/ai-tools" cats={cats.tool} notify={notify} />}
      {tab === 'skills' && <Manager key="sk" sb={sb} table="pz_skills" kind="skill" label="Skills" fields={SKILL_FIELDS} titleKey="name" path="/skills" cats={cats.skill} notify={notify} />}
      {tab === 'courses' && <Manager key="crs" sb={sb} table="pz_courses" kind="course" label="AI Courses" fields={COURSE_FIELDS} titleKey="title" path="/courses" cats={COURSE_CAT_OPTS} notify={notify} />}
      {tab === 'components' && <Components sb={sb} cats={COMP_CAT_OPTS} notify={notify} />}
      {tab === 'photo' && <Manager key="ph" sb={sb} table="pz_photo_prompts" kind="photo" label="Photo Prompts" fields={PHOTO_FIELDS} simple={PHOTO_SIMPLE} titleKey="title" path="/photo-prompts" cats={cats.photo} notify={notify} />}
      {tab === 'blog' && <BlogManager sb={sb} cats={cats.blog} notify={notify} token={session.access_token} onCatsChange={loadCats} />}
      {tab === 'subscribers' && <Subscribers sb={sb} notify={notify} />}
      {tab === 'submissions' && <ToolSubmissions sb={sb} notify={notify} cats={cats.tool} />}
      {tab === 'categories' && <Categories sb={sb} notify={notify} onChange={loadCats} />}
      {tab === 'import' && <ImportPanel sb={sb} notify={notify} />}
      {tab === 'settings' && <Settings sb={sb} notify={notify} />}
    </main>
    {note && <div className={`note ${note.err ? 'err' : ''}`}>{note.m}</div>}
  </div>);
}
