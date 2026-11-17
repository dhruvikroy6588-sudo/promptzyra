'use client';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
export default function StudyPlanner() {
  const today = new Date().toISOString().slice(0, 10);
  const [subjects, setSubjects] = useState('Maths, Physics, Chemistry');
  const [exam, setExam] = useState('');
  const [hours, setHours] = useState(3);
  const [rest, setRest] = useState(1);
  const plan = useMemo(() => {
    const subs = subjects.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    if (!subs.length || !exam) return [];
    const start = new Date(today); const end = new Date(exam); const days = Math.round((end - start) / 864e5);
    if (days < 1 || days > 120) return [];
    const rows = []; let k = 0;
    for (let d = 0; d < days; d++) {
      const dt = new Date(start.getTime() + d * 864e5);
      const isRest = rest > 0 && (d + 1) % 7 === 0; const last = d >= days - 2;
      const per = Math.max(0.5, Math.round((hours / Math.min(2, subs.length)) * 2) / 2);
      rows.push({ date: dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }), tasks: isRest ? ['Rest or light revision'] : last ? ['Revise summaries and past questions', 'Sleep early'] : [0, 1].slice(0, Math.min(2, subs.length)).map(() => `${subs[k++ % subs.length]} — ${per}h (learn → practise → recall)`) });
    }
    return rows;
  }, [subjects, exam, hours, rest, today]);
  return (<div><div className="panel grid g2"><div><label>Subjects (comma separated)</label><textarea rows={2} value={subjects} onChange={(e) => setSubjects(e.target.value)} /></div><div className="grid g2"><div><label>Exam date</label><input type="date" min={today} value={exam} onChange={(e) => setExam(e.target.value)} /></div><div><label>Hours per day</label><input type="number" min="1" max="12" value={hours} onChange={(e) => setHours(+e.target.value || 1)} /></div><div><label>Weekly rest day</label><select value={rest} onChange={(e) => setRest(+e.target.value)}><option value="1">Yes</option><option value="0">No</option></select></div></div></div>
    {plan.length > 0 ? <><div className="panel" style={{ marginTop: 16, overflowX: 'auto' }} id="plan"><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={{ textAlign: 'left', padding: 8 }}>Day</th><th style={{ textAlign: 'left', padding: 8 }}>Plan</th></tr></thead><tbody>{plan.map((r, i) => <tr key={i} style={{ borderTop: '1px solid var(--line)' }}><td style={{ padding: 8, whiteSpace: 'nowrap' }}>{r.date}</td><td style={{ padding: 8 }}>{r.tasks.join(' · ')}</td></tr>)}</tbody></table></div><button className="btn" style={{ marginTop: 12 }} onClick={() => window.print()}><Download size={16} />Print / save as PDF</button></> : <p className="muted" style={{ marginTop: 12 }}>Choose an exam date (up to 120 days away) to see your plan.</p>}</div>);
}
