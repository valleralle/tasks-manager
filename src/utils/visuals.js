export function computeConicGradient(data, totalEntries) {
  const segments = []
  let current = 0

  data.forEach(({ count, color }) => {
    if (count === 0) return
    const percentage = (count / Math.max(totalEntries, 1)) * 100
    segments.push(`${color} ${current}% ${current + percentage}%`)
    current += percentage
  })

  if (segments.length === 0) {
    return '#e5e7eb'
  }

  return `conic-gradient(${segments.join(', ')})`
}
