import { useState } from 'react';
import { usePlaceSearch } from '../../hooks/usePlaceSearch';
import { cn } from '../../lib/cn';
import { Field, TextInput } from '../ui/Field';

const STATUS_TEXT = {
  searching: 'Searching…',
  empty: 'No match found. It will be saved as typed.',
  error: "Couldn't search right now. It will be saved as typed.",
};

export function LocationField({ where, place, near, onChange }) {
  const [typing, setTyping] = useState(false);
  const [active, setActive] = useState(0);
  const search = usePlaceSearch(typing && !place ? where : '', near);
  const suggestions = typing ? search.results : [];

  function choose(next) {
    onChange({ where: next.label, place: next });
    setTyping(false);
  }

  function onKeyDown(event) {
    if (suggestions.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(suggestions[active]);
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setTyping(false);
    }
  }

  const status = place ? 'Pinned on the map' : typing ? STATUS_TEXT[search.status] : null;

  return (
    <div className="flex flex-col gap-1">
      <Field label="Where">
        <TextInput
          value={where}
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-autocomplete="list"
          placeholder="Search a place, or type anything"
          onChange={(event) => {
            onChange({ where: event.target.value, place: null });
            setTyping(true);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setTyping(false)}
        />
      </Field>
      {suggestions.length > 0 && (
        <ul role="listbox" data-slot="place-suggestions" className="flex flex-col gap-0.5 rounded-lg bg-black/15 p-0.5">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(suggestion)}
              onMouseEnter={() => setActive(index)}
              className={cn('cursor-pointer rounded-md px-1.5 py-1', index === active && 'bg-white/15')}
            >
              <span className="block text-body font-semibold">{suggestion.label}</span>
              <span className="block truncate text-label text-card-text/70">{suggestion.address}</span>
            </li>
          ))}
        </ul>
      )}
      {status && <p className="text-label text-card-text/70">{status}</p>}
    </div>
  );
}
