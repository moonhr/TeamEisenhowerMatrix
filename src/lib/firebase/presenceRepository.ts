import {
  doc, setDoc, deleteDoc, collection,
  query, where, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import { buildPresenceData, isPresenceActive, type PresenceData } from '@/lib/utils/presence'
import type { User } from '@/types'

export type { PresenceData }
export { buildPresenceData, isPresenceActive }

const COL = 'presence'

export async function setPresence(teamId: string, user: User): Promise<void> {
  const id = `${teamId}_${user.id}`
  await setDoc(doc(db, COL, id), buildPresenceData(teamId, user))
}

export async function removePresence(teamId: string, userId: string): Promise<void> {
  await deleteDoc(doc(db, COL, `${teamId}_${userId}`))
}

export function subscribeToPresence(
  teamId: string,
  onUpdate: (users: PresenceData[]) => void
): Unsubscribe {
  const q = query(collection(db, COL), where('teamId', '==', teamId))
  return onSnapshot(q, (snap) => {
    const active = snap.docs
      .map((d) => d.data() as PresenceData)
      .filter((p) => isPresenceActive(p.lastSeen))
    onUpdate(active)
  })
}
