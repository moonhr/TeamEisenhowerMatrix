'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import MatrixTaskCard from './MatrixTaskCard'
import type { PriorityTag, Task, User } from '@/types'

type DraggableMatrixTaskCardProps = {
  task: Task
  assignee: User | undefined
  priorityTag?: PriorityTag
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onMoveToSidebar: (taskId: string) => void
}

export default function DraggableMatrixTaskCard({
  task,
  assignee,
  priorityTag,
  onToggle,
  onEdit,
  onMoveToSidebar,
}: DraggableMatrixTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <MatrixTaskCard
        task={task}
        assignee={assignee}
        priorityTag={priorityTag}
        onToggle={onToggle}
        onEdit={onEdit}
        onMoveToSidebar={onMoveToSidebar}
      />
    </div>
  )
}
