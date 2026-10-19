import { useState } from 'react';
import { PlaceSearch } from '../places/PlaceSearch';

const STATUS_TEXT = {
  searching: 'Searching…',
  empty: 'No places found',
  error: "Couldn't search right now",
};

export function LocationPicker({ location, onChange }) {
  const [query, setQuery] = useState('');

  return (
    <PlaceSearch
      label={location ? `Location: ${location.name}` : 'Location'}
      value={query}
      placeholder="Search a city"
      near={location}
      statusText={STATUS_TEXT}
      onType={setQuery}
      onChoose={(place) => {
        onChange({ name: place.label, latitude: place.latitude, longitude: place.longitude });
        setQuery('');
      }}
    />
  );
}
