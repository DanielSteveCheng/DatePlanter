import { DATE_TYPES, toDateTimeInputValue } from './dates';

export const DEV_ID_PREFIX = 'dev-';
export const DEV_DATE_RANGE_DAYS = 60;
const DEV_PLACES = ['The Park', 'Umi Sushi', 'Downtown', 'The Beach', 'Home', 'Art Museum', 'Farmers Market'];
const DAY_MS = 24 * 60 * 60 * 1000;

export const isDevDate = (date) => Boolean(date?.id?.startsWith(DEV_ID_PREFIX));

const pick = (list, random) => list[Math.floor(random() * list.length)];

export function devPlace(index, center) {
  if (!center) return null;
  const angle = index * 2.4;
  const distance = 0.01 + index * 0.004;
  return {
    id: `dev-place-${index}`,
    label: DEV_PLACES[index],
    address: 'Developer place',
    latitude: center.latitude + Math.sin(angle) * distance,
    longitude: center.longitude + Math.cos(angle) * distance,
  };
}

const onTheHour = (date) => {
  const rounded = new Date(date);
  rounded.setMinutes(0, 0, 0);
  return rounded;
};

export function createDevDates(count, { startNumber = 1, now = new Date(), random = Math.random, center = null } = {}) {
  const stamp = now.toISOString();
  return Array.from({ length: count }, (_, i) => {
    const number = startNumber + i;
    const offsetMs = (random() * 2 - 1) * DEV_DATE_RANGE_DAYS * DAY_MS;
    const placeIndex = Math.floor(random() * DEV_PLACES.length);
    return {
      id: `${DEV_ID_PREFIX}${number}`,
      title: `Dev leaf ${number}`,
      where: DEV_PLACES[placeIndex],
      place: devPlace(placeIndex, center),
      when: toDateTimeInputValue(onTheHour(new Date(now.getTime() + offsetMs))),
      type: pick(DATE_TYPES, random).id,
      activities: '',
      notes: 'Temporary developer leaf. Not saved.',
      author: 'Developer mode',
      createdAt: stamp,
      updatedAt: stamp,
    };
  });
}
