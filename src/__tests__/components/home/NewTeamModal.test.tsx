import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewTeamModal from '@/components/home/NewTeamModal'

describe('NewTeamModal', () => {
  it('팀 이름 입력 후 제출 시 onCreate를 호출한다', async () => {
    const onCreate = jest.fn()
    render(<NewTeamModal open onOpenChange={() => {}} onCreate={onCreate} />)

    await userEvent.type(screen.getByPlaceholderText(/팀 이름/i), '프로덕트팀')
    await userEvent.click(screen.getByRole('button', { name: /만들기/i }))

    expect(onCreate).toHaveBeenCalledWith('프로덕트팀')
  })

  it('팀 이름이 비어있으면 onCreate를 호출하지 않는다', async () => {
    const onCreate = jest.fn()
    render(<NewTeamModal open onOpenChange={() => {}} onCreate={onCreate} />)

    await userEvent.click(screen.getByRole('button', { name: /만들기/i }))

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('제출 후 입력 필드가 초기화된다', async () => {
    const onCreate = jest.fn()
    render(<NewTeamModal open onOpenChange={() => {}} onCreate={onCreate} />)

    const input = screen.getByPlaceholderText(/팀 이름/i)
    await userEvent.type(input, '테스트팀')
    await userEvent.click(screen.getByRole('button', { name: /만들기/i }))

    expect(input).toHaveValue('')
  })
})
