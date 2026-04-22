import Link from 'next/link'
import {
  ArrowRight,
  Clock3,
  Grip,
  Search,
  Tags,
  Users,
  Waves,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FeaturesPageContent() {
  const t = useTranslations('FeaturesPage')

  const features = [
    {
      icon: Grip,
      title: t('items.matrix.title'),
      description: t('items.matrix.description'),
    },
    {
      icon: Users,
      title: t('items.team.title'),
      description: t('items.team.description'),
    },
    {
      icon: Waves,
      title: t('items.realtime.title'),
      description: t('items.realtime.description'),
    },
    {
      icon: Search,
      title: t('items.search.title'),
      description: t('items.search.description'),
    },
    {
      icon: Tags,
      title: t('items.tags.title'),
      description: t('items.tags.description'),
    },
    {
      icon: Clock3,
      title: t('items.weeks.title'),
      description: t('items.weeks.description'),
    },
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
              href="/join"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 shadow-sm')}
            >
              {t('primaryCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              {t('secondaryCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('gridTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              {t('gridDescription')}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <Card key={feature.title} className="border-t-4 border-t-primary/60">
                  <CardHeader className="gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-14 md:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('workflowTitle')}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {t('workflowDescription')}
            </p>
          </div>
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>{t('workflowCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">{t('workflowCard.steps.capture.title')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t('workflowCard.steps.capture.description')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('workflowCard.steps.align.title')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t('workflowCard.steps.align.description')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('workflowCard.steps.review.title')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t('workflowCard.steps.review.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
