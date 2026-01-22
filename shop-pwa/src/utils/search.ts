export function filterBySearch<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  if (!search.trim()) return items;

  const term = search.toLowerCase();

  return items.filter(item =>
    fields.some(field =>
      String(item[field] ?? "")
        .toLowerCase()
        .includes(term)
    )
  );
}
