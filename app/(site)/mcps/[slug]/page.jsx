import { DetailPage, detailMetadata } from '@/components/v2/CompPages';
export const dynamic = 'force-dynamic';
export const generateMetadata = ({ params }) => detailMetadata('mcps', params);
export default function Page({ params }) { return <DetailPage type="mcps" params={params} />; }
