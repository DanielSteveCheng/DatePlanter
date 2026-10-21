import { useMemo } from 'react';
import { isDevRecord } from '../lib/devFixtures';
import { sortNewestFirst } from '../lib/dates';

export function usePlantedDates(garden, dev) {
  const dates = useMemo(
    () => (dev.dates.length ? sortNewestFirst([...garden.dates, ...dev.dates]) : garden.dates),
    [garden.dates, dev.dates],
  );

  return {
    dates,
    saveDate: async (date) => (isDevRecord(date) ? dev.saveDate(date) : garden.saveDate(date)),
    deleteDate: async (id) => (isDevRecord({ id }) ? dev.deleteDate(id) : garden.deleteDate(id)),
  };
}
