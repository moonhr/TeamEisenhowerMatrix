'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useMyTeams } from '@/hooks/useMyTeams'
import { useSearch } from '@/hooks/useSearch'
import SearchDropdown from './SearchDropdown'

export default function Header() {
  const { currentUser: user, signInWithGoogle } = useAuth()
  const { teams } = useMyTeams(user?.id ?? '')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading } = useSearch(query, teams)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Team Prioritization Matrix
        </Link>

        {user && (
          <div
            ref={wrapperRef}
            className="relative flex flex-1 items-center justify-center px-6"
          >
            <div className="relative w-full max-w-xs">
              <Input
                placeholder="Search..."
                className="h-8 w-full"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
              />
              {open && (
                <SearchDropdown results={results} loading={loading} query={query} />
              )}
            </div>
          </div>
        )}

        {user ? (
          <Link href="/my" className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{user.name}</span>
          </Link>
        ) : (
          <Button size="sm" onClick={signInWithGoogle}>
            로그인
          </Button>
        )}
      </div>
    </header>
  )
}
