'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const t = useTranslations('LoginPage')
  const { currentUser, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && currentUser) {
      const redirect = searchParams.get('redirect')
      router.replace(redirect ?? '/')
    }
  }, [loading, currentUser, router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <Button onClick={signInWithGoogle} className="gap-2">
        {t('googleSignIn')}
      </Button>
    </div>
  )
}
