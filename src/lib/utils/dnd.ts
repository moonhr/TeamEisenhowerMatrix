import type { MatrixPosition, Task } from '@/types'

export type DropZoneId = MatrixPosition | 'sidebar'

export function applyDragEnd(
  tasks: Task[],
  activeId: string,
  overId: DropZoneId
): Task[] {
  const task = tasks.find((t) => t.id === activeId)
  if (!task) return tasks

  const nextPosition: MatrixPosition | null = overId === 'sidebar' ? null : overId

  // 같은 위치면 변경 없음
  if (task.matrixPosition === nextPosition) return tasks

  return tasks.map((t) =>
    t.id === activeId ? { ...t, matrixPosition: nextPosition } : t
  )
}
