import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'How Promptzyra Works: Prompts, Photo Prompts, Resume Builder, Tools', description: 'A four-step guide to using Promptzyra: copy and adapt AI prompts, use photo prompts safely, build a resume in your browser and choose AI tools.', path: '/how-it-works' });
export default function Page() {
  return (<InfoPage title="How Promptzyra Works" path="/how-it-works" updated={null} lead="Four short guides to the main parts of the site. Everything is free and works without an account.">
    <h2>1. Using AI prompts</h2>
    <ol>
      <li>Browse the <Link href="/prompts">prompt library</Link> by category, audience or AI model, or use <Link href="/search">search</Link>.</li>
      <li>Open a prompt and read when to use it. Fill in the placeholders in square brackets, or use the <Link href="/prompt-builder">prompt builder</Link> to customise it.</li>
      <li>Copy it into your AI assistant (ChatGPT, Claude, Gemini, Copilot or another) and run it.</li>
      <li>Check the answer. Verify facts, ask follow-up questions to refine the result and adapt it to your own work.</li>
    </ol>
    <h2>2. Using photo prompts</h2>
    <ol>
      <li>Open the <Link href="/photo-prompts">photo prompts</Link> and choose a tool or subject that matches what you want to create.</li>
      <li>Check that you have the right to use the photo you plan to edit. Use only your own or permitted photos.</li>
      <li>Copy the prompt into your chosen AI image tool and add your photo if the tool asks for one.</li>
      <li>Review the result, adjust the wording and avoid sharing images that mislead or involve other people without their consent.</li>
    </ol>
    <h2>3. Building a resume</h2>
    <ol>
      <li>Pick a design from the <Link href="/resume-templates">resume templates</Link> or start in the <Link href="/resume-builder">resume builder</Link>.</li>
      <li>Fill in your details and edit sections in the live preview. Everything is saved in your browser only.</li>
      <li>Check it with the <Link href="/ats-resume-checker">ATS resume checker</Link> and write a matching note with the <Link href="/cover-letter-builder">cover letter builder</Link>.</li>
      <li>Download your resume as a PDF and keep a backup, since clearing browser data deletes saved work.</li>
    </ol>
    <h2>4. Choosing AI tools</h2>
    <ol>
      <li>Open the <Link href="/ai-tools">AI tools directory</Link> and filter by category or pricing type.</li>
      <li>Read each guide for who the tool is for, its strengths, limits and alternatives.</li>
      <li>Confirm current prices and privacy terms on the official site before you sign up.</li>
      <li>Try the free plan first, then match prompts from our library to the tool you pick. Browse the <Link href="/tools">free tools</Link> and <Link href="/study-planner">study planner</Link> too.</li>
    </ol>
    <h2>Good habits</h2>
    <ul><li>Never enter passwords, ID numbers or private information about other people into AI tools.</li><li>Follow your school or workplace rules on AI.</li><li>Read the <Link href="/disclaimer">disclaimer</Link> and <Link href="/ai-policy">AI policy</Link>, and check the <Link href="/faq">FAQ</Link> if you are stuck.</li></ul>
  </InfoPage>);
}
