import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where, documentId } from 'firebase/firestore'
import { db } from './config'
import { toUser } from './converters'
import type { User } from '@/types'

const COL = 'users'

export async function getUser(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, COL, userId))
  if (!snap.exists()) return null
  return toUser(snap.id, snap.data())
}

export async function createUser(userId: string, data: Omit<User, 'id'>): Promise<void> {
  await setDoc(doc(db, COL, userId), data)
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, userId), updates)
}

export async function getUsers(userIds: string[]): Promise<User[]> {
  if (userIds.length === 0) return []
  // Firestore 'in' query는 최대 30개 — 필요 시 청크 처리
  const chunks: string[][] = []
  for (let i = 0; i < userIds.length; i += 30) chunks.push(userIds.slice(i, i + 30))
  const results: User[] = []
  for (const chunk of chunks) {
    const snap = await getDocs(query(collection(db, COL), where(documentId(), 'in', chunk)))
    snap.forEach((d) => results.push(toUser(d.id, d.data())))
  }
  return results
}
