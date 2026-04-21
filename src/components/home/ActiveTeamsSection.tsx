import TeamCard from './TeamCard'
import type { Team, User } from '@/types'

type ActiveTeamsSectionProps = {
  teams: Team[]
  users: User[]
}

export default function ActiveTeamsSection({ teams }: ActiveTeamsSectionProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h3 className="mb-4 text-lg font-semibold">My Active Teams</h3>
        {teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">참가중인 팀이 없습니다.</p>
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
