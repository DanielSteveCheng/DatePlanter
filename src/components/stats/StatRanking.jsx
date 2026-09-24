const TOP_N = 5;

const percent = (count, total) => Math.round((count / total) * 100);

export function StatRanking({ title, rows }) {
  if (rows.length === 0) return null;
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = rows[0].count;

  return (
    <section className="flex flex-col gap-1">
      <h3 className="text-body font-bold text-card-accent">{title}</h3>
      <ol className="flex flex-col gap-1">
        {rows.slice(0, TOP_N).map((row) => (
          <li
            key={row.key}
            title={`${row.label}: ${row.count} of ${total} (${percent(row.count, total)}%)`}
            className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-1.5 text-body"
          >
            <span className="truncate">{row.label}</span>
            <span data-slot="stat-bar-track" className="h-2 rounded-full bg-stat-track">
              <span
                data-slot="stat-bar"
                className="block h-full rounded-full bg-stat-bar"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </span>
            <span className="text-right tabular-nums">{row.count}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
