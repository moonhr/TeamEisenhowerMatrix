'use client'

import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ColorScheme } from '@/types'

type ColorSchemeSelectorProps = {
  selected: ColorScheme
  onChange: (scheme: ColorScheme) => void
}

const OPTIONS: { value: ColorScheme; label: string; Icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark',  label: 'Dark',  Icon: Moon },
]

export default function ColorSchemeSelector({ selected, onChange }: ColorSchemeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Display Mode</h3>
      <div className="flex gap-3">
        {OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={selected === value}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              selected === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
