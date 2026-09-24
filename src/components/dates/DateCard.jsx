import { Surface } from '../../sprites/Surface';

export function DateCard({ heading, onClose, children }) {
  return (
    <Surface
      slot="date-card"
      className="absolute left-3 top-3 max-h-[calc(100%-1.5rem)] z-10 flex w-[52%] flex-col rounded-2xl border-2 border-black/30 bg-card p-2.5 text-card-text shadow-lg"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-bold">{heading}</h2>
        <button type="button" aria-label="Close date" onClick={onClose} className="rounded px-1 text-xs hover:bg-white/10">
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">{children}</div>
    </Surface>
  );
}
