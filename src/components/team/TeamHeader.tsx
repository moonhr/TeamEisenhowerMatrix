'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Link2, House, Check, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { weekKeyToDisplay } from '@/lib/utils/week'
import { generateInviteLink } from '@/lib/utils/invite'

type TeamHeaderProps = {
  teamName: string
  weekKey: string
  inviteCode?: string
  onPreviousWeek: () => void
  onManageTags: () => void
}

export default function TeamHeader({
  teamName,
  weekKey,
  inviteCode,
  onPreviousWeek,
  onManageTags,
}: TeamHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleInvite = async () => {
    if (!inviteCode) return
    const link = generateInviteLink(inviteCode, window.location.origin)
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="홈으로">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <House className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-sm font-semibold">{teamName}</h1>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {weekKeyToDisplay(weekKey)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onManageTags} className="h-8 w-8" aria-label="태그 관리">
            <Tags className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onPreviousWeek} aria-label="이전 주차">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous Week</span>
          </Button>
          <Button size="sm" onClick={handleInvite} disabled={!inviteCode}>
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? '복사됨!' : 'Invite'}
          </Button>
        </div>
      </div>
    </header>
  )
}
