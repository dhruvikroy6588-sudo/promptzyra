import { requireAdmin, json, methodNotAllowed, getBucket, R2_BASE } from '../_auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const auth = await requireAdmin(request, 'upload images');
    if (auth.response) return auth.response;
    const ct = (request.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('multipart/form-data')) return json({ error: 'Content-Type must be multipart/form-data.' }, 415);
    const len = Number(request.headers.get('content-length'));
    if (Number.isFinite(len) && len > 9 * 1024 * 1024) return json({ error: 'Compressed image must be under 8 MB.' }, 413);
    let form;
    try { form = await request.formData(); } catch { return json({ error: 'Invalid upload body.' }, 400); }
    const file = form.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') return json({ error: 'Choose an image first.' }, 400);
    if (file.type !== 'image/webp') return json({ error: 'Image must be compressed to WebP before upload.' }, 415);
    if (file.size > 8 * 1024 * 1024) return json({ error: 'Compressed image must be under 8 MB.' }, 413);
    const bucket = await getBucket();
    if (!bucket) return json({ error: 'Cloudflare R2 binding PROMPTZYRA_IMAGES is missing. Add the binding in Cloudflare Worker settings and wrangler.jsonc, then redeploy.' }, 500);
    const keyName = `posts/${crypto.randomUUID()}.webp`;
    await bucket.put(keyName, await file.arrayBuffer(), { httpMetadata: { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' } });
    return json({ url: `${R2_BASE()}/${keyName}`, key: keyName, size: file.size });
  } catch (error) {
    return json({ error: error?.message || 'Image upload failed.' }, 500);
  }
}

const no = () => methodNotAllowed(['POST']);
export { no as GET, no as PUT, no as PATCH, no as DELETE };
