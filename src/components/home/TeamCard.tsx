import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Team } from '@/types'

type TeamCardProps = {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/team/${team.id}`}>
      <Card className="w-56 shrink-0 cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{team.memberIds.length} members</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}
