'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AuthGuard')
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        {t('loading')}
      </div>
    )
  }

  return <>{children}</>
}
