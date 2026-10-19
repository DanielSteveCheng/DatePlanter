import { Sprite } from '../../sprites/Sprite';
import { SpeechBubble } from '../ui/SpeechBubble';
import { spriteSize } from '../../sprites/sizes';

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
        <SpeechBubble slot="bud-bubble" tail="down" className="block whitespace-nowrap rounded-xl px-2.5 py-1 text-bubble font-bold">
          Plant a Date!
        </SpeechBubble>
      </span>
      <Sprite slot="bud" className="block origin-bottom animate-sway transition group-hover:brightness-110" style={spriteSize('bud')} />
    </button>
  );
}
