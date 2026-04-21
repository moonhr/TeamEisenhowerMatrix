import type { MatrixPosition, PriorityTag, Task, TaskStatus, Team, ThemeColor, User } from '@/types'

type RawData = Record<string, unknown>

export function toTask(id: string, data: RawData): Task {
  return {
    id,
    teamId:         String(data.teamId ?? ''),
    weekKey:        String(data.weekKey ?? ''),
    title:          String(data.title ?? ''),
    description:    String(data.description ?? ''),
    assigneeId:     String(data.assigneeId ?? ''),
    deadline:       String(data.deadline ?? ''),
    status:         (data.status as TaskStatus) ?? 'todo',
    matrixPosition: (data.matrixPosition as MatrixPosition) ?? null,
    priorityTagId:  data.priorityTagId ? String(data.priorityTagId) : undefined,
  }
}

export function fromTask(task: Task): RawData {
  const { id: _id, priorityTagId, ...rest } = task
  return priorityTagId !== undefined ? { ...rest, priorityTagId } : { ...rest }
}

export function toTeam(id: string, data: RawData): Team {
  return {
    id,
    name:       String(data.name ?? ''),
    memberIds:  Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
    inviteCode:    data.inviteCode ? String(data.inviteCode) : undefined,
    creatorId:     data.creatorId ? String(data.creatorId) : undefined,
    priorityTags:  Array.isArray(data.priorityTags) ? (data.priorityTags as PriorityTag[]) : undefined,
  }
}

export function toUser(id: string, data: RawData): User {
  return {
    id,
    name:        String(data.name ?? ''),
    avatar:      String(data.avatar ?? ''),
    themeColor:  (data.themeColor as ThemeColor) ?? 'violet',
    colorScheme: (data.colorScheme as 'light' | 'dark') ?? 'light',
  }
}
