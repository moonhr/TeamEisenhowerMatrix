'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { searchTasksByTitle } from '@/lib/firebase/taskRepository'
import type { Task, Team } from '@/types'

export type SearchResults = {
  tasks: (Task & { teamName: string })[]
  teams: Team[]
}

export function useSearch(query: string, teams: Team[]) {
  const [results, setResults] = useState<SearchResults>({ tasks: [], teams: [] })
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const teamsRef = useRef(teams)

  // keep teamsRef current without adding teams to main effect deps
  useEffect(() => {
    teamsRef.current = teams
  })

  const teamIdsKey = useMemo(
    () => teams.map((t) => t.id).join(','),
    [teams]
  )

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim()) {
      setResults({ tasks: [], teams: [] })
      return
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const currentTeams = teamsRef.current
        const teamIds = currentTeams.map((t) => t.id)
        const tasks = await searchTasksByTitle(teamIds, query.trim())
        const teamMap = new Map(currentTeams.map((t) => [t.id, t.name]))
        const tasksWithTeamName = tasks.map((task) => ({
          ...task,
          teamName: teamMap.get(task.teamId) ?? '',
        }))
        const filteredTeams = currentTeams.filter((t) =>
          t.name.toLowerCase().includes(query.toLowerCase())
        )
        setResults({ tasks: tasksWithTeamName, teams: filteredTeams })
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, teamIdsKey])

  return { results, loading }
}
