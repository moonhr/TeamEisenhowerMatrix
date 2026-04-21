import { ref, set, remove, onValue, onDisconnect, type Unsubscribe } from 'firebase/database'
import { rtdb } from './config'

export type CursorData = {
  teamId: string
  userId: string
  name: string
  avatar: string
  x: number // viewport % (0–100)
  y: number // viewport % (0–100)
  updatedAt: number
}

// RTDB 경로: cursors/{teamId}/{userId}

export async function updateCursor(
  teamId: string,
  userId: string,
  data: Omit<CursorData, 'teamId' | 'userId'>
): Promise<void> {
  const cursorRef = ref(rtdb, `cursors/${teamId}/${userId}`)
  await set(cursorRef, { teamId, userId, ...data })
}

export function registerCursorDisconnect(teamId: string, userId: string): void {
  const cursorRef = ref(rtdb, `cursors/${teamId}/${userId}`)
  onDisconnect(cursorRef).remove()
}

export async function removeCursor(teamId: string, userId: string): Promise<void> {
  await remove(ref(rtdb, `cursors/${teamId}/${userId}`))
}

const STALE_MS = 10_000

export function subscribeToCursors(
  teamId: string,
  onUpdate: (cursors: CursorData[]) => void
): Unsubscribe {
  const cursorsRef = ref(rtdb, `cursors/${teamId}`)
  const unsub = onValue(cursorsRef, (snap) => {
    if (!snap.exists()) {
      onUpdate([])
      return
    }
    const now = Date.now()
    const cursors = Object.values(snap.val() as Record<string, CursorData>)
      .filter((c) => now - c.updatedAt < STALE_MS)
    onUpdate(cursors)
  })
  return unsub
}
