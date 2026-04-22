'use client'

import { useLocale, useTranslations } from 'next-intl'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getPreviousWeeks, weekKeyToDisplay, type WeekLocale } from '@/lib/utils/week'

type PreviousWeekModalProps = {
  open: boolean
  currentWeekKey: string
  onOpenChange: (open: boolean) => void
  onSelect: (weekKey: string) => void
}

const WEEK_COUNT = 8

export default function PreviousWeekModal({
  open,
  currentWeekKey,
  onOpenChange,
  onSelect,
}: PreviousWeekModalProps) {
  const t = useTranslations('PreviousWeekModal')
  const locale = useLocale() as WeekLocale
  const weeks = getPreviousWeeks(currentWeekKey, WEEK_COUNT)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <div className="flex flex-col gap-1">
          {weeks.map((weekKey) => (
            <Button
              key={weekKey}
              variant="ghost"
              className="justify-start"
              onClick={() => { onSelect(weekKey); onOpenChange(false) }}
            >
              {weekKeyToDisplay(weekKey, locale)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
