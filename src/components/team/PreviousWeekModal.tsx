'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addWeeks, getWeekRange, weekKeyToDisplay, type WeekLocale } from '@/lib/utils/week'

type PreviousWeekModalProps = {
  open: boolean
  earliestWeekKey: string
  currentWeekKey: string
  selectedWeekKey: string
  isLoading?: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (weekKey: string) => void
}

export default function PreviousWeekModal({
  open,
  earliestWeekKey,
  currentWeekKey,
  selectedWeekKey,
  isLoading = false,
  onOpenChange,
  onSelect,
}: PreviousWeekModalProps) {
  const commonT = useTranslations('Common')
  const t = useTranslations('PreviousWeekModal')
  const locale = useLocale() as WeekLocale
  const weekOptions = useMemo(() => (
    getWeekRange(earliestWeekKey, addWeeks(currentWeekKey, -1)).reverse()
  ), [currentWeekKey, earliestWeekKey])
  const defaultWeekKey = weekOptions.includes(selectedWeekKey)
    ? selectedWeekKey
    : (weekOptions[0] ?? '')
  const [pendingWeekKey, setPendingWeekKey] = useState(defaultWeekKey)

  useEffect(() => {
    if (!open) return
    setPendingWeekKey(defaultWeekKey)
  }, [defaultWeekKey, open])

  const handleConfirm = () => {
    if (!pendingWeekKey) return
    onSelect(pendingWeekKey)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{commonT('loading')}</p>
          ) : weekOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noPreviousWeeks')}</p>
          ) : (
            <Select value={pendingWeekKey} onValueChange={(value) => setPendingWeekKey(value ?? '')}>
              <SelectTrigger
                data-testid="previous-week-trigger"
                aria-label={t('title')}
                className="w-full border-border"
              >
                <SelectValue>
                  {pendingWeekKey ? weekKeyToDisplay(pendingWeekKey, locale) : ''}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {weekOptions.map((weekKey) => (
                  <SelectItem
                    key={weekKey}
                    value={weekKey}
                    data-testid={`previous-week-option-${weekKey}`}
                  >
                    {weekKeyToDisplay(weekKey, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !pendingWeekKey}>
            {t('confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
