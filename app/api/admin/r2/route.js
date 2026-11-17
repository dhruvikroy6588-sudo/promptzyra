import { requireAdmin, readJson, json, methodNotAllowed, getBucket, R2_BASE, KEY_RE } from '../_auth';

export const dynamic = 'force-dynamic';

const MIN_AGE_MS = 60 * 60 * 1000; // never treat images uploaded in the last hour as orphans (editor may still be open)
const MAX_URLS = 200;
const MAX_KEYS = 500;
// [table, column to order by for stable pagination]
const SCAN_TABLES = [['promptzyra_posts', 'id'], ['pz_prompts', 'id'], ['pz_photo_prompts', 'id'], ['pz_tools', 'id'], ['pz_settings', 'key']];
const FIND_RE = /posts\/[0-9a-f-]{36}\.webp/g;

// Every R2 key mentioned anywhere in any column (thumbnail, image1/2, example_image_url, image_url,
// logo_url, og_image, post content, settings...) of the tables above. Runs with the caller's JWT.
// Any query error throws, so a failed scan can never be mistaken for "nothing is referenced".
async function referencedKeys(supabase) {
  const refs = new Set();
  const PAGE = 1000;
  for (const [table, orderCol] of SCAN_TABLES) {
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase.from(table).select('*').order(orderCol).range(from, from + PAGE - 1);
      if (error) throw new Error(`Could not scan ${table}: ${error.message}`);
      for (const row of data || []) for (const m of JSON.stringify(row).match(FIND_RE) || []) refs.add(m);
      if (!data || data.length < PAGE) break;
    }
  }
  return refs;
}

async function listAll(bucket) {
  const out = [];
  let cursor;
  for (let i = 0; i < 200; i++) {
    const res = await bucket.list({ prefix: 'posts/', limit: 1000, cursor });
    for (const o of res.objects || []) out.push(o);
    if (!res.truncated) return out;
    cursor = res.cursor;
  }
  throw new Error('Too many objects to scan in one request.');
}

async function deleteKeys(bucket, keys) {
  const deleted = []; const failed = [];
  for (let i = 0; i < keys.length; i += 100) {
    const chunk = keys.slice(i, i + 100);
    try { await bucket.delete(chunk); deleted.push(...chunk); }
    catch (e) { failed.push(...chunk.map((key) => ({ key, reason: e?.message || 'delete failed' }))); }
  }
  return { deleted, failed };
}

export async function GET(request) {
  try {
    const auth = await requireAdmin(request, 'scan storage');
    if (auth.response) return auth.response;
    const action = new URL(request.url).searchParams.get('action');
    if (action !== 'orphans') return json({ error: 'Unknown action. Use ?action=orphans.' }, 400);
    const bucket = await getBucket();
    if (!bucket) return json({ error: 'Cloudflare R2 binding PROMPTZYRA_IMAGES is missing.' }, 500);
    const [objects, refs] = await Promise.all([listAll(bucket), referencedKeys(auth.supabase)]);
    const now = Date.now();
    const orphans = [];
    let totalBytes = 0;
    for (const o of objects) {
      if (!KEY_RE.test(o.key) || refs.has(o.key)) continue;
      const up = o.uploaded ? new Date(o.uploaded) : null;
      if (up && now - up.getTime() < MIN_AGE_MS) continue;
      orphans.push({ key: o.key, size: o.size || 0, uploaded: up ? up.toISOString() : null });
      totalBytes += o.size || 0;
    }
    orphans.sort((a, b) => String(a.uploaded).localeCompare(String(b.uploaded)));
    return json({ orphans, totalBytes, scanned: objects.length, referenced: refs.size });
  } catch (e) {
    return json({ error: e?.message || 'Scan failed.' }, 500);
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request, 'delete images');
    if (auth.response) return auth.response;
    const parsed = await readJson(request, 128 * 1024);
    if (parsed.response) return parsed.response;
    const { action } = parsed.body;
    const bucket = await getBucket();
    if (!bucket) return json({ error: 'Cloudflare R2 binding PROMPTZYRA_IMAGES is missing.' }, 500);

    if (action === 'delete') {
      const { urls } = parsed.body;
      if (!Array.isArray(urls) || !urls.length || urls.length > MAX_URLS) return json({ error: `urls must be an array of 1-${MAX_URLS} strings.` }, 400);
      const base = `${R2_BASE()}/`;
      const skipped = []; const keys = new Set();
      for (const u of urls) {
        if (typeof u !== 'string' || u.length > 500) return json({ error: 'Every url must be a string under 500 characters.' }, 400);
        if (!u.startsWith(base)) { skipped.push({ url: u, reason: 'not an R2 image URL' }); continue; }
        const key = u.slice(base.length);
        if (!KEY_RE.test(key)) { skipped.push({ url: u, reason: 'unexpected key format' }); continue; }
        keys.add(key);
      }
      let todo = [...keys];
      if (todo.length) {
        const refs = await referencedKeys(auth.supabase);
        todo = todo.filter((k) => { if (refs.has(k)) { skipped.push({ url: base + k, reason: 'still used by another record' }); return false; } return true; });
      }
      const { deleted, failed } = todo.length ? await deleteKeys(bucket, todo) : { deleted: [], failed: [] };
      return json({ deleted, skipped, failed });
    }

    if (action === 'delete-orphans') {
      const { keys } = parsed.body;
      if (!Array.isArray(keys) || !keys.length || keys.length > MAX_KEYS) return json({ error: `keys must be an array of 1-${MAX_KEYS} strings.` }, 400);
      const unique = new Set();
      for (const k of keys) {
        if (typeof k !== 'string' || !KEY_RE.test(k)) return json({ error: 'Every key must look like posts/<uuid>.webp.' }, 400);
        unique.add(k);
      }
      const refs = await referencedKeys(auth.supabase);
      const skipped = []; const todo = [];
      for (const k of unique) {
        if (refs.has(k)) { skipped.push({ key: k, reason: 'referenced' }); continue; }
        const head = await bucket.head(k);
        if (!head) { skipped.push({ key: k, reason: 'not found' }); continue; }
        if (head.uploaded && Date.now() - new Date(head.uploaded).getTime() < MIN_AGE_MS) { skipped.push({ key: k, reason: 'uploaded less than 1 hour ago' }); continue; }
        todo.push(k);
      }
      const { deleted, failed } = todo.length ? await deleteKeys(bucket, todo) : { deleted: [], failed: [] };
      return json({ deleted, skipped, failed });
    }

    return json({ error: "Unknown action. Use 'delete' or 'delete-orphans'." }, 400);
  } catch (e) {
    return json({ error: e?.message || 'Request failed.' }, 500);
  }
}

const no = () => methodNotAllowed(['GET', 'POST']);
export { no as PUT, no as PATCH, no as DELETE };
