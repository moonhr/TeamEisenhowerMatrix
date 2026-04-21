import type { Task } from '@/types'

export function migrateIncompleteTasks(
  tasks: Task[],
  fromWeekKey: string,
  toWeekKey: string
): Task[] {
  return tasks.map((task) => {
    if (task.weekKey === fromWeekKey && task.status === 'todo') {
      return { ...task, weekKey: toWeekKey, matrixPosition: null }
    }
    return task
  })
}
