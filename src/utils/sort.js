import { parseDateString } from './date'

const sortOrder = {
  status: {
    waiting: 0,
    passed: 1,
    failed: 2,
    skipped: 3,
  },
  priority: {
    low: 0,
    medium: 1,
    high: 2,
  },
}

export function compareEntries(a, b, sortConfig) {
  const direction = sortConfig.direction === 'asc' ? 1 : -1
  if (sortConfig.key === 'name') {
    return a.name.localeCompare(b.name) * direction
  }
  if (sortConfig.key === 'status') {
    return (sortOrder.status[a.status] - sortOrder.status[b.status]) * direction
  }
  if (sortConfig.key === 'priority') {
    return (sortOrder.priority[a.priority] - sortOrder.priority[b.priority]) * direction
  }
  if (sortConfig.key === 'lastModified') {
    return (parseDateString(a.lastModified) - parseDateString(b.lastModified)) * direction
  }
  return 0
}
