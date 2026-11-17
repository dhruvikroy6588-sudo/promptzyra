'use client';
import NavTree from './NavTree';

export default function Sidebar({ categories }) {
  return (
    <aside className="sb" aria-label="Sidebar">
      <NavTree categories={categories} idPrefix="sb" />
    </aside>
  );
}
