'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/home/HeroSection'
import ActiveTeamsSection from '@/components/home/ActiveTeamsSection'
import EisenhowerLogicSection from '@/components/home/EisenhowerLogicSection'
import HomeFooter from '@/components/home/HomeFooter'
import NewTeamModal from '@/components/home/NewTeamModal'
import { useAuth } from '@/lib/auth'
import { useMyTeams } from '@/hooks/useMyTeams'
import { createTeam } from '@/lib/firebase/teamRepository'

export default function HomePage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { teams, loading, setTeams } = useMyTeams(currentUser?.id ?? '')
  const [modalOpen, setModalOpen] = useState(false)

  const handleNewTeamClick = () => {
    if (!currentUser) { router.push('/login'); return }
    setModalOpen(true)
  }

  const handleCreateTeam = async (name: string) => {
    if (!currentUser) return
    const teamId = await createTeam(name, currentUser.id)
    setTeams((prev) => [...prev, { id: teamId, name, memberIds: [currentUser.id] }])
    setModalOpen(false)
    router.push(`/team/${teamId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection
          userName={currentUser?.name ?? null}
          onNewTeam={handleNewTeamClick}
        />
        <div className="border-t" />
        {currentUser && (
          <ActiveTeamsSection
            teams={loading ? [] : teams}
            users={[]}
          />
        )}
        <div className="border-t" />
        <EisenhowerLogicSection />
      </main>
      <HomeFooter />
      <NewTeamModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreate={handleCreateTeam}
      />
    </div>
  )
}
