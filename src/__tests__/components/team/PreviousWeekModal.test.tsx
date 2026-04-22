import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreviousWeekModal from '@/components/team/PreviousWeekModal'

describe('PreviousWeekModal', () => {
  it('현재 주차에서 열면 가장 최근 이전 주차를 기본값으로 표시한다', () => {
    render(
      <PreviousWeekModal
        open
        earliestWeekKey="2026-W13"
        currentWeekKey="2026-W17"
        selectedWeekKey="2026-W17"
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.getByTestId('previous-week-trigger')).toHaveTextContent('2026년 4월 2주차')
  })

  it('주차 선택 후 확인 시 onSelect(weekKey)를 호출한다', async () => {
    const onSelect = jest.fn()
    render(
      <PreviousWeekModal
        open
        earliestWeekKey="2026-W13"
        currentWeekKey="2026-W17"
        selectedWeekKey="2026-W17"
        onOpenChange={() => {}}
        onSelect={onSelect}
      />
    )

    await userEvent.click(screen.getByTestId('previous-week-trigger'))
    await userEvent.click(await screen.findByTestId('previous-week-option-2026-W14'))
    await userEvent.click(screen.getByRole('button', { name: /이동/i }))

    expect(onSelect).toHaveBeenCalledWith('2026-W14')
  })

  it('이전 주차가 없으면 안내 문구를 표시하고 이동 버튼을 비활성화한다', () => {
    render(
      <PreviousWeekModal
        open
        earliestWeekKey="2026-W17"
        currentWeekKey="2026-W17"
        selectedWeekKey="2026-W17"
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.getByText('이전 주차가 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /이동/i })).toBeDisabled()
  })
})
