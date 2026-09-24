import { useMemo } from 'react';
import { isDevDate } from '../lib/devDates';
import { sortNewestFirst } from '../lib/dates';

export function usePlantedDates(garden, dev) {
  const dates = useMemo(
    () => (dev.dates.length ? sortNewestFirst([...garden.dates, ...dev.dates]) : garden.dates),
    [garden.dates, dev.dates],
  );

  return {
    dates,
    saveDate: async (date) => (isDevDate(date) ? dev.saveDate(date) : garden.saveDate(date)),
    deleteDate: async (id) => (isDevDate({ id }) ? dev.deleteDate(id) : garden.deleteDate(id)),
  };
}
