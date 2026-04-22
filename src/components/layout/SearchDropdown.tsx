'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import SearchResultItem from './SearchResultItem'
import type { SearchResults } from '@/hooks/useSearch'

type Props = {
  results: SearchResults
  loading: boolean
  query: string
}

export default function SearchDropdown({ results, loading, query }: Props) {
  const t = useTranslations('Search')
  const router = useRouter()
  const hasResults = results.tasks.length > 0 || results.teams.length > 0

  if (!query.trim()) return null

  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
      {loading ? (
        <p className="px-3 py-4 text-center text-sm text-muted-foreground">{t('loading')}</p>
      ) : !hasResults ? (
        <p className="px-3 py-4 text-center text-sm text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="p-1">
          {results.tasks.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('tasks')}</p>
              {results.tasks.map((task) => (
                <SearchResultItem
                  key={task.id}
                  type="task"
                  item={task}
                  onClick={() => router.push(`/team/${task.teamId}`)}
                />
              ))}
            </div>
          )}
          {results.teams.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('teams')}</p>
              {results.teams.map((team) => (
                <SearchResultItem
                  key={team.id}
                  type="team"
                  item={team}
                  onClick={() => router.push(`/team/${team.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
