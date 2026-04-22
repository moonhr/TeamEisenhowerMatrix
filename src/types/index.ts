export const APP_LOCALES = ['ko', 'en', 'en-GB', 'ja', 'fr', 'de'] as const

export type AppLocale = typeof APP_LOCALES[number]

export type ThemeColor =
  | 'violet'
  | 'blue'
  | 'green'
  | 'orange'
  | 'rose'
  | 'slate'

export type ColorScheme = 'light' | 'dark'

export type User = {
  id: string
  name: string
  avatar: string
  themeColor: ThemeColor
  colorScheme: ColorScheme
  locale?: AppLocale
}

export type PriorityTag = {
  id: string
  label: string
  color: string
}

export type Team = {
  id: string
  name: string
  memberIds: string[]
  inviteCode?: string
  creatorId?: string
  priorityTags?: PriorityTag[]
}

export type MatrixPosition = 'do' | 'schedule' | 'delegate' | 'eliminate'

export type TaskStatus = 'todo' | 'done'

export type Task = {
  id: string
  teamId: string
  weekKey: string
  title: string
  description: string
  assigneeId: string
  deadline: string
  status: TaskStatus
  matrixPosition: MatrixPosition | null
  priorityTagId?: string
}

export type WeekPage = {
  teamId: string
  weekKey: string
}
