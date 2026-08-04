'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TaskCard from '@/components/team/TaskCard'
import { getTeam } from '@/lib/firebase/teamRepository'
import { getCompletedTasks } from '@/lib/firebase/taskRepository'
import { getUsers } from '@/lib/firebase/userRepository'
import { compareWeekKeys, weekKeyToDisplay, type WeekLocale } from '@/lib/utils/week'
import { DEFAULT_PRIORITY_TAGS } from '@/lib/priority-tags'
import type { PriorityTag, Task, Team, User } from '@/types'

export default function TeamHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('TeamHistoryPage')
  const tp = useTranslations('TeamPage')
  const locale = useLocale() as WeekLocale
  const router = useRouter()
  const { id } = use(params)

  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [notAMember, setNotAMember] = useState(false)

  useEffect(() => {
    let isMounted = true

    Promise.all([getTeam(id), getCompletedTasks(id)])
      .then(async ([nextTeam, doneTasks]) => {
        if (!isMounted) return

        if (!nextTeam) {
          setTeam(null)
          return
        }

        setTeam(nextTeam)
        setTasks(doneTasks)
        const nextMembers = await getUsers(nextTeam.memberIds)
        if (!isMounted) return
        setMembers(nextMembers)
      })
      .catch(() => {
        if (!isMounted) return
        setNotAMember(true)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const priorityTags: PriorityTag[] = team?.priorityTags ?? DEFAULT_PRIORITY_TAGS

  const weekGroups = useMemo(() => {
    if (!tasks) return []
    const map = new Map<string, Task[]>()
    for (const task of tasks) {
      const list = map.get(task.weekKey) ?? []
      list.push(task)
      map.set(task.weekKey, list)
    }
    return Array.from(map.entries()).sort((a, b) => compareWeekKeys(b[0], a[0]))
  }, [tasks])

  if (notAMember) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{tp('notAMember')}</p>
        <Button variant="ghost" onClick={() => router.push('/')}>{tp('goHome')}</Button>
      </div>
    )
  }

  if (!team || tasks === null) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        {t('loading')}
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.push(`/team/${id}`)}
          aria-label={t('back')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">{team.name}</h1>
          <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {weekGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-8">
            {weekGroups.map(([weekKey, weekTasks]) => (
              <section key={weekKey}>
                <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                  {weekKeyToDisplay(weekKey, locale)}
                </h2>
                <div className="space-y-2">
                  {weekTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      assignee={members.find((m) => m.id === task.assigneeId)}
                      priorityTag={priorityTags.find((tag) => tag.id === task.priorityTagId)}
                      readOnly
                      onToggle={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
