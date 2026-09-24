import { useState } from 'react';
import { searchPlaces } from '../../lib/weather';
import { Button, Field, TextInput } from '../ui/Field';

export function LocationPicker({ location, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');

  async function search(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setStatus('Searching…');
    try {
      const places = await searchPlaces(query.trim());
      setResults(places);
      setStatus(places.length ? '' : 'No places found');
    } catch (error) {
      setStatus(error.message);
    }
  }

  function choose(place) {
    onChange(place);
    setResults([]);
    setQuery('');
  }

  return (
    <Field label={`Location${location ? `: ${location.name}` : ''}`}>
      <div className="flex gap-1">
        <TextInput
          value={query}
          placeholder="Search a city"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(e)}
        />
        <Button onClick={search}>Find</Button>
      </div>
      {status && <span className="normal-case">{status}</span>}
      {results.length > 0 && (
        <ul className="flex flex-col gap-0.5 normal-case">
          {results.map((place) => (
            <li key={`${place.latitude},${place.longitude}`}>
              <button type="button" onClick={() => choose(place)} className="w-full rounded px-1 text-left text-body hover:bg-white/10">
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
