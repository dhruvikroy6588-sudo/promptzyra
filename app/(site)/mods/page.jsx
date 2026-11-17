import { ListPage, listMetadata } from '@/components/v2/CompPages';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }) { return listMetadata('mods', await searchParams); }
export default function Page({ searchParams }) { return <ListPage type="mods" searchParams={searchParams} />; }
