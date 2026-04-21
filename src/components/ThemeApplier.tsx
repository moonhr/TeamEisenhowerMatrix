'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function ThemeApplier() {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return
    document.documentElement.setAttribute('data-theme', currentUser.themeColor)
  }, [currentUser?.themeColor])

  useEffect(() => {
    if (!currentUser) return
    const el = document.documentElement
    if (currentUser.colorScheme === 'dark') {
      el.classList.add('dark')
    } else {
      el.classList.remove('dark')
    }
  }, [currentUser?.colorScheme])

  return null
}
