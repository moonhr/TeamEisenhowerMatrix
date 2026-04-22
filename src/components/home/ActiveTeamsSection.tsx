import { useTranslations } from 'next-intl'
import TeamCard from './TeamCard'
import type { Team, User } from '@/types'

type ActiveTeamsSectionProps = {
  teams: Team[]
  users: User[]
}

export default function ActiveTeamsSection({ teams }: ActiveTeamsSectionProps) {
  const t = useTranslations('ActiveTeamsSection')

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h3 className="mb-4 text-lg font-semibold">{t('title')}</h3>
        {teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
