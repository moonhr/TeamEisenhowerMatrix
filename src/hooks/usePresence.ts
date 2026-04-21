'use client'

import { useEffect, useState } from 'react'
import {
  setPresence, removePresence, subscribeToPresence, type PresenceData,
} from '@/lib/firebase/presenceRepository'
import type { User } from '@/types'

export function usePresence(teamId: string, user: User) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([])

  useEffect(() => {
    if (!teamId || !user.id) return

    setPresence(teamId, user)

    const unsubscribe = subscribeToPresence(teamId, setOnlineUsers)

    return () => {
      unsubscribe()
      removePresence(teamId, user.id)
    }
  }, [teamId, user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { onlineUsers }
}
