export function Section({ title, className, children }) {
  return (
    <section className={className ?? 'flex flex-col gap-1.5'}>
      <h3 className="text-body font-bold text-card-accent">{title}</h3>
      {children}
    </section>
  );
}
