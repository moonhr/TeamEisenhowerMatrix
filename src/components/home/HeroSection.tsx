'use client'

import Link from 'next/link'
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
          Team Prioritization Matrix
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {userName
            ? <>안녕하세요, <span className="font-medium text-foreground">{userName}</span>님! 팀과 함께 우선순위를 정리해보세요.</>
            : '팀과 함께 우선순위를 정리해보세요.'}
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={onNewTeam} size="lg">
            + New Team
          </Button>
          <Link href="/join" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            초대 링크로 참가
          </Link>
        </div>
      </div>
    </section>
  )
}
