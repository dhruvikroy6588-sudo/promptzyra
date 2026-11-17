'use client';
import { useState } from 'react';
import CopyButton from '../CopyButton';
import { Download } from 'lucide-react';
const F = [['name', 'Your name'], ['role', 'Job title you apply for'], ['company', 'Company'], ['manager', 'Hiring manager (optional)'], ['years', 'Years / level of experience', 'e.g. three years of experience in customer support'], ['skills', 'Two or three relevant skills', 'e.g. clear writing, data analysis, stakeholder communication'], ['win', 'One achievement with a result', 'e.g. cut average response time by 30%'], ['why', 'Why this company', 'e.g. your focus on accessible education']];
export default function CoverLetter() {
  const [v, setV] = useState({ name: '', role: '', company: '', manager: '', years: '', skills: '', win: '', why: '' });
  const g = (k, d) => (v[k] || '').trim() || d;
  const text = `Dear ${v.manager.trim() || 'Hiring Manager'},

I am writing to apply for the ${g('role', '[Job title]')} position at ${g('company', '[Company]')}. With ${g('years', '[your experience]')}, I am confident I can contribute from my first weeks.

My strengths include ${g('skills', '[skills]')}. In my recent work, ${g('win', '[achievement and result]')}. I focus on results that can be measured and on communicating clearly with the people I work with.

I am drawn to ${g('company', '[Company]')} because of ${g('why', '[reason]')}. I would welcome the chance to discuss how I can help your team.

Thank you for your time and consideration.

Sincerely,
${g('name', '[Your name]')}`;
  const print = () => { const w = window.open('', '_blank'); if (!w) return; const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); w.document.write(`<title>${esc(g('name', 'Cover letter'))} - Cover letter</title><style>@page{size:A4;margin:25mm}body{font:12pt/1.55 Georgia,serif;white-space:pre-wrap;color:#111}</style><body>${esc(text)}</body>`); w.document.close(); w.focus(); setTimeout(() => w.print(), 300); };
  return (<div className="two"><div className="panel grid">{F.map(([k, l, p]) => <div key={k}><label>{l}</label><input value={v[k]} placeholder={p} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></div>)}</div>
    <div className="panel" style={{ position: 'sticky', top: 90 }}><h3>Preview</h3><div className="pre" style={{ fontFamily: 'Georgia,serif' }}>{text}</div><div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}><CopyButton text={text} label="Copy letter" /><button className="btn" onClick={print}><Download size={16} />Save as PDF</button></div><p className="muted small">Edit the result before sending so it sounds like you.</p></div></div>);
}
