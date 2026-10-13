export function parsePackingProgress(
  saved: string,
  itemIds: readonly string[],
): Set<string> {
  const parsed: unknown = JSON.parse(saved)
  if (
    !Array.isArray(parsed) ||
    !parsed.every((id) => typeof id === 'string' && itemIds.includes(id))
  ) {
    throw new Error('Invalid saved packing progress')
  }
  return new Set(parsed)
}
