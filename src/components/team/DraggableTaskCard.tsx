'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'
import type { PriorityTag, Task, User } from '@/types'

type DraggableTaskCardProps = {
  task: Task
  assignee: User | undefined
  priorityTag?: PriorityTag
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function DraggableTaskCard({
  task,
  assignee,
  priorityTag,
  onToggle,
  onEdit,
  onDelete,
}: DraggableTaskCardProps) {
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
      <TaskCard
        task={task}
        assignee={assignee}
        priorityTag={priorityTag}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
