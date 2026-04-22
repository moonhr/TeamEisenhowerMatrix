import {
  matchSupportedLocale,
  resolveLocaleFromAcceptLanguage,
  resolveRequestLocale,
} from '@/lib/i18n/requestLocale'

describe('matchSupportedLocale', () => {
  it('지원 locale과 정확히 일치하는 값을 반환한다', () => {
    expect(matchSupportedLocale('en-GB')).toBe('en-GB')
    expect(matchSupportedLocale('ko')).toBe('ko')
  })

  it('대소문자가 다른 locale도 허용한다', () => {
    expect(matchSupportedLocale('EN-gb')).toBe('en-GB')
  })

  it('지원되지 않는 세부 locale은 언어 코드로 fallback한다', () => {
    expect(matchSupportedLocale('en-US')).toBe('en')
    expect(matchSupportedLocale('fr-CA')).toBe('fr')
  })

  it('지원되지 않는 locale은 null을 반환한다', () => {
    expect(matchSupportedLocale('es-ES')).toBeNull()
    expect(matchSupportedLocale(undefined)).toBeNull()
  })
})

describe('resolveLocaleFromAcceptLanguage', () => {
  it('Accept-Language 우선순위에 따라 가장 적절한 locale을 선택한다', () => {
    expect(resolveLocaleFromAcceptLanguage('fr-CA,fr;q=0.9,en;q=0.8')).toBe('fr')
    expect(resolveLocaleFromAcceptLanguage('en-GB,en;q=0.9')).toBe('en-GB')
  })

  it('지원 locale이 없으면 기본 locale로 fallback한다', () => {
    expect(resolveLocaleFromAcceptLanguage('es-ES,es;q=0.9')).toBe('ko')
  })
})

describe('resolveRequestLocale', () => {
  it('cookie locale을 최우선으로 사용한다', () => {
    expect(resolveRequestLocale({
      cookieLocale: 'ja',
      headerLocale: 'en',
      requestLocale: 'fr',
    })).toBe('ja')
  })

  it('cookie가 없으면 forwarded header locale을 사용한다', () => {
    expect(resolveRequestLocale({
      headerLocale: 'de',
      requestLocale: 'fr',
    })).toBe('de')
  })

  it('cookie와 header가 모두 없으면 request locale을 사용한다', () => {
    expect(resolveRequestLocale({
      requestLocale: 'en-US',
    })).toBe('en')
  })
})
