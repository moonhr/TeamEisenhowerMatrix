'use client'

import { useDroppable } from '@dnd-kit/core'
import DraggableMatrixTaskCard from './DraggableMatrixTaskCard'
import { cn } from '@/lib/utils'
import type { MatrixPosition, PriorityTag, Task, User } from '@/types'

const QUADRANT_STYLES: Record<MatrixPosition, { border: string; badge: string; over: string }> = {
  do:        { border: 'border-red-300',    badge: 'bg-red-50 text-red-700',      over: 'bg-red-50/60' },
  schedule:  { border: 'border-blue-300',   badge: 'bg-blue-50 text-blue-700',    over: 'bg-blue-50/60' },
  delegate:  { border: 'border-yellow-300', badge: 'bg-yellow-50 text-yellow-700',over: 'bg-yellow-50/60' },
  eliminate: { border: 'border-slate-300',  badge: 'bg-slate-50 text-slate-600',  over: 'bg-slate-50/60' },
}

type DroppableQuadrantProps = {
  position: MatrixPosition
  label: string
  tasks: Task[]
  members: User[]
  priorityTags?: PriorityTag[]
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onMoveToSidebar: (taskId: string) => void
}

export default function DroppableQuadrant({
  position,
  label,
  tasks,
  members,
  priorityTags = [],
  onToggle,
  onEdit,
  onMoveToSidebar,
}: DroppableQuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({ id: position })
  const quadrantTasks = tasks.filter((t) => t.matrixPosition === position)
  const { border, badge, over } = QUADRANT_STYLES[position]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full flex-col rounded-lg border-2 p-3 transition-colors',
        border,
        isOver && over
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={cn('rounded px-2 py-0.5 text-xs font-semibold', badge)}>
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{quadrantTasks.length}</span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {quadrantTasks.map((task) => (
          <DraggableMatrixTaskCard
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
