'use client';
import { useMemo, useState } from 'react';
const STOP = new Set('a an the and or of to in for on with at by from as is are be this that it your you we our will can have has had not but if their they them its into more most such other than also about across over under per via using use used work working role team teams years year experience ability able strong good great'.split(' '));
const words = (t) => (t.toLowerCase().match(/[a-z][a-z+#.\-]{1,}/g) || []).map((w) => w.replace(/[.\-]+$/, '')).filter((w) => w.length > 2 && !STOP.has(w));
export default function AtsChecker() {
  const [cv, setCv] = useState(''); const [jd, setJd] = useState('');
  const r = useMemo(() => {
    if (cv.trim().length < 80) return null;
    const checks = [];
    const add = (ok, label, tip) => checks.push({ ok, label, tip });
    add(/[\w.+-]+@[\w-]+\.[\w.]+/.test(cv), 'Email address found', 'Add a professional email address.');
    add(/(\+?\d[\d\s().-]{8,})/.test(cv), 'Phone number found', 'Add a phone number.');
    add(/experience|employment|work history/i.test(cv), 'Experience section heading', 'Use a clear heading such as “Experience”.');
    add(/education|degree|university|college/i.test(cv), 'Education section heading', 'Add an “Education” heading.');
    add(/skills|technologies|tools/i.test(cv), 'Skills section heading', 'Add a “Skills” heading.');
    const nums = (cv.match(/\d+%|\$\s?\d|\d+\+|\b\d{2,}\b/g) || []).length;
    add(nums >= 4, 'Measurable results (numbers, %, $)', 'Add numbers to your bullets: how many, how much, how fast.');
    const wc = cv.trim().split(/\s+/).length;
    add(wc >= 250 && wc <= 900, `Length is reasonable (${wc} words)`, 'Aim for roughly 300–700 words for most resumes.');
    add(!/[│┃■□●◆★☆►▶]/.test(cv), 'No unusual symbols that can break parsing', 'Replace decorative symbols with plain bullets.');
    let kw = null;
    if (jd.trim().length > 60) {
      const freq = {}; words(jd).forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([w]) => w);
      const have = new Set(words(cv)); const hit = top.filter((w) => have.has(w)); const miss = top.filter((w) => !have.has(w));
      kw = { score: Math.round((hit.length / Math.max(1, top.length)) * 100), hit, miss };
    }
    const base = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
    return { checks, base, kw };
  }, [cv, jd]);
  return (<div><div className="grid g2"><div><label>Paste your resume text</label><textarea rows={14} value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Copy the text from your resume and paste it here…" /></div><div><label>Paste the job description (optional)</label><textarea rows={14} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job post to check keyword match…" /></div></div>
    {r ? <div className="grid g2" style={{ marginTop: 16 }}>
      <div className="panel"><h3>Format and content checks — {r.base}%</h3><ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>{r.checks.map((c) => <li key={c.label}>{c.ok ? '✅' : '⚠️'} {c.label}{!c.ok && <div className="muted small">{c.tip}</div>}</li>)}</ul></div>
      <div className="panel"><h3>Keyword match{r.kw ? ` — ${r.kw.score}%` : ''}</h3>{r.kw ? <><p className="small muted">Most-used words in the job post that appear in your resume:</p><div className="chips" style={{ justifyContent: 'flex-start' }}>{r.kw.hit.map((w) => <span key={w} className="tag ac">{w}</span>)}</div><p className="small muted" style={{ marginTop: 14 }}>Missing — add only the ones that are true for you:</p><div className="chips" style={{ justifyContent: 'flex-start' }}>{r.kw.miss.map((w) => <span key={w} className="tag">{w}</span>)}</div></> : <p className="muted">Paste a job description to see keyword gaps.</p>}</div></div> : <p className="muted" style={{ marginTop: 12 }}>Paste at least a few lines of resume text to see results.</p>}
    <p className="disclose" style={{ marginTop: 16 }}>This is a simple, private check that runs in your browser. It is not the same as any specific employer’s ATS and does not guarantee a result.</p></div>);
}
