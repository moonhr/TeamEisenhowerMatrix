import { weekKeyToDisplay, getCurrentWeekKey, dateToWeekKey, addWeeks } from '@/lib/utils/week'

describe('weekKeyToDisplay', () => {
  it('일반 주차를 한국어 형식으로 변환한다', () => {
    // 2026-W17: Monday = Apr 20 → ceil(20/7) = 3
    expect(weekKeyToDisplay('2026-W17')).toBe('2026년 4월 3주차')
  })

  it('월 경계: Monday가 이전 달에 있는 경우', () => {
    // 2026-W14: Monday = Mar 30 → ceil(30/7) = 5
    expect(weekKeyToDisplay('2026-W14')).toBe('2026년 3월 5주차')
  })

  it('연도 경계: ISO 1주차의 Monday가 전년도 12월인 경우', () => {
    // 2026-W01: Monday = Dec 29, 2025 → ceil(29/7) = 5
    expect(weekKeyToDisplay('2026-W01')).toBe('2025년 12월 5주차')
  })

  it('월의 첫 번째 주차를 변환한다', () => {
    // 2026-W02: Monday = Jan 5, 2026 → ceil(5/7) = 1
    expect(weekKeyToDisplay('2026-W02')).toBe('2026년 1월 1주차')
  })

  it('연말 마지막 주를 변환한다', () => {
    // 2026-W53 or W52: Monday = Dec 28, 2026 → ceil(28/7) = 4
    expect(weekKeyToDisplay('2026-W53')).toBe('2026년 12월 4주차')
  })

  it('영어 locale이면 영어 형식으로 변환한다', () => {
    expect(weekKeyToDisplay('2026-W17', 'en')).toBe('Week 3 of April 2026')
  })

  it('영어 locale에서도 연도 경계 주차를 올바르게 변환한다', () => {
    expect(weekKeyToDisplay('2026-W01', 'en')).toBe('Week 5 of December 2025')
  })

  it('영국 영어 locale도 영어 형식으로 변환한다', () => {
    expect(weekKeyToDisplay('2026-W17', 'en-GB')).toBe('Week 3 of April 2026')
  })

  it('일본어 locale이면 일본어 형식으로 변환한다', () => {
    expect(weekKeyToDisplay('2026-W17', 'ja')).toBe('2026年4月第3週')
  })

  it('프랑스어 locale이면 프랑스어 형식으로 변환한다', () => {
    expect(weekKeyToDisplay('2026-W17', 'fr')).toBe('Semaine 3 de avril 2026')
  })

  it('독일어 locale이면 독일어 형식으로 변환한다', () => {
    expect(weekKeyToDisplay('2026-W17', 'de')).toBe('3. Woche im April 2026')
  })
})

describe('dateToWeekKey', () => {
  it('날짜를 weekKey 포맷으로 변환한다', () => {
    expect(dateToWeekKey(new Date(2026, 3, 20))).toBe('2026-W17') // Apr 20
  })

  it('연도 경계: 12월 말을 다음해 W01으로 변환한다', () => {
    expect(dateToWeekKey(new Date(2025, 11, 29))).toBe('2026-W01') // Dec 29, 2025
  })

  it('연도 경계: 1월 초를 전년도 W52/W53으로 변환한다', () => {
    // Jan 1, 2016 is Friday → belongs to 2015-W53
    expect(dateToWeekKey(new Date(2016, 0, 1))).toBe('2015-W53')
  })
})

describe('getCurrentWeekKey', () => {
  it('현재 날짜의 weekKey를 반환한다', () => {
    const result = getCurrentWeekKey()
    expect(result).toMatch(/^\d{4}-W\d{2}$/)
  })
})

describe('addWeeks', () => {
  it('weekKey에 n주를 더한다', () => {
    expect(addWeeks('2026-W17', 1)).toBe('2026-W18')
  })

  it('연도 경계를 넘어 다음 연도로 이동한다', () => {
    expect(addWeeks('2026-W52', 1)).toBe('2026-W53')
  })

  it('음수로 이전 주로 이동한다', () => {
    expect(addWeeks('2026-W17', -1)).toBe('2026-W16')
  })

  it('연도 경계를 넘어 이전 연도로 이동한다', () => {
    // 2025년은 W52까지 존재 (Jan 1, 2025 = Wednesday, 비윤년)
    expect(addWeeks('2026-W01', -1)).toBe('2025-W52')
  })
})
