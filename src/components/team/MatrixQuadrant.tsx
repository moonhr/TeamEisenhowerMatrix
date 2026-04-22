import MatrixTaskCard from './MatrixTaskCard'
import { cn } from '@/lib/utils'
import type { MatrixPosition, PriorityTag, Task, User } from '@/types'

const QUADRANT_STYLES: Record<MatrixPosition, { border: string; badge: string }> = {
  do:       { border: 'border-red-300',    badge: 'bg-red-50 text-red-700' },
  schedule: { border: 'border-blue-300',   badge: 'bg-blue-50 text-blue-700' },
  delegate: { border: 'border-yellow-300', badge: 'bg-yellow-50 text-yellow-700' },
  eliminate:{ border: 'border-slate-300',  badge: 'bg-slate-50 text-slate-600' },
}

type MatrixQuadrantProps = {
  position: MatrixPosition
  label: string
  tasks: Task[]
  members: User[]
  priorityTags?: PriorityTag[]
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onMoveToSidebar?: (taskId: string) => void
}

export default function MatrixQuadrant({
  position,
  label,
  tasks,
  members,
  priorityTags = [],
  onToggle,
  onEdit,
  onMoveToSidebar,
}: MatrixQuadrantProps) {
  const quadrantTasks = tasks.filter((t) => t.matrixPosition === position)
  const { border, badge } = QUADRANT_STYLES[position]

  return (
    <div className={cn('flex h-full flex-col rounded-lg border-2 p-3', border)}>
      <div className="mb-2 flex items-center justify-between">
        <span className={cn('rounded px-2 py-0.5 text-xs font-semibold', badge)}>
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{quadrantTasks.length}</span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {quadrantTasks.map((task) => (
          <MatrixTaskCard
            key={task.id}
            task={task}
            assignee={members.find((m) => m.id === task.assigneeId)}
            priorityTag={priorityTags.find((t) => t.id === task.priorityTagId)}
            onToggle={onToggle}
            onEdit={onEdit}
            onMoveToSidebar={onMoveToSidebar}
          />
        ))}
      </div>
    </div>
  )
}
