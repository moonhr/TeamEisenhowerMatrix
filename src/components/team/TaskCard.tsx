'use client'

import { MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import PriorityTagBadge from './PriorityTagBadge'
import type { PriorityTag, Task, User } from '@/types'

type TaskCardProps = {
  task: Task
  assignee: User | undefined
  priorityTag?: PriorityTag
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, assignee, priorityTag, onToggle, onEdit }: TaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <div className="group flex items-start gap-2 rounded-md border p-2 text-sm hover:bg-muted/50">
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggle(task.id)}
        onPointerDown={(e) => e.stopPropagation()}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
      />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-medium', isDone && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
        {task.description && (
          <p className="truncate text-xs text-muted-foreground mt-0.5">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {priorityTag && <PriorityTagBadge tag={priorityTag} />}
          {assignee && (
            <Badge variant="secondary" className="text-xs">
              {assignee.name}
            </Badge>
          )}
          {task.deadline && (
            <span className="text-xs text-muted-foreground">{task.deadline}</span>
          )}
        </div>
      </div>
      {onEdit && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
          className="h-6 w-6 shrink-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-muted"
          aria-label="메뉴"
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
