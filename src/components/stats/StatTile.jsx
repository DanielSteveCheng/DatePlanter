export function StatTile({ label, value }) {
  return (
    <div data-slot="stat-tile" className="rounded-lg bg-stat-tile px-2 py-1.5">
      <p className="text-stat-value font-bold tabular-nums">{value}</p>
      <p className="text-label uppercase tracking-wide text-card-text/70">{label}</p>
    </div>
  );
}
