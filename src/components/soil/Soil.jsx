import { Surface } from '../../sprites/Surface';
import { NotesPad } from './NotesPad';

export function Soil({ notes, onNotesChange, onAddDate }) {
  return (
    <Surface slot="soil" className="grid h-28 shrink-0 grid-cols-[1fr_auto] gap-2.5 rounded-b-2xl bg-soil p-3">
      <NotesPad notes={notes} onChange={onNotesChange} />
      <Surface
        slot="add-date-button"
        as="button"
        type="button"
        onClick={onAddDate}
        className="w-20 rounded-xl bg-soil-panel text-xs font-semibold text-soil-text transition hover:brightness-105 active:scale-95"
      >
        ADD
        <br />
        DATE!
      </Surface>
    </Surface>
  );
}
