import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query as firestoreQuery, where, orderBy, getDocs, onSnapshot,
  serverTimestamp, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import { toTask, fromTask } from './converters'
import type { MatrixPosition, Task, TaskStatus } from '@/types'

const COL = 'tasks'

export async function getTasksByWeek(teamId: string, weekKey: string): Promise<Task[]> {
  const q = firestoreQuery(
    collection(db, COL),
    where('teamId', '==', teamId),
    where('weekKey', '==', weekKey)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => toTask(d.id, d.data()))
}

export async function addTask(
  task: Omit<Task, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...fromTask({ ...task, id: '' }),
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  await updateDoc(doc(db, COL, taskId), { status })
}

export async function updateTask(
  taskId: string,
  fields: Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'deadline' | 'priorityTagId'>>
): Promise<void> {
  await updateDoc(doc(db, COL, taskId), fields)
}

export async function updateMatrixPosition(
  taskId: string,
  matrixPosition: MatrixPosition | null
): Promise<void> {
  await updateDoc(doc(db, COL, taskId), { matrixPosition })
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COL, taskId))
}

export async function updatePriorityTag(taskId: string, priorityTagId: string | null): Promise<void> {
  await updateDoc(doc(db, COL, taskId), { priorityTagId: priorityTagId ?? null })
}

export async function searchTasksByTitle(teamIds: string[], query: string): Promise<Task[]> {
  if (!teamIds.length || !query) return []
  const end = query + '\uf8ff'
  const results: Task[] = []
  for (const teamId of teamIds) {
    const q = firestoreQuery(
      collection(db, COL),
      where('teamId', '==', teamId),
      where('title', '>=', query),
      where('title', '<=', end)
    )
    const snap = await getDocs(q)
    snap.docs.forEach((d) => results.push(toTask(d.id, d.data())))
  }
  return results
}

export function subscribeToTasks(
  teamId: string,
  weekKey: string,
  onUpdate: (tasks: Task[]) => void
): Unsubscribe {
  const q = firestoreQuery(
    collection(db, COL),
    where('teamId', '==', teamId),
    where('weekKey', '==', weekKey),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => toTask(d.id, d.data())))
  })
}
