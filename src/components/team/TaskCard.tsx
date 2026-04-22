'use client'

import { MoreVertical, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import PriorityTagBadge from './PriorityTagBadge'
import type { PriorityTag, Task, User } from '@/types'

function formatTaskDate(deadline: string, locale: string) {
  const [year, month, day] = deadline.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: locale === 'ko' || locale === 'ja' ? 'numeric' : 'short',
    day: 'numeric',
  }).format(date)
}

type TaskCardProps = {
  task: Task
  assignee: User | undefined
  priorityTag?: PriorityTag
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, assignee, priorityTag, onToggle, onEdit, onDelete }: TaskCardProps) {
  const t = useTranslations('TaskCard')
  const locale = useLocale()
  const isDone = task.status === 'done'

  return (
    <div className="group flex items-start gap-2 rounded-md border p-2 text-sm hover:bg-muted/50">
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggle(task.id)}
        onPointerDown={(event) => event.stopPropagation()}
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
            <span className="text-xs text-muted-foreground">{formatTaskDate(task.deadline, locale)}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onEdit(task)}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted"
            aria-label={t('menu')}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onDelete(task.id)}
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted"
          aria-label={t('delete')}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
