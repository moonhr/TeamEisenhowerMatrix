import { render, screen } from '@testing-library/react'
import MatrixQuadrant from '@/components/team/MatrixQuadrant'
import type { Task, User } from '@/types'

const mockMembers: User[] = [
  { id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet' },
]

const mockTasks: Task[] = [
  {
    id: 'task-1', teamId: 'team-1', weekKey: '2026-W17',
    title: 'Do First 태스크', description: '', assigneeId: 'user-1',
    deadline: '', status: 'todo', matrixPosition: 'do',
  },
  {
    id: 'task-2', teamId: 'team-1', weekKey: '2026-W17',
    title: 'Schedule 태스크', description: '', assigneeId: 'user-1',
    deadline: '', status: 'todo', matrixPosition: 'schedule',
  },
  {
    id: 'task-3', teamId: 'team-1', weekKey: '2026-W17',
    title: '사이드바 태스크', description: '', assigneeId: 'user-1',
    deadline: '', status: 'todo', matrixPosition: null,
  },
]

describe('MatrixQuadrant', () => {
  it('해당 position의 태스크만 표시한다', () => {
    render(
      <MatrixQuadrant
        position="do"
        label="Do First"
        tasks={mockTasks}
        members={mockMembers}
        onToggle={() => {}}
        onMoveToSidebar={() => {}}
      />
    )
    expect(screen.getByText('Do First 태스크')).toBeInTheDocument()
    expect(screen.queryByText('Schedule 태스크')).not.toBeInTheDocument()
    expect(screen.queryByText('사이드바 태스크')).not.toBeInTheDocument()
  })

  it('다른 position의 태스크는 표시하지 않는다', () => {
    render(
      <MatrixQuadrant
        position="schedule"
        label="Schedule"
        tasks={mockTasks}
        members={mockMembers}
        onToggle={() => {}}
        onMoveToSidebar={() => {}}
      />
    )
    expect(screen.queryByText('Do First 태스크')).not.toBeInTheDocument()
    expect(screen.getByText('Schedule 태스크')).toBeInTheDocument()
  })
})
