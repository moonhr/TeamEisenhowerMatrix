import { syncLocaleCookie } from '@/lib/i18n/localeCookie'

describe('syncLocaleCookie', () => {
  beforeEach(() => {
    document.cookie = 'NEXT_LOCALE=; Max-Age=0; Path=/'
  })

  it('locale 변경 시 NEXT_LOCALE 쿠키를 업데이트한다', () => {
    syncLocaleCookie('en')

    expect(document.cookie).toContain('NEXT_LOCALE=en')
  })

  it('다시 호출하면 최신 locale 값으로 갱신된다', () => {
    syncLocaleCookie('ko')
    syncLocaleCookie('en')

    expect(document.cookie).toContain('NEXT_LOCALE=en')
  })
})
