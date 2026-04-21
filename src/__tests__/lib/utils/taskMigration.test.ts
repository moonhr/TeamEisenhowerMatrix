import { migrateIncompleteTasks } from '@/lib/utils/taskMigration'
import type { Task } from '@/types'

const base: Task = {
  id: '', teamId: 'team-1', weekKey: '2026-W17',
  title: '', description: '', assigneeId: '',
  deadline: '', status: 'todo', matrixPosition: null,
}

const tasks: Task[] = [
  { ...base, id: 'task-1', status: 'todo',  weekKey: '2026-W17', matrixPosition: null },
  { ...base, id: 'task-2', status: 'done',  weekKey: '2026-W17', matrixPosition: 'do' },
  { ...base, id: 'task-3', status: 'todo',  weekKey: '2026-W17', matrixPosition: 'schedule' },
  { ...base, id: 'task-4', status: 'todo',  weekKey: '2026-W18', matrixPosition: null },
]

describe('migrateIncompleteTasks', () => {
  it('todo 태스크를 다음 weekKey로 이동한다', () => {
    const result = migrateIncompleteTasks(tasks, '2026-W17', '2026-W18')
    expect(result.find((t) => t.id === 'task-1')?.weekKey).toBe('2026-W18')
    expect(result.find((t) => t.id === 'task-3')?.weekKey).toBe('2026-W18')
  })

  it('이동된 태스크의 matrixPosition은 null로 초기화된다', () => {
    const result = migrateIncompleteTasks(tasks, '2026-W17', '2026-W18')
    expect(result.find((t) => t.id === 'task-3')?.matrixPosition).toBeNull()
  })

  it('done 태스크는 이동하지 않는다', () => {
    const result = migrateIncompleteTasks(tasks, '2026-W17', '2026-W18')
    expect(result.find((t) => t.id === 'task-2')?.weekKey).toBe('2026-W17')
  })

  it('다른 weekKey의 태스크는 영향받지 않는다', () => {
    const result = migrateIncompleteTasks(tasks, '2026-W17', '2026-W18')
    expect(result.find((t) => t.id === 'task-4')?.weekKey).toBe('2026-W18')
  })

  it('이미 다음 주에 있던 태스크와 이동된 태스크가 함께 존재한다', () => {
    const result = migrateIncompleteTasks(tasks, '2026-W17', '2026-W18')
    const w18Tasks = result.filter((t) => t.weekKey === '2026-W18')
    expect(w18Tasks).toHaveLength(3) // task-1, task-3 이동 + task-4 기존
  })
})
