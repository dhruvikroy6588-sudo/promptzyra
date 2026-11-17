import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Saved Prompts', description: 'Your saved prompts, photo prompts and tools, stored privately in this browser.', path: '/saved', noindex: true });
export default function SavedLayout({ children }) { return children; }
