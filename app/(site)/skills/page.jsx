import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { skillCounts } from '@/lib/data';
import SkillList from '@/components/v2/SkillList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
const FAQ = [
  { q: 'What is a skill?', a: 'A skill is a small folder with a SKILL.md file that gives an AI assistant clear, reusable instructions for one kind of task, such as planning revision or giving feedback on an essay. Some skills also include a reference guide.' },
  { q: 'Are the skills free?', a: 'Yes. Every skill can be read, copied and downloaded for free, and adapted for study, teaching and personal projects.' },
  { q: 'How do I install a skill?', a: 'Download the zip or copy SKILL.md from the skill page. In Claude Code, put the folder in ~/.claude/skills/ or in .claude/skills/ inside a project. In Claude.ai, upload the zip where your plan allows custom skills. In other chat tools, paste SKILL.md as the instructions.' },
  { q: 'Can I edit a skill before using it?', a: 'Yes. A skill is plain text, so you can change the wording, level or examples to suit your class, course or goals before installing it.' },
  { q: 'Can AI output be wrong?', a: 'Yes. A skill guides the assistant but does not make it infallible. Check facts, numbers and sources before you rely on or submit anything an AI produced.' },
];
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const filtered = sp.q || sp.level || sp.audience || sp.sort;
  return buildMetadata({ title: 'AI Skills for Learning: Downloadable SKILL.md Packages', description: 'Free, reviewed skills for students, teachers and job seekers. Download a SKILL.md package or copy it into your AI assistant to study, teach, write and plan better.', path: '/skills', noindex: !!filtered || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const counts = await skillCounts();
  const n = counts.__total || 0;
  return (<>
    <div className="wrap sk-hero">
      <h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{n > 0 ? `${n} ${n === 1 ? 'skill' : 'skills'} for learning` : 'Skills for learning'}</h1>
      <p className="muted prose">Downloadable SKILL.md packages that teach an AI assistant how to help with studying, teaching, writing and planning.</p>
      <div className="prose intro-long muted">
        <p>A skill is a folder with a SKILL.md file: plain-text instructions an AI assistant can follow whenever a matching task comes up. Each skill on Promptzyra is original, written for education and reviewed by hand. Open one to read the full file, preview it, then download the zip or copy it into your tool.</p>
        <p>Browse by category, filter by level or audience, and read the file before you install it. Skills are plain text, so you can always edit them to fit your own course or goals.</p>
      </div>
    </div>
    <SkillList sp={sp} base="/skills" />
    <PromptFaq items={FAQ} title="Skills FAQ" />
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Skills', path: '/skills' }])} />
  </>);
}
