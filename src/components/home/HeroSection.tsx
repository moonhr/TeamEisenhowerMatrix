'use client'

import Link from 'next/link'
import { Plus, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HeroSectionProps = {
  userName: string | null
  onNewTeam: () => void
}

export default function HeroSection({ userName, onNewTeam }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Team Eisenhower
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {userName
            ? <>안녕하세요, <span className="font-medium text-foreground">{userName}</span>님! 팀과 함께 우선순위를 정리해보세요.</>
            : '팀과 함께 우선순위를 정리해보세요.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onNewTeam} size="lg" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            New Team
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 shadow-sm">
            <Link href="/join">
              <Link2 className="h-4 w-4" />
              초대 링크로 참가
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
