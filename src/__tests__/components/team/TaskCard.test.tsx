import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from '@/components/team/TaskCard'
import type { Task, User } from '@/types'

const mockTask: Task = {
  id: 'task-1',
  teamId: 'team-1',
  weekKey: '2026-W17',
  title: '스프린트 계획',
  description: '다음 스프린트 목표 정의',
  assigneeId: 'user-1',
  deadline: '2026-04-25',
  status: 'todo',
  matrixPosition: null,
}

const mockAssignee: User = {
  id: 'user-1',
  name: '김철수',
  avatar: 'avatar-1',
  themeColor: 'violet',
}

describe('TaskCard', () => {
  it('완료 토글 클릭 시 onToggle(taskId)를 호출한다', async () => {
    const onToggle = jest.fn()
    render(
      <TaskCard task={mockTask} assignee={mockAssignee} onToggle={onToggle} onDelete={() => {}} />
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('task-1')
  })

  it('삭제 버튼 클릭 시 onDelete(taskId)를 호출한다', async () => {
    const onDelete = jest.fn()
    render(
      <TaskCard task={mockTask} assignee={mockAssignee} onToggle={() => {}} onDelete={onDelete} />
    )
    await userEvent.click(screen.getByRole('button', { name: /삭제/i }))
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('완료 상태일 때 checkbox가 checked 상태이다', () => {
    const doneTask = { ...mockTask, status: 'done' as const }
    render(
      <TaskCard task={doneTask} assignee={mockAssignee} onToggle={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('미완료 상태일 때 checkbox가 unchecked 상태이다', () => {
    render(
      <TaskCard task={mockTask} assignee={mockAssignee} onToggle={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('readOnly이면 체크박스와 삭제 버튼을 비활성화한다', () => {
    render(
      <TaskCard
        task={mockTask}
        assignee={mockAssignee}
        readOnly
        onToggle={() => {}}
        onDelete={() => {}}
      />
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.queryByRole('button', { name: /삭제/i })).not.toBeInTheDocument()
  })
})
