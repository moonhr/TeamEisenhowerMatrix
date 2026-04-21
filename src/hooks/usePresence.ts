'use client'

import { useEffect, useState } from 'react'
import {
  setPresence, removePresence, subscribeToPresence, type PresenceData,
} from '@/lib/firebase/presenceRepository'
import type { User } from '@/types'

const HEARTBEAT_INTERVAL_MS = 60 * 1000 // 1분마다 lastSeen 갱신

export function usePresence(teamId: string, user: User) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([])

  useEffect(() => {
    if (!teamId || !user.id) return

    // 입장
    setPresence(teamId, user)

    // 하트비트
    const heartbeat = setInterval(() => setPresence(teamId, user), HEARTBEAT_INTERVAL_MS)

    // 실시간 구독
    const unsubscribe = subscribeToPresence(teamId, setOnlineUsers)

    // 퇴장
    return () => {
      clearInterval(heartbeat)
      unsubscribe()
      removePresence(teamId, user.id)
    }
  }, [teamId, user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { onlineUsers }
}
