import { getSetting } from '@/lib/data';
export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSetting('ads_txt', { text: '' });
  const text = (typeof s === 'string' ? s : s?.text || '').trim();
  return new Response(text ? text + '\n' : '# ads.txt — add your AdSense line from Admin → Settings after approval\n', { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
