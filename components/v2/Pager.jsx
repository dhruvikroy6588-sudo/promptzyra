import Link from 'next/link';
export default function Pager({ page, total, pageSize, base, params = {} }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const href = (n) => { const sp = new URLSearchParams(); Object.entries(params).forEach(([k, v]) => v && sp.set(k, v)); if (n > 1) sp.set('page', n); const s = sp.toString(); return s ? `${base}?${s}` : base; };
  const nums = []; for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 2) nums.push(i);
  return <nav className="pager" aria-label="Pagination">{page > 1 && <Link className="btn btn-sm" rel="prev" href={href(page - 1)}>← Prev</Link>}{nums.map((n, i) => <Link key={n} className={`btn btn-sm${n === page ? ' btn-primary' : ''}`} href={href(n)} aria-current={n === page ? 'page' : undefined}>{nums[i - 1] && n - nums[i - 1] > 1 ? '… ' : ''}{n}</Link>)}{page < pages && <Link className="btn btn-sm" rel="next" href={href(page + 1)}>Next →</Link>}</nav>;
}
