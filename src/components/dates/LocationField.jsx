import { PlaceSearch } from '../places/PlaceSearch';

const STATUS_TEXT = {
  searching: 'Searching…',
  empty: 'No match found. It will be saved as typed.',
  error: "Couldn't search right now. It will be saved as typed.",
};

export function LocationField({ where, place, near, onChange }) {
  return (
    <PlaceSearch
      label="Where"
      value={where}
      placeholder="Search a place, or type anything"
      near={near}
      statusText={STATUS_TEXT}
      hint={place ? 'Pinned on the map' : null}
      onType={(text) => onChange({ where: text, place: null })}
      onChoose={(chosen) => onChange({ where: chosen.label, place: chosen })}
    />
  );
}
