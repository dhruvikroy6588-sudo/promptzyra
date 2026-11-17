// Shared helpers for /api/admin/* routes (not a route itself: no route.js here).
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'dhruvikroy6588@gmail.com').toLowerCase();
export const R2_BASE = () => (process.env.R2_PUBLIC_BASE_URL || 'https://images.promptzyra.com').replace(/\/+$/, '');
export const KEY_RE = /^posts\/[0-9a-f-]{36}\.webp$/;

const BASE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
};

export function json(body, status = 200, extra = {}) {
  return NextResponse.json(body, { status, headers: { ...BASE_HEADERS, ...extra } });
}

export function methodNotAllowed(allowed) {
  return json({ error: `Method not allowed. Use ${allowed.join(' or ')}.` }, 405, { Allow: allowed.join(', ') });
}

// Verifies Bearer token -> Supabase user -> admin email. Returns { token, user, supabase } or { response }.
// `supabase` is a client that runs queries AS the caller (their JWT), so RLS applies. No service-role key anywhere.
export async function requireAdmin(request, action = 'use this endpoint') {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token || token.length > 4096) return { response: json({ error: `Sign in again before you ${action}.` }, 401) };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { response: json({ error: 'Supabase environment variables are missing.' }, 500) };
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || data?.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return { response: json({ error: 'Only the authorized admin can do this.' }, 403) };
  }
  return { token, user: data.user, supabase };
}

// Strict JSON body reader: content-type, size cap, parse errors -> 400.
export async function readJson(request, maxBytes = 64 * 1024) {
  const ct = (request.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('application/json')) return { response: json({ error: 'Content-Type must be application/json.' }, 415) };
  const len = Number(request.headers.get('content-length'));
  if (Number.isFinite(len) && len > maxBytes) return { response: json({ error: 'Request body too large.' }, 413) };
  let text;
  try { text = await request.text(); } catch { return { response: json({ error: 'Could not read request body.' }, 400) }; }
  if (text.length > maxBytes) return { response: json({ error: 'Request body too large.' }, 413) };
  let body;
  try { body = JSON.parse(text); } catch { return { response: json({ error: 'Invalid JSON body.' }, 400) }; }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { response: json({ error: 'JSON body must be an object.' }, 400) };
  return { body };
}

export async function getBucket() {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare');
  const { env } = await getCloudflareContext({ async: true });
  return env?.PROMPTZYRA_IMAGES || null;
}
