export default function Loading() {
  return (
    <div className="wrap page-pad" role="status" aria-label="Loading">
      <div className="sk sk-title" />
      <div className="sk sk-line" style={{ width: '60%' }} />
      <div className="grid g3" style={{ marginTop: 28 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="sk sk-skel-card" />)}</div>
    </div>
  );
}
