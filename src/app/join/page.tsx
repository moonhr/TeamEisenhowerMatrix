'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { useAuth } from '@/lib/auth'

export default function JoinByLinkPage() {
  const t = useTranslations('JoinPage')
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
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <Input
            placeholder={t('codePlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={!input.trim()}>
            {t('join')}
          </Button>
        </form>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          {t('back')}
        </Button>
      </div>
    </div>
  )
}
