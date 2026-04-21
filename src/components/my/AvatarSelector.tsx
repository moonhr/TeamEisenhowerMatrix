'use client'

import { cn } from '@/lib/utils'

type AvatarSelectorProps = {
  avatars: string[]
  selected: string
  onChange: (avatar: string) => void
}

const AVATAR_COLORS: Record<string, string> = {
  'avatar-1': 'bg-violet-400',
  'avatar-2': 'bg-blue-400',
  'avatar-3': 'bg-green-400',
  'avatar-4': 'bg-orange-400',
  'avatar-5': 'bg-rose-400',
  'avatar-6': 'bg-yellow-400',
  'avatar-7': 'bg-teal-400',
  'avatar-8': 'bg-slate-400',
}

export default function AvatarSelector({ avatars, selected, onChange }: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">아바타 선택</h3>
      <div className="flex flex-wrap gap-3">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            data-testid={`avatar-${avatar}`}
            aria-pressed={selected === avatar}
            onClick={() => onChange(avatar)}
            className={cn(
              'h-12 w-12 rounded-full transition-all',
              AVATAR_COLORS[avatar] ?? 'bg-muted',
              selected === avatar
                ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                : 'opacity-60 hover:opacity-100'
            )}
          />
        ))}
      </div>
    </div>
  )
}
