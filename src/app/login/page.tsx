'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
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
        <h1 className="text-2xl font-bold">Team Eisenhower Matrix</h1>
        <p className="text-sm text-muted-foreground">팀과 함께 우선순위를 관리하세요</p>
      </div>
      <Button onClick={signInWithGoogle} className="gap-2">
        Google로 시작하기
      </Button>
    </div>
  )
}
