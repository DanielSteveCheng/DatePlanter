export const upsertById = (list, item) =>
  list.some((existing) => existing.id === item.id)
    ? list.map((existing) => (existing.id === item.id ? item : existing))
    : [...list, item];

export const removeById = (list, id) => list.filter((item) => item.id !== id);
