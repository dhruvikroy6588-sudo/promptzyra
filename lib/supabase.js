import { createClient } from '@supabase/supabase-js';
let client;
export function getSupabase(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return null;
  if(!client) client=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}
// Single admin account. UX gate only: the database enforces it again through pz_is_admin() in Supabase.
export const ADMIN_EMAIL=(process.env.NEXT_PUBLIC_ADMIN_EMAIL||'dhruvikroy6588@gmail.com').toLowerCase();
