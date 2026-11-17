'use client';
import { useState } from 'react';
import Link from 'next/link';
const TABS = {
  Learn: [['Turn notes into flashcards', '/prompts/category/students', 'Active recall from your own notes.'], ['Explain a topic, then quiz me', '/prompts/category/students', 'Tutor-style back-and-forth.'], ['Build an exam study plan', '/study-planner', 'Day-by-day schedule with rest days.']],
  Teach: [['Plan a 45-minute lesson', '/prompts/category/education', 'Objective, timings and checks.'], ['Write a quiz with explanations', '/prompts/category/education', 'Plausible options and answer key.'], ['Design a marking rubric', '/prompts/category/education', 'Clear descriptors for students.']],
  Write: [['Outline before you draft', '/prompts/category/writing', 'A clear structure first.'], ['Edit for clarity', '/prompts/category/writing', 'Keep your voice, cut the filler.'], ['Write a reader-friendly email', '/prompts/category/writing', 'One ask, polite tone.']],
  Plan: [['Plan the week from a messy list', '/prompts/category/productivity', 'Prioritise and schedule.'], ['Turn meeting notes into actions', '/prompts/category/productivity', 'Owners and deadlines.'], ['Break a goal into milestones', '/prompts/category/productivity', 'Weekly checkpoints.']],
  Career: [['Rewrite a resume bullet', '/prompts/category/careers', 'Action plus measurable result.'], ['Build your resume', '/resume-builder', '100 free templates.'], ['Practise a mock interview', '/prompts/category/careers', 'One question at a time.']],
};
export default function UseCaseTabs() {
  const [t, setT] = useState('Learn');
  return (
    <div>
      <div className="chips" role="tablist" aria-label="Use cases" style={{ justifyContent: 'flex-start', marginBottom: 16 }}>
        {Object.keys(TABS).map((k) => <button key={k} role="tab" aria-selected={t === k} className={`chip${t === k ? ' on' : ''}`} onClick={() => setT(k)} type="button">{k}</button>)}
      </div>
      <div className="grid g3" role="tabpanel">
        {TABS[t].map(([n, h, d]) => <Link key={n} href={h} className="card spot"><h3>{n}</h3><p>{d}</p><div className="ft"><span>{t}</span><span>Open →</span></div></Link>)}
      </div>
    </div>
  );
}
