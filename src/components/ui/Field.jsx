import { cn } from '../../lib/cn';

const inputClass =
  'w-full rounded-lg bg-card-field px-2 py-1 text-xs text-card-text placeholder:text-card-text/60 outline-none focus:ring-2 focus:ring-card-accent';

export function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-card-text/80">
      {label}
      {children}
      {error && <span className="normal-case text-card-accent">{error}</span>}
    </label>
  );
}

export const TextInput = ({ className, ...props }) => <input className={cn(inputClass, className)} {...props} />;

export const TextArea = ({ className, ...props }) => (
  <textarea className={cn(inputClass, 'resize-none', className)} rows={2} {...props} />
);

export const Select = ({ className, children, ...props }) => (
  <select className={cn(inputClass, className)} {...props}>
    {children}
  </select>
);

export function Button({ variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'bg-card-accent text-card hover:brightness-105',
    ghost: 'bg-transparent text-card-text hover:bg-white/10',
    danger: 'bg-transparent text-card-accent hover:bg-white/10',
  };
  return (
    <button
      type="button"
      className={cn('rounded-lg px-3 py-1 text-xs font-bold transition disabled:opacity-50', variants[variant], className)}
      {...props}
    />
  );
}
