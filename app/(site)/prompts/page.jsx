import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import PromptList from '@/components/v2/PromptList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
const FAQ = [
  { q: 'Are these prompts free to use?', a: 'Yes. Every prompt in the library is free to copy, adapt and use for study, teaching, work and personal projects.' },
  { q: 'Which AI tools do the prompts work with?', a: 'Each prompt lists the models we expect it to suit, such as ChatGPT, Claude, Gemini, Copilot, Grok and DeepSeek. Most text prompts also work in other chat assistants with small changes.' },
  { q: 'How do I customize a prompt?', a: 'Replace the {{variables}} in the prompt box with your own topic, level or audience, then copy it. The customizer on each prompt page lets you fill the blanks before copying.' },
  { q: 'What are image prompts?', a: 'Image prompts are written for image generators such as Midjourney. Use the Image prompts tab to see them, along with an example result where one is available.' },
  { q: 'Can AI output be wrong?', a: 'Yes. Always check facts, numbers and sources before you rely on or submit anything an AI produced, especially for school, legal, medical or financial use.' },
];
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const filtered = sp.q || sp.model || sp.level || sp.sort || sp.type || sp.sub || sp.audience;
  return buildMetadata({ title: 'AI Prompt Library for Students, Teachers & Job Seekers', description: 'Browse original, reviewed AI prompts for studying, teaching, writing, careers and everyday productivity. Copy, customize and use with ChatGPT, Claude or Gemini.', path: '/prompts', noindex: !!filtered || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  return (<>
    <div className="wrap"><h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>AI prompt library</h1>
      <div className="prose intro-long muted">
        <p>Promptzyra's prompt library is a collection of original, human-reviewed prompts for students, teachers, job seekers and anyone who wants to get more from AI assistants. Each prompt explains when to use it, how to adapt it to your own situation and what to check in the answer before you rely on it.</p>
        <p>Browse by category, filter by AI model, audience or level, or switch to the image prompts tab for generators such as Midjourney. Copy a prompt, fill in the blanks and paste it into your favorite AI tool.</p>
      </div></div>
    <PromptList sp={sp} base="/prompts" />
    <PromptFaq items={FAQ} />
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }])} />
  </>);
}
