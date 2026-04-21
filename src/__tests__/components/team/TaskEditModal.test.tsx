import { render, screen, fireEvent } from '@testing-library/react'
import TaskEditModal from '@/components/team/TaskEditModal'
import type { Task, User } from '@/types'

const mockTask: Task = {
  id: 'task-1',
  teamId: 'team-1',
  weekKey: '2026-W16',
  title: '기존 제목',
  description: '기존 설명',
  assigneeId: 'user-1',
  deadline: '2026-04-25',
  status: 'todo',
  matrixPosition: null,
}

const mockMembers: User[] = [
  { id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet', colorScheme: 'light' },
]

describe('TaskEditModal', () => {
  it('task가 null이면 모달을 렌더하지 않는다', () => {
    render(
      <TaskEditModal task={null} members={mockMembers} priorityTags={[]} onSave={jest.fn()} onDelete={jest.fn()} onClose={jest.fn()} />
    )
    expect(screen.queryByText('태스크 수정')).not.toBeInTheDocument()
  })

  it('task의 기존 값을 입력 필드에 채운다', () => {
    render(
      <TaskEditModal task={mockTask} members={mockMembers} priorityTags={[]} onSave={jest.fn()} onDelete={jest.fn()} onClose={jest.fn()} />
    )
    expect(screen.getByDisplayValue('기존 제목')).toBeInTheDocument()
    expect(screen.getByDisplayValue('기존 설명')).toBeInTheDocument()
  })

  it('제목을 수정하고 저장하면 onSave가 호출된다', () => {
    const onSave = jest.fn()
    render(
      <TaskEditModal task={mockTask} members={mockMembers} priorityTags={[]} onSave={onSave} onDelete={jest.fn()} onClose={jest.fn()} />
    )
    const input = screen.getByDisplayValue('기존 제목')
    fireEvent.change(input, { target: { value: '수정된 제목' } })
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(onSave).toHaveBeenCalledWith('task-1', expect.objectContaining({ title: '수정된 제목' }))
  })

  it('제목이 비어있으면 저장 버튼이 비활성화된다', () => {
    render(
      <TaskEditModal task={mockTask} members={mockMembers} priorityTags={[]} onSave={jest.fn()} onDelete={jest.fn()} onClose={jest.fn()} />
    )
    fireEvent.change(screen.getByDisplayValue('기존 제목'), { target: { value: '' } })
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled()
  })

  it('취소 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = jest.fn()
    render(
      <TaskEditModal task={mockTask} members={mockMembers} priorityTags={[]} onSave={jest.fn()} onDelete={jest.fn()} onClose={onClose} />
    )
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(onClose).toHaveBeenCalled()
  })
})
