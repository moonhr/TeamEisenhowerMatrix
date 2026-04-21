import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, arrayUnion, arrayRemove, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import { toTeam } from './converters'
import { DEFAULT_PRIORITY_TAGS } from '@/lib/priority-tags'
import type { PriorityTag, Team } from '@/types'

const COL = 'teams'

function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function createTeam(name: string, creatorId: string): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    name,
    memberIds: [creatorId],
    creatorId,
    inviteCode: generateInviteCode(),
    priorityTags: DEFAULT_PRIORITY_TAGS,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const snap = await getDoc(doc(db, COL, teamId))
  if (!snap.exists()) return null
  return toTeam(snap.id, snap.data())
}

export async function getTeamsByUser(userId: string): Promise<Team[]> {
  const q = query(collection(db, COL), where('memberIds', 'array-contains', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => toTeam(d.id, d.data()))
}

export async function getTeamByInviteCode(inviteCode: string): Promise<Team | null> {
  const q = query(collection(db, COL), where('inviteCode', '==', inviteCode))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return toTeam(d.id, d.data())
}

export async function addMember(teamId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, COL, teamId), { memberIds: arrayUnion(userId) })
}

export async function renameTeam(teamId: string, name: string): Promise<void> {
  await updateDoc(doc(db, COL, teamId), { name })
}

export async function deleteTeam(teamId: string): Promise<void> {
  await deleteDoc(doc(db, COL, teamId))
}

export async function leaveTeam(teamId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, COL, teamId), { memberIds: arrayRemove(userId) })
}

export async function updatePriorityTags(teamId: string, tags: PriorityTag[]): Promise<void> {
  await updateDoc(doc(db, COL, teamId), { priorityTags: tags })
}
