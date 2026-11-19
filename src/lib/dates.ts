import { parseBlogDate } from '@/content/blog/publication'

const formats = {
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  long: { month: 'long', day: 'numeric', year: 'numeric' },
  short: { month: 'short', day: 'numeric' },
  shortYear: { month: 'short', day: 'numeric', year: 'numeric' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

const formatters = Object.fromEntries(
  Object.entries(formats).map(([name, options]) => [
    name,
    new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }),
  ]),
) as Record<keyof typeof formats, Intl.DateTimeFormat>

const romanMonths = 'I II III IV V VI VII VIII IX X XI XII'.split(' ')

export function formatDate(
  date: string | Date,
  format: keyof typeof formats,
): string {
  return formatters[format].format(
    typeof date === 'string' ? parseBlogDate(date) : date,
  )
}

export function stampDate(date: string): string {
  const parsed = parseBlogDate(date)
  return `${parsed.getUTCDate()}·${romanMonths[parsed.getUTCMonth()]}`
}

export function offsetLabel(offsetDays: number): string {
  if (offsetDays === 0) return 'same day'
  const days = Math.abs(offsetDays)
  if (days === 1) return offsetDays < 0 ? 'the day before' : 'the next day'
  return `${days} days ${offsetDays < 0 ? 'earlier' : 'later'}`
}
