import { create } from 'zustand'
import type { MatrixPosition, Task } from '@/types'
import { migrateIncompleteTasks } from '@/lib/utils/taskMigration'

type NewTaskInput = {
  teamId: string
  weekKey: string
  title: string
  description: string
  assigneeId: string
  deadline: string
}

type TaskUpdate = Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'deadline' | 'priorityTagId'>>

type TaskStore = {
  tasks: Task[]
  addTask: (input: NewTaskInput) => void
  updateTask: (taskId: string, fields: TaskUpdate) => void
  toggleTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
  moveToMatrix: (taskId: string, position: MatrixPosition) => void
  moveToSidebar: (taskId: string) => void
  getTasksByWeek: (teamId: string, weekKey: string) => Task[]
  migrateWeek: (teamId: string, fromWeekKey: string, toWeekKey: string) => void
  setTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  addTask: (input) => {
    const newTask: Task = {
      ...input,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'todo',
      matrixPosition: null,
    }
    set((state) => ({ tasks: [...state.tasks, newTask] }))
  },

  updateTask: (taskId, fields) => {
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...fields } : t),
    }))
  },

  toggleTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      ),
    }))
  },

  deleteTask: (taskId) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }))
  },

  moveToMatrix: (taskId, position) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, matrixPosition: position } : t
      ),
    }))
  },

  moveToSidebar: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, matrixPosition: null } : t
      ),
    }))
  },

  getTasksByWeek: (teamId, weekKey) => {
    return get().tasks.filter((t) => t.teamId === teamId && t.weekKey === weekKey)
  },

  migrateWeek: (teamId, fromWeekKey, toWeekKey) => {
    set((state) => ({
      tasks: migrateIncompleteTasks(
        state.tasks.filter((t) => t.teamId === teamId),
        fromWeekKey,
        toWeekKey
      ).concat(state.tasks.filter((t) => t.teamId !== teamId)),
    }))
  },

  setTasks: (tasks) => set({ tasks }),
}))
