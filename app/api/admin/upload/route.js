import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';
const ADMIN_EMAIL = 'dhruvikroy6588@gmail.com';

export async function POST(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'Sign in again before uploading.' }, { status: 401 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: 'Supabase environment is not configured.' }, { status: 500 });
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || data?.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Only the authorized admin can upload images.' }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') return NextResponse.json({ error: 'Choose an image first.' }, { status: 400 });
    if (!file.type?.startsWith('image/')) return NextResponse.json({ error: 'Only image files are accepted.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Compressed image must be under 8 MB.' }, { status: 413 });

    const { env } = await getCloudflareContext({ async: true });
    const bucket = env.PROMPTZYRA_IMAGES;
    if (!bucket) return NextResponse.json({ error: 'R2 binding PROMPTZYRA_IMAGES is missing in the deployed Worker.' }, { status: 500 });
    const key = `posts/${crypto.randomUUID()}.webp`;
    await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' } });
    const base = (process.env.R2_PUBLIC_BASE_URL || 'https://images.promptzyra.com').replace(/\/$/, '');
    return NextResponse.json({ url: `${base}/${key}`, key });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Image upload failed.' }, { status: 500 });
  }
}
