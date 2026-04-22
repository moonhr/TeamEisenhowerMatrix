import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import type { AppLocale } from '@/types'
import { LOCALE_HEADER_NAME, resolveRequestLocale } from '@/lib/i18n/requestLocale'

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
  const headerStore = await headers()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
  const headerLocale = headerStore.get(LOCALE_HEADER_NAME)
  const matchedLocale = await requestLocale ?? null

  const locale = resolveRequestLocale({
    cookieLocale,
    headerLocale,
    requestLocale: matchedLocale,
  })

  return {
    locale,
    messages: await messageLoaders[locale](),
  }
})
