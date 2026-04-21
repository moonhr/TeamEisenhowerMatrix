import { generateInviteLink, extractInviteCode } from '@/lib/utils/invite'

describe('generateInviteLink', () => {
  it('초대 코드로 올바른 링크를 생성한다', () => {
    expect(generateInviteLink('ABC12345', 'https://example.com')).toBe(
      'https://example.com/join/ABC12345'
    )
  })

  it('trailing slash가 있어도 중복 슬래시 없이 생성한다', () => {
    expect(generateInviteLink('ABC12345', 'https://example.com/')).toBe(
      'https://example.com/join/ABC12345'
    )
  })
})

describe('extractInviteCode', () => {
  it('경로에서 초대 코드를 추출한다', () => {
    expect(extractInviteCode('/join/ABC12345')).toBe('ABC12345')
  })

  it('유효하지 않은 경로면 null을 반환한다', () => {
    expect(extractInviteCode('/team/abc')).toBeNull()
  })
})
