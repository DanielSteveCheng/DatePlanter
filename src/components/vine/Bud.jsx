import { Sprite } from '../../sprites/Sprite';
import { Surface } from '../../sprites/Surface';

export function Bud({ x, y, onClick }) {
  return (
    <button
      type="button"
      aria-label="Plant a date"
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-full outline-none"
      style={{ left: x, top: y }}
    >
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <Surface
          slot="bud-bubble"
          className="relative block whitespace-nowrap rounded-xl bg-bubble-fill px-2.5 py-1 text-bubble font-bold text-bubble-ink shadow-md"
        >
          Plant a Date!
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-bubble-fill" />
        </Surface>
      </span>
      <Sprite slot="bud" className="block w-10 origin-bottom animate-sway transition group-hover:brightness-110" />
    </button>
  );
}
