'use client'

import { useEffect } from 'react'
import { subscribeToTasks } from '@/lib/firebase/taskRepository'
import { useTaskStore } from '@/stores/taskStore'

export function useRealtimeTasks(teamId: string, weekKey: string) {
  const setTasks = useTaskStore((s) => s.setTasks)
  const tasks    = useTaskStore((s) => s.tasks)

  useEffect(() => {
    if (!teamId || !weekKey) return

    const unsubscribe = subscribeToTasks(teamId, weekKey, (incoming) => {
      // 다른 팀/주차 태스크는 유지하고 이 팀/주차만 교체
      setTasks([
        ...tasks.filter((t) => !(t.teamId === teamId && t.weekKey === weekKey)),
        ...incoming,
      ])
    })

    return () => unsubscribe()
  }, [teamId, weekKey]) // eslint-disable-line react-hooks/exhaustive-deps
}
