import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MatrixTaskCard from '@/components/team/MatrixTaskCard'
import type { Task, User } from '@/types'

const mockTask: Task = {
  id: 'task-1',
  teamId: 'team-1',
  weekKey: '2026-W17',
  title: '스프린트 계획',
  description: '',
  assigneeId: 'user-1',
  deadline: '2026-04-25',
  status: 'todo',
  matrixPosition: 'do',
}

const mockAssignee: User = {
  id: 'user-1',
  name: '김철수',
  avatar: 'avatar-1',
  themeColor: 'violet',
}

describe('MatrixTaskCard', () => {
  it('완료 토글 클릭 시 onToggle(taskId)를 호출한다', async () => {
    const onToggle = jest.fn()
    render(
      <MatrixTaskCard
        task={mockTask}
        assignee={mockAssignee}
        onToggle={onToggle}
        onMoveToSidebar={() => {}}
      />
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('task-1')
  })

  it('사이드바로 이동 버튼 클릭 시 onMoveToSidebar(taskId)를 호출한다', async () => {
    const onMoveToSidebar = jest.fn()
    render(
      <MatrixTaskCard
        task={mockTask}
        assignee={mockAssignee}
        onToggle={() => {}}
        onMoveToSidebar={onMoveToSidebar}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /사이드바/i }))
    expect(onMoveToSidebar).toHaveBeenCalledWith('task-1')
  })

  it('완료 상태일 때 checkbox가 checked다', () => {
    const doneTask = { ...mockTask, status: 'done' as const }
    render(
      <MatrixTaskCard
        task={doneTask}
        assignee={mockAssignee}
        onToggle={() => {}}
        onMoveToSidebar={() => {}}
      />
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
