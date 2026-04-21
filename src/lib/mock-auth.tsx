'use client'

import { createContext, useContext, useState } from 'react'
import type { User } from '@/types'
import { MOCK_USERS } from './mock-data'

type AuthContextType = {
  currentUser: User
  setCurrentUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within MockAuthProvider')
  return ctx
}
