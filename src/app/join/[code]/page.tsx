'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { getTeamByInviteCode, addMember } from '@/lib/firebase/teamRepository'
import { useCurrentUser } from '@/lib/auth'
import type { Team } from '@/types'

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const t = useTranslations('JoinCodePage')
  const { code } = use(params)
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound' | 'joining'>('loading')

  useEffect(() => {
    getTeamByInviteCode(code).then((t) => {
      if (t) { setTeam(t); setStatus('found') }
      else setStatus('notfound')
    })
  }, [code])

  const handleJoin = async () => {
    if (!team) return
    setStatus('joining')
    await addMember(team.id, currentUser.id)
    router.push(`/team/${team.id}`)
  }

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">{t('loading')}</div>
  }

  if (status === 'notfound') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">{t('invalidInvite')}</p>
        <Button variant="ghost" onClick={() => router.push('/')}>{t('goHome')}</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t('invitedTeam')}</p>
        <h1 className="mt-1 text-2xl font-bold">{team?.name}</h1>
      </div>
      <Button onClick={handleJoin} disabled={status === 'joining'}>
        {status === 'joining' ? t('joining') : t('joinTeam')}
      </Button>
    </div>
  )
}
