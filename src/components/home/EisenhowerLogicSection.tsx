import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const LOGIC_CARDS = [
  {
    title: 'Do First',
    label: '긴급 + 중요',
    description: '긴급하고 중요한 일. 즉시 실행해야 하는 핵심 과제입니다.',
    color: 'border-red-400',
  },
  {
    title: 'Schedule',
    label: '중요 + 여유',
    description: '중요하지만 급하지 않은 일. 장기 성과를 만드는 전략 과제입니다.',
    color: 'border-blue-400',
  },
  {
    title: 'Delegate',
    label: '긴급 + 덜 중요',
    description: '급하지만 덜 중요한 일. 위임 또는 분산이 필요한 운영성 작업입니다.',
    color: 'border-yellow-400',
  },
  {
    title: 'Eliminate',
    label: '낮은 우선순위',
    description: '급하지도 중요하지도 않은 일. 줄이거나 제거해야 할 잡음입니다.',
    color: 'border-slate-400',
  },
]

export default function EisenhowerLogicSection() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h3 className="mb-6 text-lg font-semibold">The Team Eisenhower Logic</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOGIC_CARDS.map((card) => (
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
