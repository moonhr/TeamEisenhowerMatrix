import type { AppLocale } from '@/types'
import { APP_LOCALES } from '@/types'

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'
export const LOCALE_HEADER_NAME = 'x-user-locale'
export const DEFAULT_LOCALE: AppLocale = 'ko'

const localeEntries = APP_LOCALES.map((locale) => ({
  locale,
  normalized: locale.toLowerCase(),
}))

export function matchSupportedLocale(value: string | null | undefined): AppLocale | null {
  if (!value) return null

  const normalizedValue = value.trim().toLowerCase()
  if (!normalizedValue) return null

  const exactMatch = localeEntries.find(({ normalized }) => normalized === normalizedValue)
  if (exactMatch) return exactMatch.locale

  const languageMatch = localeEntries.find(({ normalized }) => normalized === normalizedValue.split('-')[0])
  if (languageMatch) return languageMatch.locale

  return null
}

export function resolveLocaleFromAcceptLanguage(
  header: string | null | undefined,
  fallback: AppLocale = DEFAULT_LOCALE
): AppLocale {
  if (!header) return fallback

  const candidates = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim())
    .filter(Boolean)

  for (const candidate of candidates) {
    const matchedLocale = matchSupportedLocale(candidate)
    if (matchedLocale) return matchedLocale
  }

  return fallback
}

export function resolveRequestLocale({
  cookieLocale,
  headerLocale,
  requestLocale,
}: {
  cookieLocale?: string | null
  headerLocale?: string | null
  requestLocale?: string | null
}): AppLocale {
  return (
    matchSupportedLocale(cookieLocale) ??
    matchSupportedLocale(headerLocale) ??
    matchSupportedLocale(requestLocale) ??
    DEFAULT_LOCALE
  )
}
