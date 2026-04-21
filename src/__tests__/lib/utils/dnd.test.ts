import { applyDragEnd } from '@/lib/utils/dnd'
import type { Task } from '@/types'

const base: Task = {
  id: 'task-1', teamId: 'team-1', weekKey: '2026-W17',
  title: '태스크', description: '', assigneeId: 'user-1',
  deadline: '', status: 'todo', matrixPosition: null,
}

const tasks: Task[] = [
  { ...base, id: 'task-1', matrixPosition: null },
  { ...base, id: 'task-2', matrixPosition: 'do' },
  { ...base, id: 'task-3', matrixPosition: 'schedule' },
]

describe('applyDragEnd', () => {
  it('사이드바 태스크를 사분면에 드롭하면 matrixPosition이 설정된다', () => {
    const result = applyDragEnd(tasks, 'task-1', 'do')
    expect(result.find((t) => t.id === 'task-1')?.matrixPosition).toBe('do')
  })

  it('사분면 태스크를 다른 사분면으로 드롭하면 matrixPosition이 변경된다', () => {
    const result = applyDragEnd(tasks, 'task-2', 'eliminate')
    expect(result.find((t) => t.id === 'task-2')?.matrixPosition).toBe('eliminate')
  })

  it('사분면 태스크를 sidebar로 드롭하면 matrixPosition이 null이 된다', () => {
    const result = applyDragEnd(tasks, 'task-3', 'sidebar')
    expect(result.find((t) => t.id === 'task-3')?.matrixPosition).toBeNull()
  })

  it('같은 위치로 드롭하면 변경이 없다', () => {
    const result = applyDragEnd(tasks, 'task-2', 'do')
    expect(result).toEqual(tasks)
  })

  it('존재하지 않는 태스크 ID는 변경이 없다', () => {
    const result = applyDragEnd(tasks, 'task-999', 'do')
    expect(result).toEqual(tasks)
  })

  it('드래그 대상 외 태스크는 영향받지 않는다', () => {
    const result = applyDragEnd(tasks, 'task-1', 'do')
    expect(result.find((t) => t.id === 'task-2')?.matrixPosition).toBe('do')
    expect(result.find((t) => t.id === 'task-3')?.matrixPosition).toBe('schedule')
  })
})
