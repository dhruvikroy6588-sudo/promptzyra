'use client';
import { Search } from 'lucide-react';
export default function SearchButton() {
  return <button className="search-btn" onClick={() => window.dispatchEvent(new Event('pz-open-search'))} aria-label="Search"><Search size={16} /><span>Search</span><kbd>⌘K</kbd></button>;
}
