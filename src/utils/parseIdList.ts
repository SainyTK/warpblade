/** positive whole numbers from saved JSON, in order and without repeats; anything else is dropped */
export function parseIdList(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const ids = value.filter((id): id is number => Number.isInteger(id) && id > 0);
  return [...new Set(ids)];
}
