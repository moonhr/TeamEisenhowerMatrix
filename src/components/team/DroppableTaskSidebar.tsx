'use client'

import { useDroppable } from '@dnd-kit/core'
import DraggableTaskCard from './DraggableTaskCard'
import TaskForm from './TaskForm'
import { cn } from '@/lib/utils'
import type { PriorityTag, Task, User } from '@/types'

type NewTaskInput = Omit<Task, 'id' | 'teamId' | 'weekKey' | 'status' | 'matrixPosition'>

type DroppableTaskSidebarProps = {
  tasks: Task[]
  members: User[]
  priorityTags?: PriorityTag[]
  onAddTask: (task: NewTaskInput) => void
  onToggleTask: (taskId: string) => void
  onEditTask?: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export default function DroppableTaskSidebar({
  tasks,
  members,
  priorityTags = [],
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: DroppableTaskSidebarProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'sidebar' })
  const sidebarTasks = tasks.filter((t) => t.matrixPosition === null)

  return (
    <aside
      ref={setNodeRef}
      className={cn(
        'flex h-full w-72 shrink-0 flex-col gap-3 border-r p-3 transition-colors',
        isOver && 'bg-muted/40'
      )}
    >
      <h4 className="text-sm font-semibold">Task Inbox</h4>
      <TaskForm members={members} priorityTags={priorityTags} onSubmit={onAddTask} />
      <div className="flex-1 space-y-1 overflow-y-auto">
        {sidebarTasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            assignee={members.find((m) => m.id === task.assigneeId)}
            priorityTag={priorityTags.find((t) => t.id === task.priorityTagId)}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
        {sidebarTasks.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            태스크가 없습니다
          </p>
        )}
      </div>
    </aside>
  )
}
