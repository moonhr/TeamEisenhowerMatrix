'use client'

import DroppableQuadrant from './DroppableQuadrant'
import OnlineUsersBar from './OnlineUsersBar'
import type { MatrixPosition, PriorityTag, Task, User } from '@/types'

const QUADRANTS: { position: MatrixPosition; label: string }[] = [
  { position: 'do',        label: 'Do First' },
  { position: 'schedule',  label: 'Schedule' },
  { position: 'delegate',  label: 'Delegate' },
  { position: 'eliminate', label: 'Eliminate' },
]

type DndMatrixCanvasProps = {
  tasks: Task[]
  members: User[]
  onlineUsers: User[]
  priorityTags?: PriorityTag[]
  onToggle: (taskId: string) => void
  onEdit?: (task: Task) => void
  onMoveToSidebar: (taskId: string) => void
}

export default function DndMatrixCanvas({
  tasks,
  members,
  onlineUsers,
  priorityTags = [],
  onToggle,
  onEdit,
  onMoveToSidebar,
}: DndMatrixCanvasProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3 overflow-hidden p-3">
        {QUADRANTS.map(({ position, label }) => (
          <DroppableQuadrant
            key={position}
            position={position}
            label={label}
            tasks={tasks}
            members={members}
            priorityTags={priorityTags}
            onToggle={onToggle}
            onEdit={onEdit}
            onMoveToSidebar={onMoveToSidebar}
          />
        ))}
      </div>
      <OnlineUsersBar users={onlineUsers} />
    </div>
  )
}
