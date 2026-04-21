import { getPreviousWeeks } from '@/lib/utils/week'

describe('getPreviousWeeks', () => {
  it('현재 주차 기준 n개의 이전 주차를 최신순으로 반환한다', () => {
    const result = getPreviousWeeks('2026-W17', 4)
    expect(result).toEqual(['2026-W16', '2026-W15', '2026-W14', '2026-W13'])
  })

  it('연도 경계를 넘어 이전 주차를 반환한다', () => {
    const result = getPreviousWeeks('2026-W02', 3)
    expect(result).toEqual(['2026-W01', '2025-W52', '2025-W51'])
  })

  it('count가 0이면 빈 배열을 반환한다', () => {
    expect(getPreviousWeeks('2026-W17', 0)).toEqual([])
  })
})
