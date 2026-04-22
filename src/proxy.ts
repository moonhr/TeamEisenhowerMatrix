import { NextResponse, type NextRequest } from 'next/server'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  matchSupportedLocale,
  resolveLocaleFromAcceptLanguage,
} from '@/lib/i18n/requestLocale'

export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  const resolvedLocale = matchSupportedLocale(cookieLocale)
    ?? resolveLocaleFromAcceptLanguage(request.headers.get('accept-language'), DEFAULT_LOCALE)

  requestHeaders.set(LOCALE_HEADER_NAME, resolvedLocale)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  if (cookieLocale !== resolvedLocale) {
    response.cookies.set(LOCALE_COOKIE_NAME, resolvedLocale, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
