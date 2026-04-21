import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreviousWeekModal from '@/components/team/PreviousWeekModal'

describe('PreviousWeekModal', () => {
  it('이전 주차 목록을 한국어 형식으로 표시한다', () => {
    render(
      <PreviousWeekModal
        open
        currentWeekKey="2026-W17"
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )
    expect(screen.getByText('2026년 4월 2주차')).toBeInTheDocument()
    expect(screen.getByText('2026년 4월 1주차')).toBeInTheDocument()
  })

  it('주차 선택 시 onSelect(weekKey)를 호출한다', async () => {
    const onSelect = jest.fn()
    render(
      <PreviousWeekModal
        open
        currentWeekKey="2026-W17"
        onOpenChange={() => {}}
        onSelect={onSelect}
      />
    )
    await userEvent.click(screen.getByText('2026년 4월 2주차'))
    expect(onSelect).toHaveBeenCalledWith('2026-W16')
  })
})
