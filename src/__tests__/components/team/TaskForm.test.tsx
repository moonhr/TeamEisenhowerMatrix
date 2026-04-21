import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '@/components/team/TaskForm'
import type { User } from '@/types'

const mockMembers: User[] = [
  { id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet' },
  { id: 'user-2', name: '이영희', avatar: 'avatar-2', themeColor: 'blue' },
]

describe('TaskForm', () => {
  it('title 입력 후 제출 시 onSubmit 콜백을 호출한다', async () => {
    const onSubmit = jest.fn()
    render(<TaskForm members={mockMembers} onSubmit={onSubmit} />)

    await userEvent.type(screen.getByPlaceholderText(/태스크 제목/i), '새 태스크')
    await userEvent.click(screen.getByRole('button', { name: /추가/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: '새 태스크' })
    )
  })

  it('title이 비어있으면 onSubmit을 호출하지 않는다', async () => {
    const onSubmit = jest.fn()
    render(<TaskForm members={mockMembers} onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /추가/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('제출 후 title 필드가 초기화된다', async () => {
    const onSubmit = jest.fn()
    render(<TaskForm members={mockMembers} onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText(/태스크 제목/i)
    await userEvent.type(input, '새 태스크')
    await userEvent.click(screen.getByRole('button', { name: /추가/i }))

    expect(input).toHaveValue('')
  })
})
