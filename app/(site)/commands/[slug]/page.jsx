import { DetailPage, detailMetadata } from '@/components/v2/CompPages';
export const dynamic = 'force-dynamic';
export const generateMetadata = ({ params }) => detailMetadata('commands', params);
export default function Page({ params }) { return <DetailPage type="commands" params={params} />; }
