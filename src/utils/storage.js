import { formatDate } from './date'

export const STORAGE_KEY = 'tests-manager-entries'

export function generateDummyEntries(count) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    const statusOptions = ['waiting', 'passed', 'failed', 'skipped']
    const priorityOptions = ['low', 'medium', 'high']
    const status = statusOptions[index % statusOptions.length]
    const priority = priorityOptions[index % priorityOptions.length]
    const lastModified = formatDate(new Date(Date.now() - index * 60 * 60 * 1000))

    return {
      id,
      name: `Dummy Test ${id}`,
      status,
      priority,
      lastModified,
    }
  })
}

export function loadStoredEntries(defaultEntries) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultEntries
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return defaultEntries
    }
    return parsed
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return defaultEntries
  }
}

export function saveEntries(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore localStorage errors
  }
}
