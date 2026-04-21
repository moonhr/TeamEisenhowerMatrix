import type { User } from '@/types'

export type PresenceData = {
  teamId: string
  userId: string
  name: string
  avatar: string
  lastSeen: number
}

const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000

export function buildPresenceData(teamId: string, user: User): PresenceData {
  return {
    teamId,
    userId:   user.id,
    name:     user.name,
    avatar:   user.avatar,
    lastSeen: Date.now(),
  }
}

export function isPresenceActive(lastSeen: number): boolean {
  return Date.now() - lastSeen < ACTIVE_THRESHOLD_MS
}
