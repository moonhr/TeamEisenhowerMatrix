'use client'

import { useAuth } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        로딩 중...
      </div>
    )
  }

  return <>{children}</>
}
