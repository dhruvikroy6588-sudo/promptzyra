import { GraduationCap, Bot, Terminal, Settings, Link2, Plug, Braces, Wrench } from 'lucide-react';
const ICONS = { bot: Bot, terminal: Terminal, settings: Settings, link: Link2, plug: Plug, braces: Braces, wrench: Wrench, courses: GraduationCap };
// Page heading with the same icon as the sidebar and an always-visible item count.
export default function SectionTitle({ icon, count, noun, children }) {
  const Icon = ICONS[icon] || Wrench;
  return (
    <h1 className="pz-h1" style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
      <span className="pz-h1-ic" aria-hidden="true"><Icon size={26} /></span>
      <span>{children}</span>
      <span className="pz-h1-n" aria-label={`${count} ${noun}`}>{count} {noun}</span>
    </h1>
  );
}
