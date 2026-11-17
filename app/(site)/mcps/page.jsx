import { ListPage, listMetadata } from '@/components/v2/CompPages';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }) { return listMetadata('mcps', await searchParams); }
export default function Page({ searchParams }) { return <ListPage type="mcps" searchParams={searchParams} />; }
