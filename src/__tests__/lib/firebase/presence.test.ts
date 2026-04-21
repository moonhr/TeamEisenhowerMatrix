import { buildPresenceData, isPresenceActive } from '@/lib/utils/presence'

describe('buildPresenceData', () => {
  it('유저 정보로 presence 데이터를 생성한다', () => {
    const data = buildPresenceData('team-1', {
      id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet',
    })
    expect(data.teamId).toBe('team-1')
    expect(data.userId).toBe('user-1')
    expect(data.name).toBe('김철수')
    expect(data.avatar).toBe('avatar-1')
    expect(typeof data.lastSeen).toBe('number')
  })
})

describe('isPresenceActive', () => {
  it('5분 이내 lastSeen이면 true를 반환한다', () => {
    const lastSeen = Date.now() - 3 * 60 * 1000 // 3분 전
    expect(isPresenceActive(lastSeen)).toBe(true)
  })

  it('5분 초과 lastSeen이면 false를 반환한다', () => {
    const lastSeen = Date.now() - 6 * 60 * 1000 // 6분 전
    expect(isPresenceActive(lastSeen)).toBe(false)
  })
})
