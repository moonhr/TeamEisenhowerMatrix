import { useTranslations } from 'next-intl'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function EisenhowerLogicSection() {
  const t = useTranslations('EisenhowerLogicSection')
  const logicCards = [
    {
      title: t('doFirst'),
      label: t('doFirstLabel'),
      description: t('doFirstDescription'),
      color: 'border-red-400',
    },
    {
      title: t('schedule'),
      label: t('scheduleLabel'),
      description: t('scheduleDescription'),
      color: 'border-blue-400',
    },
    {
      title: t('delegate'),
      label: t('delegateLabel'),
      description: t('delegateDescription'),
      color: 'border-yellow-400',
    },
    {
      title: t('eliminate'),
      label: t('eliminateLabel'),
      description: t('eliminateDescription'),
      color: 'border-slate-400',
    },
  ]

  return (
    <section id="features" className="scroll-mt-20 py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h3 className="mb-6 text-lg font-semibold">{t('title')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {logicCards.map((card) => (
            <Card key={card.title} className={`border-t-4 ${card.color}`}>
              <CardHeader className="pb-2">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <CardTitle className="text-base">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
