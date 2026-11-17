'use client';
import { useCallback, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

// Saved skills live in localStorage ('pz-saved-skills', JSON array of slugs). Independent of FavButton.
export const SKILL_SAVE_KEY = 'pz-saved-skills';
const EVT = 'pz-saved-skills-change';
export const readSavedSkills = () => { try { const v = JSON.parse(localStorage.getItem(SKILL_SAVE_KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch (e) { return []; } };
function write(list) {
  try { localStorage.setItem(SKILL_SAVE_KEY, JSON.stringify(list)); } catch (e) {}
  try { window.dispatchEvent(new Event(EVT)); } catch (e) {}
}
export function useSavedSkill(slug) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const sync = () => setList(readSavedSkills());
    sync(); window.addEventListener(EVT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
  }, []);
  const toggle = useCallback(() => { const cur = readSavedSkills(); write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]); }, [slug]);
  return { on: list.includes(slug), toggle };
}

// <SkillSave slug size withLabel />  - heart icon (cards) or labelled button (detail page)
export default function SkillSave({ slug, size = 18, withLabel = false }) {
  const { on, toggle } = useSavedSkill(slug);
  const label = on ? 'Remove skill from saved' : 'Save skill';
  if (withLabel) return <button type="button" className={`btn btn-sm sk-save${on ? ' on' : ''}`} aria-pressed={on} onClick={toggle}><Heart size={16} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />{on ? 'Saved' : 'Save'}</button>;
  return (
    <button type="button" className={`fav-btn${on ? ' on' : ''}`} aria-pressed={on} aria-label={label} title={label} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}>
      <Heart size={size} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
