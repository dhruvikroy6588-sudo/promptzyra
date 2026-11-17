import { buildMetadata } from '@/lib/seo';
import ToolShell from '@/components/v2/tools/ToolShell';
import PromptBuilder from '@/components/v2/tools/PromptBuilder';
export const metadata = buildMetadata({ title: 'Free AI Prompt Builder — Structure Better Prompts', description: 'Fill in role, task, context, format, tone and rules to build a clear, structured prompt for ChatGPT, Claude or Gemini. Free and private.', path: '/prompt-builder' });
export default function Page() {
  return <ToolShell title="AI prompt builder" path="/prompt-builder" intro="Good prompts say who the AI should be, what to do, what it needs to know and what the answer should look like. Fill the boxes you need and copy the result." about={<><h2>Why structure helps</h2><p>Vague prompts get vague answers. Naming a role, giving context and asking for a format reduces guesswork. The builder also adds a short instruction asking the AI to check its own work and list what you should verify.</p></>} faq={[{ q: 'Does it use AI?', a: 'No. It simply arranges your answers into a clear structure in your browser. Nothing is sent to a server.' }, { q: 'Which AI tools work with the output?', a: 'Any chat assistant, including ChatGPT, Claude, Gemini and Copilot.' }]}><PromptBuilder /></ToolShell>;
}
