import type { AppLocale } from '@/types'

export function syncLocaleCookie(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`
}
