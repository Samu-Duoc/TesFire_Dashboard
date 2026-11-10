const CHILE_TIME_ZONE = 'America/Santiago'

export const formatDate = (value, includeTime = false) => {
  if (!value) return 'Sin registro'
  const rawValue = String(value)
  const hasTime = rawValue.includes('T')
  // Date-only movement values have no timezone; noon UTC preserves their calendar day in Chile.
  const date = new Date(hasTime ? rawValue : `${rawValue}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CL', includeTime
    ? {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: CHILE_TIME_ZONE,
    }
    : { day: '2-digit', month: 'short', year: 'numeric', timeZone: CHILE_TIME_ZONE }).format(date)
}

export const parseAmount = (value) => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const normalized = String(value).replace(/[^\d,.-]/g, '').replace(/,(?=\d{3}(?:\D|$))/g, '').replace(',', '.')
  const amount = Number(normalized)
  return Number.isFinite(amount) ? Math.abs(amount) : 0
}

export const formatAmount = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
}).format(value)
