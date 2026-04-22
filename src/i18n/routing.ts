import { defineRouting } from 'next-intl/routing'
import { APP_LOCALES, type AppLocale } from '@/types'

export const locales: AppLocale[] = [...APP_LOCALES]

export const defaultLocale: AppLocale = 'ko'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'never',
  localeDetection: true,
  localeCookie: {
    name: 'NEXT_LOCALE',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  },
})

export function hasLocale(locale: string | undefined): locale is AppLocale {
  return locale !== undefined && locales.includes(locale as AppLocale)
}
