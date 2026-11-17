'use client';
import { ExternalLink } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
export default function CourseLink({ slug, url, label = 'Open the course', primary = true }) {
  const bump = () => { try { getSupabase()?.rpc('pz_bump_course_click', { p_slug: slug }).then(() => {}, () => {}); } catch (e) {} };
  return <a className={`btn ${primary ? 'btn-primary' : ''}`} href={url} target="_blank" rel="noopener noreferrer nofollow" onClick={bump}><ExternalLink size={16} aria-hidden="true" />{label}</a>;
}
