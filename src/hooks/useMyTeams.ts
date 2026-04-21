'use client'

import { useState, useEffect } from 'react'
import { getTeamsByUser } from '@/lib/firebase/teamRepository'
import type { Team } from '@/types'

export function useMyTeams(userId: string) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getTeamsByUser(userId)
      .then(setTeams)
      .finally(() => setLoading(false))
  }, [userId])

  return { teams, loading, setTeams }
}
