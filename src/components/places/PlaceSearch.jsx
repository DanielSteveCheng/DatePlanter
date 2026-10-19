import { useState } from 'react';
import { usePlaceSearch } from '../../hooks/usePlaceSearch';
import { cn } from '../../lib/cn';
import { Field, TextInput } from '../ui/controls';

export function PlaceSearch({ label, value, placeholder, near, statusText, hint, onType, onChoose }) {
  const [typing, setTyping] = useState(false);
  const [active, setActive] = useState(0);
  const search = usePlaceSearch(typing ? value : '', near);
  const suggestions = typing ? search.results : [];

  function choose(place) {
    onChoose(place);
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

  const status = hint ?? (typing ? statusText[search.status] : null);

  return (
    <div className="flex flex-col gap-1">
      <Field label={label}>
        <TextInput
          value={value}
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-autocomplete="list"
          placeholder={placeholder}
          onChange={(event) => {
            onType(event.target.value);
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
