'use client'

import { cn } from '@/lib/utils'
import type { ThemeColor } from '@/types'

const COLORS: { value: ThemeColor; bg: string }[] = [
  { value: 'violet', bg: 'bg-violet-500' },
  { value: 'blue',   bg: 'bg-blue-500' },
  { value: 'green',  bg: 'bg-green-500' },
  { value: 'orange', bg: 'bg-orange-500' },
  { value: 'rose',   bg: 'bg-rose-500' },
  { value: 'slate',  bg: 'bg-slate-500' },
]

type ThemeColorSelectorProps = {
  selected: ThemeColor
  onChange: (color: ThemeColor) => void
}

export default function ThemeColorSelector({ selected, onChange }: ThemeColorSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Theme Color</h3>
      <div className="flex gap-3">
        {COLORS.map(({ value, bg }) => (
          <button
            key={value}
            data-testid={`color-${value}`}
            aria-pressed={selected === value}
            onClick={() => onChange(value)}
            className={cn(
              'h-12 w-12 rounded-full transition-all',
              bg,
              selected === value
                ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                : 'opacity-60 hover:opacity-100'
            )}
          />
        ))}
      </div>
    </div>
  )
}
