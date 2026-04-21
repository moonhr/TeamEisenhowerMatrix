'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { useAuth } from '@/lib/auth'

export default function JoinByLinkPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = input.trim()
    if (!raw) return

    const match = raw.match(/\/join\/([A-Z0-9]+)/i) ?? raw.match(/^([A-Z0-9]+)$/i)
    const code = match?.[1]?.toUpperCase()
    if (!code) return

    const destination = `/join/${code}`
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(destination)}`)
      return
    }

    router.push(destination)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <div className="w-full max-w-sm space-y-2 text-center">
          <h1 className="text-2xl font-bold">팀 참가하기</h1>
          <p className="text-sm text-muted-foreground">
            초대 링크 또는 초대 코드를 입력하세요.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <Input
            placeholder="초대 링크 또는 코드 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={!input.trim()}>
            참가하기
          </Button>
        </form>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          돌아가기
        </Button>
      </div>
    </div>
  )
}
