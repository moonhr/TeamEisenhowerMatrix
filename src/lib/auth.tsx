'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase/config'
import { getUser, createUser, updateUserLocale } from './firebase/userRepository'
import { syncLocaleCookie } from './i18n/localeCookie'
import type { AppLocale, User } from '@/types'
import { AVATARS } from './mock-data'

type AuthContextType = {
  currentUser: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setCurrentUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refresh } = useRouter()
  const currentLocale = useLocale() as AppLocale
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let user = await getUser(firebaseUser.uid)
        if (!user) {
          const defaults: Omit<User, 'id'> = {
            name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? '사용자',
            avatar: AVATARS[0],
            themeColor: 'violet',
            colorScheme: 'light',
            locale: currentLocale,
          }
          await createUser(firebaseUser.uid, defaults)
          user = { id: firebaseUser.uid, ...defaults }
        } else if (!user.locale) {
          await updateUserLocale(firebaseUser.uid, currentLocale)
          user = { ...user, locale: currentLocale }
        }

        setCurrentUser(user)

        if (user.locale && user.locale !== currentLocale) {
          syncLocaleCookie(user.locale)
          refresh()
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [currentLocale, refresh])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signOut, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useCurrentUser(): User {
  const { currentUser } = useAuth()
  if (!currentUser) throw new Error('useCurrentUser called without authenticated user')
  return currentUser
}
