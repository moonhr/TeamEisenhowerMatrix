import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import type { AppLocale } from '@/types'
import { defaultLocale, hasLocale } from './routing'

const messageLoaders: Record<AppLocale, () => Promise<Record<string, unknown>>> = {
  ko: () => import('../../messages/ko.json').then((module) => module.default),
  en: () => import('../../messages/en.json').then((module) => module.default),
  'en-GB': () => import('../../messages/en-GB.json').then((module) => module.default),
  ja: () => import('../../messages/ja.json').then((module) => module.default),
  fr: () => import('../../messages/fr.json').then((module) => module.default),
  de: () => import('../../messages/de.json').then((module) => module.default),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
  const matchedLocale = await requestLocale

  const locale = hasLocale(cookieLocale)
    ? cookieLocale
    : hasLocale(matchedLocale)
      ? matchedLocale
      : defaultLocale

  return {
    locale,
    messages: await messageLoaders[locale](),
  }
})
