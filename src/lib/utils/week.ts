import type { AppLocale } from '@/types'

export type WeekLocale = AppLocale
const WEEK_KEY_PATTERN = /^\d{4}-W\d{2}$/

function getMondayOfISOWeek(isoYear: number, isoWeek: number): Date {
  // Jan 4 is always in ISO W01
  const jan4 = new Date(isoYear, 0, 4)
  const dayOfWeek = jan4.getDay() || 7 // Mon=1 ... Sun=7
  const firstMonday = new Date(isoYear, 0, 4 - dayOfWeek + 1)
  const monday = new Date(firstMonday)
  monday.setDate(firstMonday.getDate() + (isoWeek - 1) * 7)
  return monday
}

export function weekKeyToDisplay(weekKey: string, locale: WeekLocale = 'ko'): string {
  const [yearStr, weekStr] = weekKey.split('-W')
  const isoYear = parseInt(yearStr)
  const isoWeek = parseInt(weekStr)

  const monday = getMondayOfISOWeek(isoYear, isoWeek)
  const year = monday.getFullYear()
  const month = monday.getMonth() + 1
  const weekOfMonth = Math.ceil(monday.getDate() / 7)

  if (locale === 'ja') {
    return `${year}年${month}月第${weekOfMonth}週`
  }

  if (locale === 'fr') {
    const monthLabel = new Intl.DateTimeFormat('fr', { month: 'long' }).format(new Date(year, month - 1, 1))
    return `Semaine ${weekOfMonth} de ${monthLabel} ${year}`
  }

  if (locale === 'de') {
    const monthLabel = new Intl.DateTimeFormat('de', { month: 'long' }).format(new Date(year, month - 1, 1))
    return `${weekOfMonth}. Woche im ${monthLabel} ${year}`
  }

  if (locale === 'en' || locale === 'en-GB') {
    const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(year, month - 1, 1))
    return `Week ${weekOfMonth} of ${monthLabel} ${year}`
  }

  return `${year}년 ${month}월 ${weekOfMonth}주차`
}

function getISOWeekAndYear(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum) // Thursday of this week
  const isoYear = d.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { week, year: isoYear }
}

export function dateToWeekKey(date: Date): string {
  const { week, year } = getISOWeekAndYear(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getCurrentWeekKey(): string {
  return dateToWeekKey(new Date())
}

export function getPreviousWeeks(weekKey: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addWeeks(weekKey, -(i + 1)))
}

export function isValidWeekKey(weekKey: string | null | undefined): weekKey is string {
  if (!weekKey || !WEEK_KEY_PATTERN.test(weekKey)) return false

  const [yearStr, weekStr] = weekKey.split('-W')
  const isoYear = Number(yearStr)
  const isoWeek = Number(weekStr)

  if (!Number.isInteger(isoYear) || !Number.isInteger(isoWeek)) return false
  if (isoWeek < 1 || isoWeek > 53) return false

  return dateToWeekKey(getMondayOfISOWeek(isoYear, isoWeek)) === weekKey
}

export function compareWeekKeys(a: string, b: string): number {
  const [aYearStr, aWeekStr] = a.split('-W')
  const [bYearStr, bWeekStr] = b.split('-W')

  const aMonday = getMondayOfISOWeek(Number(aYearStr), Number(aWeekStr))
  const bMonday = getMondayOfISOWeek(Number(bYearStr), Number(bWeekStr))

  return aMonday.getTime() - bMonday.getTime()
}

export function getWeekRange(startWeekKey: string, endWeekKey: string): string[] {
  if (compareWeekKeys(startWeekKey, endWeekKey) > 0) return []

  const weeks: string[] = []
  let currentWeekKey = startWeekKey

  while (compareWeekKeys(currentWeekKey, endWeekKey) <= 0) {
    weeks.push(currentWeekKey)
    currentWeekKey = addWeeks(currentWeekKey, 1)
  }

  return weeks
}

export function addWeeks(weekKey: string, n: number): string {
  const [yearStr, weekStr] = weekKey.split('-W')
  const isoYear = parseInt(yearStr)
  const isoWeek = parseInt(weekStr)

  const monday = getMondayOfISOWeek(isoYear, isoWeek)
  monday.setDate(monday.getDate() + n * 7)
  return dateToWeekKey(monday)
}
