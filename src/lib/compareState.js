// Preserve both comparison-picker positions in shareable URL state.
// An empty first slot must not shift the second concern into the first picker.
export function parseCompare(value) {
  if (value == null || value === '') return []
  const slots = value.split(',').slice(0, 2)
  return slots.some(Boolean) ? slots : []
}

export function updateCompareSlot(compare, index, value) {
  const next = [compare?.[0] || '', compare?.[1] || '']
  if (index !== 0 && index !== 1) throw new RangeError('Unknown comparison slot')
  next[index] = value
  return next.some(Boolean) ? next : []
}

export function serializeCompare(compare) {
  return Array.isArray(compare) && compare.some(Boolean)
    ? compare.slice(0, 2).join(',')
    : null
}
