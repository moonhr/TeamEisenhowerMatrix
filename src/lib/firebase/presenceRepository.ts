import { ref, set, remove, onValue, onDisconnect, type Unsubscribe } from 'firebase/database'
import { rtdb } from './config'
import type { User } from '@/types'

export type PresenceData = {
  teamId: string
  userId: string
  name: string
  avatar: string
  lastSeen: number
}

// RTDB 경로: presence/{teamId}/{userId}

export async function setPresence(teamId: string, user: User): Promise<void> {
  const presenceRef = ref(rtdb, `presence/${teamId}/${user.id}`)
  const data: PresenceData = {
    teamId,
    userId: user.id,
    name: user.name,
    avatar: user.avatar,
    lastSeen: Date.now(),
  }
  onDisconnect(presenceRef).remove()
  await set(presenceRef, data)
}

export async function removePresence(teamId: string, userId: string): Promise<void> {
  await remove(ref(rtdb, `presence/${teamId}/${userId}`))
}

export function subscribeToPresence(
  teamId: string,
  onUpdate: (users: PresenceData[]) => void
): Unsubscribe {
  const presenceRef = ref(rtdb, `presence/${teamId}`)
  return onValue(presenceRef, (snap) => {
    if (!snap.exists()) {
      onUpdate([])
      return
    }
    const users = Object.values(snap.val() as Record<string, PresenceData>)
    onUpdate(users)
  })
}
