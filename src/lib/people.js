export const MAX_PEOPLE = 2;

export function createPerson(name, { deviceId, location = null, now = new Date(), id = crypto.randomUUID() }) {
  return { id, name: name.trim(), deviceIds: [deviceId], location, createdAt: now.toISOString() };
}

export const withDevice = (person, deviceId) =>
  person.deviceIds?.includes(deviceId) ? person : { ...person, deviceIds: [...(person.deviceIds ?? []), deviceId] };

export const canAddPerson = (people) => people.length < MAX_PEOPLE;

export const findPerson = (people, id) => people.find((person) => person.id === id) ?? null;

export const partnerOf = (people, me) => (me ? people.find((person) => person.id !== me.id) ?? null : null);

export function validatePersonName(name) {
  return name.trim() ? null : 'Tell us your name';
}
