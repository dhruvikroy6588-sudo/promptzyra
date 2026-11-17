'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
export default function SearchButton() {
  const [mac, setMac] = useState(true);
  useEffect(() => { try { setMac(!/Win|Linux|Android/i.test(navigator.platform || navigator.userAgent)); } catch (e) {} }, []);
  return <button type="button" className="search-btn tb-search" onClick={() => window.dispatchEvent(new Event('pz-open-search'))} aria-label="Search" aria-haspopup="dialog"><Search size={16} aria-hidden="true" /><span>Search prompts, tools, guides…</span><kbd>{mac ? '⌘K' : 'Ctrl K'}</kbd></button>;
}
