'use client'

import Link from 'next/link'
import { Plus, Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HeroSectionProps = {
  userName: string | null
  onNewTeam: () => void
}

export default function HeroSection({ userName, onNewTeam }: HeroSectionProps) {
  const t = useTranslations('HeroSection')

  return (
    <section id="about" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Team Eisenhower
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {userName
            ? t('greetingWithName', { name: userName })
            : t('greetingWithoutName')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onNewTeam} size="lg" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            {t('newTeam')}
          </Button>
          <Link
            href="/join"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2 shadow-sm')}
          >
            <Link2 className="h-4 w-4" />
            {t('joinWithInvite')}
          </Link>
        </div>
      </div>
    </section>
  )
}
