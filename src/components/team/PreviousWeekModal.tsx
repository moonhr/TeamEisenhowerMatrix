'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getPreviousWeeks, weekKeyToDisplay } from '@/lib/utils/week'

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
  const weeks = getPreviousWeeks(currentWeekKey, WEEK_COUNT)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>이전 주차 보기</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {weeks.map((weekKey) => (
            <Button
              key={weekKey}
              variant="ghost"
              className="justify-start"
              onClick={() => { onSelect(weekKey); onOpenChange(false) }}
            >
              {weekKeyToDisplay(weekKey)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
