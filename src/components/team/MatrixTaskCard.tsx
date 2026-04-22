'use client'

import { ArrowLeft, MoreVertical } from 'lucide-react'
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

type MatrixTaskCardProps = {
  task: Task
  assignee: User | undefined
  priorityTag?: PriorityTag
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onMoveToSidebar?: (taskId: string) => void
}

export default function MatrixTaskCard({
  task,
  assignee,
  priorityTag,
  onToggle,
  onEdit,
  onMoveToSidebar,
}: MatrixTaskCardProps) {
  const t = useTranslations('MatrixTaskCard')
  const locale = useLocale()
  const isDone = task.status === 'done'

  return (
    <div className="group flex items-start gap-2 rounded-md border bg-background p-2 text-xs shadow-sm">
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggle(task.id)}
        onPointerDown={(event) => event.stopPropagation()}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary"
      />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-medium', isDone && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
        {task.description && (
          <p className="truncate text-[10px] text-muted-foreground mt-0.5">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {priorityTag && <PriorityTagBadge tag={priorityTag} size="xs" />}
          {assignee && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              {assignee.name}
            </Badge>
          )}
          {task.deadline && (
            <span className="text-[10px] text-muted-foreground">{formatTaskDate(task.deadline, locale)}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onEdit(task)}
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
            aria-label={t('menu')}
          >
            <MoreVertical className="h-3 w-3" />
          </button>
        )}
        {onMoveToSidebar && (
          <button
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMoveToSidebar(task.id)}
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
            aria-label={t('moveToSidebar')}
          >
            <ArrowLeft className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
