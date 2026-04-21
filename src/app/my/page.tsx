'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import DisplayNameForm from '@/components/my/DisplayNameForm'
import AvatarSelector from '@/components/my/AvatarSelector'
import ThemeColorSelector from '@/components/my/ThemeColorSelector'
import ColorSchemeSelector from '@/components/my/ColorSchemeSelector'
import TeamManagement from '@/components/my/TeamManagement'
import RenameTeamModal from '@/components/my/RenameTeamModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { AVATARS } from '@/lib/mock-data'
import { getTeamsByUser, deleteTeam, leaveTeam, renameTeam } from '@/lib/firebase/teamRepository'
import { updateUser } from '@/lib/firebase/userRepository'
import type { Team, ThemeColor, ColorScheme } from '@/types'

export default function MyPage() {
  const { currentUser, setCurrentUser, signOut } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [renamingTeam, setRenamingTeam] = useState<Team | null>(null)

  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    avatar: currentUser?.avatar ?? '',
    themeColor: currentUser?.themeColor ?? 'violet',
    colorScheme: currentUser?.colorScheme ?? 'light',
  })

  useEffect(() => {
    if (!currentUser) { router.replace('/'); return }
    setLoadingTeams(true)
    getTeamsByUser(currentUser.id).then((data) => { setTeams(data); setLoadingTeams(false) })
  }, [currentUser?.id])

  const handleRename = async (teamId: string, name: string) => {
    await renameTeam(teamId, name)
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, name } : t))
  }

  const handleDelete = async (teamId: string) => {
    await deleteTeam(teamId)
    setTeams((prev) => prev.filter((t) => t.id !== teamId))
  }

  const handleLeave = async (teamId: string) => {
    if (!currentUser) return
    await leaveTeam(teamId, currentUser.id)
    setTeams((prev) => prev.filter((t) => t.id !== teamId))
    router.push('/')
  }

  const isDirty = currentUser
    ? form.name !== currentUser.name ||
      form.avatar !== currentUser.avatar ||
      form.themeColor !== currentUser.themeColor ||
      form.colorScheme !== currentUser.colorScheme
    : false

  const handleSave = async () => {
    if (!currentUser || !form.name.trim()) return
    const updates = { ...form, name: form.name.trim() }
    setCurrentUser({ ...currentUser, ...updates })
    await updateUser(currentUser.id, updates)
  }

  const handleReset = () => {
    if (!currentUser) return
    setForm({
      name: currentUser.name,
      avatar: currentUser.avatar,
      themeColor: currentUser.themeColor,
      colorScheme: currentUser.colorScheme,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 md:px-6">
        <div className="space-y-10">
          <DisplayNameForm
            value={form.name}
            onChange={(name) => setForm((f) => ({ ...f, name }))}
          />
          <div className="border-t" />
          <AvatarSelector
            avatars={AVATARS}
            selected={form.avatar}
            onChange={(avatar) => setForm((f) => ({ ...f, avatar }))}
          />
          <div className="border-t" />
          <ThemeColorSelector
            selected={form.themeColor as ThemeColor}
            onChange={(themeColor) => setForm((f) => ({ ...f, themeColor }))}
          />
          <div className="border-t" />
          <ColorSchemeSelector
            selected={form.colorScheme as ColorScheme}
            onChange={(colorScheme) => setForm((f) => ({ ...f, colorScheme }))}
          />
          <div className="border-t" />
          <TeamManagement
            teams={teams}
            loading={loadingTeams}
            currentUserId={currentUser?.id ?? ''}
            onRename={(id) => setRenamingTeam(teams.find((t) => t.id === id) ?? null)}
            onExit={handleLeave}
            onDelete={handleDelete}
          />
        </div>

        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={!isDirty}>
              저장
            </Button>
            {isDirty && (
              <Button variant="ghost" onClick={handleReset}>
                되돌리기
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={async () => { await signOut(); router.push('/') }}
          >
            로그아웃
          </Button>
        </div>
      </main>

      <RenameTeamModal
        open={!!renamingTeam}
        currentName={renamingTeam?.name ?? ''}
        onOpenChange={(open) => { if (!open) setRenamingTeam(null) }}
        onRename={(name) => handleRename(renamingTeam!.id, name)}
      />
    </div>
  )
}
