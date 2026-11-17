'use client';
import { useState } from 'react';
import CopyButton from '../CopyButton';
const F = [['role', 'Role the AI should take', 'e.g. a patient chemistry tutor'], ['task', 'Task', 'e.g. explain how buffers work and quiz me'], ['context', 'Context / background', 'e.g. I am a first-year student, I know basic acid–base ideas'], ['format', 'Output format', 'e.g. short explanation, then 5 quiz questions with answers'], ['tone', 'Tone and length', 'e.g. friendly, under 300 words'], ['rules', 'Rules / things to avoid', 'e.g. do not use jargon without defining it']];
export default function PromptBuilder() {
  const [v, setV] = useState({});
  const out = [
    v.role && `Act as ${v.role}.`, v.task && `Task: ${v.task}.`, v.context && `Context: ${v.context}.`, v.format && `Output format: ${v.format}.`, v.tone && `Tone and length: ${v.tone}.`, v.rules && `Rules: ${v.rules}.`,
    'If anything is unclear, ask me up to three questions before answering. Then check your answer for mistakes and say what I should verify.',
  ].filter(Boolean).join('\n\n');
  return (<div className="two"><div className="panel grid">{F.map(([k, l, p]) => <div key={k}><label>{l}</label><textarea rows={2} value={v[k] || ''} placeholder={p} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></div>)}</div>
    <div className="panel" style={{ position: 'sticky', top: 90 }}><h3>Your prompt</h3><div className="pre">{out}</div><div style={{ marginTop: 12 }}><CopyButton text={out} /></div></div></div>);
}
