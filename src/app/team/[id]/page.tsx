'use client'

import { use, useEffect, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import TeamHeader from '@/components/team/TeamHeader'
import DroppableTaskSidebar from '@/components/team/DroppableTaskSidebar'
import DndMatrixCanvas from '@/components/team/DndMatrixCanvas'
import MatrixCanvas from '@/components/team/MatrixCanvas'
import TaskSidebar from '@/components/team/TaskSidebar'
import TaskCard from '@/components/team/TaskCard'
import PreviousWeekModal from '@/components/team/PreviousWeekModal'
import { compareWeekKeys, getCurrentWeekKey, isValidWeekKey } from '@/lib/utils/week'
import { applyDragEnd, type DropZoneId } from '@/lib/utils/dnd'
import { useTaskStore } from '@/stores/taskStore'
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks'
import { usePresence } from '@/hooks/usePresence'
import PriorityTagManager from '@/components/team/PriorityTagManager'
import TaskEditModal from '@/components/team/TaskEditModal'
import CursorOverlay from '@/components/team/CursorOverlay'
import { getTeam, updatePriorityTags } from '@/lib/firebase/teamRepository'
import * as taskRepo from '@/lib/firebase/taskRepository'
import { DEFAULT_PRIORITY_TAGS } from '@/lib/priority-tags'
import { useCurrentUser } from '@/lib/auth'
import { useCursor } from '@/hooks/useCursor'
import { getUsers } from '@/lib/firebase/userRepository'
import type { MatrixPosition, PriorityTag, Task, Team, User } from '@/types'

type NewTaskInput = Omit<Task, 'id' | 'teamId' | 'weekKey' | 'status' | 'matrixPosition'>

type TeamPageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function getSingleSearchParamValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

function resolveViewWeekKey(
  requestedWeekKey: string | null,
  currentWeekKey: string,
  earliestWeekKey: string | null | undefined
): string {
  if (!requestedWeekKey || !isValidWeekKey(requestedWeekKey)) return currentWeekKey
  if (compareWeekKeys(requestedWeekKey, currentWeekKey) > 0) return currentWeekKey
  if (earliestWeekKey && compareWeekKeys(requestedWeekKey, earliestWeekKey) < 0) return earliestWeekKey
  return requestedWeekKey
}

function buildTeamWeekHref(teamId: string, currentWeekKey: string, targetWeekKey: string) {
  if (targetWeekKey === currentWeekKey) return `/team/${teamId}`
  return `/team/${teamId}?week=${targetWeekKey}`
}

export default function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: TeamPageSearchParams
}) {
  const t = useTranslations('TeamPage')
  const router = useRouter()
  const { id } = use(params)
  const query = use(searchParams)
  const currentWeekKey = getCurrentWeekKey()
  const currentUser = useCurrentUser()
  const requestedWeekKey = getSingleSearchParamValue(query.week)

  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [earliestWeekKey, setEarliestWeekKey] = useState<string | null | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const viewWeekKey = resolveViewWeekKey(requestedWeekKey, currentWeekKey, earliestWeekKey)
  const canonicalWeekKey = viewWeekKey === currentWeekKey ? null : viewWeekKey
  const isReadOnly = viewWeekKey !== currentWeekKey

  const { tasks, setTasks, updateTask, toggleTask, deleteTask, moveToSidebar, getTasksByWeek } =
    useTaskStore()

  useEffect(() => {
    let isMounted = true

    Promise.all([getTeam(id), taskRepo.getEarliestWeekKey(id)]).then(async ([nextTeam, earliest]) => {
      if (!isMounted) return

      setEarliestWeekKey(earliest)

      if (!nextTeam) {
        setTeam(null)
        setMembers([])
        return
      }

      setTeam(nextTeam)
      const nextMembers = await getUsers(nextTeam.memberIds)
      if (!isMounted) return
      setMembers(nextMembers)
    })

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    if (earliestWeekKey === undefined) return

    const currentUrlWeekKey = requestedWeekKey
    const hasCanonicalMismatch = canonicalWeekKey !== currentUrlWeekKey

    if (!hasCanonicalMismatch) return

    router.replace(
      canonicalWeekKey
        ? buildTeamWeekHref(id, currentWeekKey, canonicalWeekKey)
        : `/team/${id}`,
      { scroll: false }
    )
  }, [canonicalWeekKey, currentWeekKey, earliestWeekKey, id, requestedWeekKey, router])

  useRealtimeTasks(id, viewWeekKey)
  const { onlineUsers: presenceList } = usePresence(id, currentUser)
  const { remoteCursors } = useCursor(id, currentUser)

  const weekTasks = getTasksByWeek(id, viewWeekKey)
  const onlineUsers = presenceList.length > 0
    ? presenceList.map((p) => ({ id: p.userId, name: p.name, avatar: p.avatar, themeColor: 'violet' as const, colorScheme: 'light' as const }))
    : members

  const handleAddTask = async (input: NewTaskInput) => {
    await taskRepo.addTask({ ...input, teamId: id, weekKey: viewWeekKey, status: 'todo', matrixPosition: null })
  }

  const handleToggleTask = async (taskId: string) => {
    toggleTask(taskId)
    const task = tasks.find((t) => t.id === taskId)
    if (task) await taskRepo.updateTaskStatus(taskId, task.status === 'todo' ? 'done' : 'todo')
  }

  const handleDeleteTask = async (taskId: string) => {
    deleteTask(taskId)
    await taskRepo.deleteTask(taskId)
  }

  const priorityTags: PriorityTag[] = team?.priorityTags ?? DEFAULT_PRIORITY_TAGS

  const handleEditTask = async (
    taskId: string,
    fields: Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'deadline' | 'priorityTagId'>>
  ) => {
    updateTask(taskId, fields)
    await taskRepo.updateTask(taskId, fields)
  }

  const handleSaveTags = async (tags: PriorityTag[]) => {
    await updatePriorityTags(id, tags)
    setTeam((prev) => prev ? { ...prev, priorityTags: tags } : prev)
  }

  const handleMoveToSidebar = async (taskId: string) => {
    moveToSidebar(taskId)
    await taskRepo.updateMatrixPosition(taskId, null)
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over) return
    const overId = over.id as DropZoneId
    setTasks(applyDragEnd(tasks, String(active.id), overId))
    const newPosition: MatrixPosition | null = overId === 'sidebar' ? null : overId
    await taskRepo.updateMatrixPosition(String(active.id), newPosition)
  }

  if (!team) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        {t('loading')}
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <TeamHeader
        teamName={team.name}
        weekKey={viewWeekKey}
        inviteCode={team.inviteCode}
        onPreviousWeek={() => setModalOpen(true)}
        onManageTags={() => setTagModalOpen(true)}
      />

      {/* 이전 주차 read-only 배너 */}
      {isReadOnly && (
        <div className="flex items-center justify-between bg-amber-50 px-4 py-2 text-xs text-amber-700 border-b border-amber-200">
          <span>{t('readOnlyBanner')}</span>
          <button
            className="font-medium underline"
            onClick={() => router.push(`/team/${id}`, { scroll: false })}
          >
            {t('backToCurrentWeek')}
          </button>
        </div>
      )}

      {isReadOnly && weekTasks.length === 0 && (
        <div className="border-b bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          {t('emptyWeek')}
        </div>
      )}

      {isReadOnly ? (
        /* 읽기 전용: 드래그 없는 정적 뷰 */
        <div className="flex flex-1 overflow-hidden">
          <TaskSidebar
            tasks={weekTasks}
            members={members}
            priorityTags={priorityTags}
            readOnly
            onAddTask={() => {}}
            onToggleTask={() => {}}
            onDeleteTask={() => {}}
          />
          <main className="flex-1 overflow-hidden">
            <MatrixCanvas
              tasks={weekTasks}
              members={members}
              onlineUsers={onlineUsers}
              priorityTags={priorityTags}
              readOnly
              onToggle={() => {}}
            />
          </main>
        </div>
      ) : (
        /* 현재 주차: 드래그 활성 */
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveTask((active.data.current as { task?: Task })?.task ?? null)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 overflow-hidden">
            <DroppableTaskSidebar
              tasks={weekTasks}
              members={members}
              priorityTags={priorityTags}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onEditTask={setEditingTask}
              onDeleteTask={handleDeleteTask}
            />
            <main className="flex-1 overflow-hidden">
              <DndMatrixCanvas
                tasks={weekTasks}
                members={members}
                onlineUsers={onlineUsers}
                priorityTags={priorityTags}
                onToggle={handleToggleTask}
                onEdit={setEditingTask}
                onMoveToSidebar={handleMoveToSidebar}
              />
            </main>
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="w-64 rotate-2 opacity-90">
                <TaskCard
                  task={activeTask}
                  assignee={members.find((m) => m.id === activeTask.assigneeId)}
                  onToggle={() => {}}
                  onDelete={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <PreviousWeekModal
        open={modalOpen}
        earliestWeekKey={earliestWeekKey ?? currentWeekKey}
        currentWeekKey={currentWeekKey}
        selectedWeekKey={viewWeekKey}
        isLoading={earliestWeekKey === undefined}
        onOpenChange={setModalOpen}
        onSelect={(wk) => router.push(buildTeamWeekHref(id, currentWeekKey, wk), { scroll: false })}
      />

      <TaskEditModal
        task={editingTask}
        members={members}
        priorityTags={priorityTags}
        onSave={handleEditTask}
        onDelete={handleDeleteTask}
        onClose={() => setEditingTask(null)}
      />

      <CursorOverlay cursors={remoteCursors} />

      <PriorityTagManager
        open={tagModalOpen}
        onOpenChange={setTagModalOpen}
        tags={priorityTags}
        onSave={handleSaveTags}
      />
    </div>
  )
}
