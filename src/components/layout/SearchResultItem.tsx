import { useLocale } from 'next-intl'
import { FileText, Users } from 'lucide-react'

import { weekKeyToDisplay, type WeekLocale } from '@/lib/utils/week'
import type { Task, Team } from '@/types'

type TaskResult = Task & { teamName: string }

type Props =
  | { type: 'task'; item: TaskResult; onClick: () => void }
  | { type: 'team'; item: Team; onClick: () => void }

export default function SearchResultItem({ type, item, onClick }: Props) {
  const locale = useLocale() as WeekLocale

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
    >
      {type === 'task' ? (
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : (
        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">
          {type === 'task' ? (item as TaskResult).title : (item as Team).name}
        </p>
        {type === 'task' && (
          <p className="truncate text-xs text-muted-foreground">
            {(item as TaskResult).teamName} · {weekKeyToDisplay((item as TaskResult).weekKey, locale)}
          </p>
        )}
      </div>
    </button>
  )
}
