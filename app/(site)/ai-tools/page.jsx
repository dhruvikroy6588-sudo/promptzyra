import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import ToolList from '@/components/v2/ToolList';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  return buildMetadata({ title: 'AI Tools Directory — Guides for Students, Teachers & Job Seekers', description: 'Browse AI tools by task: study, writing, research, careers, design and more. Plain-language guides with who each tool is for, pros, cons and alternatives.', path: '/ai-tools', noindex: !!(sp.q || sp.pricing || sp.sort) || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  return (<><div className="wrap"><h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>AI tools directory</h1><p className="muted prose">Find the right AI tool for the job. Each guide explains who it is for, how to start, strengths, limits and alternatives.</p></div><ToolList sp={sp} base="/ai-tools" /><JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }])} /></>);
}
