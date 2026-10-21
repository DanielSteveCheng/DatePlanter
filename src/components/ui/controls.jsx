import { cn } from '../../lib/cn';

const INPUT_TONES = {
  card: 'bg-card-field text-card-text placeholder:text-card-text/60 focus:ring-card-accent',
  bubble: 'bg-black/5 text-bubble-ink placeholder:text-bubble-ink/50 focus:ring-bubble-ink/30',
};

const inputClass = (tone = 'card') => cn('w-full rounded-lg px-2 py-1 text-body outline-none focus:ring-2', INPUT_TONES[tone]);

export function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-0.5 text-label font-semibold uppercase tracking-wide text-card-text/80">
      {label}
      {children}
      {error && <span className="normal-case text-card-accent">{error}</span>}
    </label>
  );
}

export const TextInput = ({ tone, className, ...props }) => <input className={cn(inputClass(tone), className)} {...props} />;

export const TextArea = ({ tone, className, ...props }) => (
  <textarea className={cn(inputClass(tone), 'min-h-12 resize-none overflow-hidden field-sizing-content', className)} {...props} />
);

export const Select = ({ tone, className, children, ...props }) => (
  <select className={cn(inputClass(tone), className)} {...props}>
    {children}
  </select>
);

export const Checkbox = ({ children, ...props }) => (
  <label className="flex items-center gap-2 text-body">
    <input type="checkbox" className="size-3.5 accent-card-accent" {...props} />
    {children}
  </label>
);

export function Button({ variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'bg-card-accent text-card hover:brightness-105',
    ghost: 'bg-transparent text-card-text hover:bg-white/10',
    danger: 'bg-transparent text-card-accent hover:bg-white/10',
    bubble: 'bg-bubble-ink text-bubble-fill hover:brightness-110',
    'bubble-ghost': 'bg-transparent text-bubble-ink hover:bg-black/5',
  };
  return (
    <button
      type="button"
      className={cn('rounded-lg px-3 py-1 text-body font-bold transition disabled:opacity-50', variants[variant], className)}
      {...props}
    />
  );
}
