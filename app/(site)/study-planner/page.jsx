import { buildMetadata } from '@/lib/seo';
import ToolShell from '@/components/v2/tools/ToolShell';
import StudyPlanner from '@/components/v2/tools/StudyPlanner';
export const metadata = buildMetadata({ title: 'Free Exam Study Planner — Day-by-Day Schedule', description: 'Enter your subjects, exam date and daily study hours to get a simple day-by-day plan with rest days and final revision. Free and private.', path: '/study-planner' });
export default function Page() {
  return <ToolShell title="Exam study planner" path="/study-planner" intro="Turn your subjects and exam date into a day-by-day plan with rest days and final revision. Adjust it to your own pace." about={<><h2>How the plan works</h2><p>Subjects rotate across days, each session follows learn → practise → recall, one day a week is lighter, and the final two days are for summaries and past questions. It is a starting structure, not a promise of results.</p></>} faq={[{ q: 'Is it saved?', a: 'No. Print or save as PDF to keep it.' }]}><StudyPlanner /></ToolShell>;
}
