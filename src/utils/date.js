export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export function parseDateString(value) {
  const match = value.match(/^([0-9]{2})\.([0-9]{2})\.([0-9]{2}) ([0-9]{2}):([0-9]{2})$/)
  if (!match) return 0
  const [, day, month, year, hours, minutes] = match
  return new Date(2000 + Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)).getTime()
}
