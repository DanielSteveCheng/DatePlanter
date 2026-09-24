import { useEffect, useRef, useState } from 'react';
import { Surface } from '../../sprites/Surface';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

const SAVE_DELAY_MS = 800;

export function NotesPad({ notes, onChange }) {
  const [draft, setDraft] = useState(notes);
  const editing = useRef(false);
  const save = useDebouncedCallback(onChange, SAVE_DELAY_MS);

  useEffect(() => {
    if (!editing.current) setDraft(notes);
  }, [notes]);

  return (
    <Surface slot="soil-panel" as="label" className="flex flex-col rounded-xl bg-soil-panel p-2">
      <span className="text-[10px] text-soil-text/90">Notes:</span>
      <textarea
        value={draft}
        placeholder="Date ideas, wishlists, reminders…"
        onFocus={() => (editing.current = true)}
        onBlur={() => (editing.current = false)}
        onChange={(event) => {
          setDraft(event.target.value);
          save(event.target.value);
        }}
        className="min-h-0 flex-1 resize-none bg-transparent text-xs text-soil-text outline-none placeholder:text-soil-text/50"
      />
    </Surface>
  );
}
