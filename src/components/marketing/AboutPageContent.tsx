import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AboutPageContent() {
  const t = useTranslations('AboutPage')

  const stories = [
    {
      label: '01',
      title: t('stories.meeting.title'),
      description: t('stories.meeting.description'),
    },
    {
      label: '02',
      title: t('stories.sorting.title'),
      description: t('stories.sorting.description'),
    },
    {
      label: '03',
      title: t('stories.expansion.title'),
      description: t('stories.expansion.description'),
    },
  ]

  const principles = [
    {
      title: t('principles.balance.title'),
      description: t('principles.balance.description'),
    },
    {
      title: t('principles.reason.title'),
      description: t('principles.reason.description'),
    },
    {
      title: t('principles.alignment.title'),
      description: t('principles.alignment.description'),
    },
  ]

  const invitationPrompts = [
    t('invitationPrompts.one'),
    t('invitationPrompts.two'),
    t('invitationPrompts.three'),
  ]

  return (
    <main className="flex-1">
      <section className="border-b bg-linear-to-b from-background via-background to-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-18 md:px-6 md:py-24">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            {t('eyebrow')}
          </p>
          <div className="mt-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
              {t('description')}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/features"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 shadow-sm')}
            >
              {t('primaryCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              {t('secondaryCta')}
            </Link>
          </div>
          <Card className="mt-10 max-w-3xl border-primary/20 bg-primary/5">
            <CardHeader className="gap-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                {t('originCard.label')}
              </p>
              <CardTitle className="text-xl md:text-2xl">
                {t('originCard.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {t('originCard.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('storyTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              {t('storyDescription')}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stories.map((story) => {
              return (
                <Card key={story.title} className="border-t-4 border-t-primary/70">
                  <CardHeader className="gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                      {story.label}
                    </p>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-6 text-muted-foreground">
                      {story.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('principlesTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              {t('principlesDescription')}
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {principles.map((principle) => (
              <Card key={principle.title} className="bg-background">
                <CardHeader>
                  <CardTitle>{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('invitationTitle')}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t('invitationDescription')}
            </p>
          </div>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>{t('invitationCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="leading-6 text-muted-foreground">
                {t('invitationCardDescription')}
              </p>
              <ol className="space-y-3 text-sm leading-6 text-muted-foreground">
                {invitationPrompts.map((prompt, index) => (
                  <li key={prompt} className="flex gap-3">
                    <span className="font-medium text-foreground">
                      {index + 1}.
                    </span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('invitationFooter')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
