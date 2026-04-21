'use client'

import { useEffect, useRef, useState } from 'react'
import {
  updateCursor, removeCursor, registerCursorDisconnect, subscribeToCursors, type CursorData,
} from '@/lib/firebase/cursorRepository'
import type { User } from '@/types'

const THROTTLE_MS = 50

export function useCursor(teamId: string, user: User) {
  const [remoteCursors, setRemoteCursors] = useState<CursorData[]>([])
  const lastSentRef = useRef(0)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!teamId || !user.id) return

    registerCursorDisconnect(teamId, user.id)

    const unsubscribe = subscribeToCursors(teamId, (cursors) => {
      setRemoteCursors(cursors.filter((c) => c.userId !== user.id))
    })

    const flush = () => {
      if (!pendingRef.current) return
      const { x, y } = pendingRef.current
      pendingRef.current = null
      lastSentRef.current = Date.now()
      updateCursor(teamId, user.id, {
        name: user.name,
        avatar: user.avatar,
        x,
        y,
        updatedAt: Date.now(),
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      pendingRef.current = { x, y }

      const elapsed = Date.now() - lastSentRef.current
      if (elapsed >= THROTTLE_MS) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        flush()
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          flush()
        }, THROTTLE_MS - elapsed)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (timerRef.current) clearTimeout(timerRef.current)
      unsubscribe()
      removeCursor(teamId, user.id)
    }
  }, [teamId, user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { remoteCursors }
}
