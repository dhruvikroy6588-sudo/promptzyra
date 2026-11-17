import { redirect } from 'next/navigation';
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default function LegacyAdminRedirect() { redirect('/admin'); }
