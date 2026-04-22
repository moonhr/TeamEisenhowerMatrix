'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import LanguageSelector from '@/components/my/LanguageSelector'
import { updateUserLocale } from '@/lib/firebase/userRepository'
import { syncLocaleCookie } from '@/lib/i18n/localeCookie'
import { useAuth } from '@/lib/auth'
import { useMyTeams } from '@/hooks/useMyTeams'
import { useSearch } from '@/hooks/useSearch'
import type { AppLocale } from '@/types'
import SearchDropdown from './SearchDropdown'

const THEME_BG: Record<string, string> = {
  violet: 'bg-violet-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  orange: 'bg-orange-500',
  rose:   'bg-rose-500',
  slate:  'bg-slate-500',
}

const BRAND_ICON_STYLE: CSSProperties = {
  maskImage: "url('/icon.svg')",
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
  maskSize: 'contain',
  WebkitMaskImage: "url('/icon.svg')",
  WebkitMaskPosition: 'center',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
}

export default function Header() {
  const t = useTranslations('Header')
  const { currentUser: user, setCurrentUser, signInWithGoogle } = useAuth()
  const router = useRouter()
  const locale = useLocale() as AppLocale
  const { teams } = useMyTeams(user?.id ?? '')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [updatingLocale, setUpdatingLocale] = useState(false)
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

  const handleLocaleChange = async (nextLocale: AppLocale) => {
    if (nextLocale === locale || updatingLocale) return

    setUpdatingLocale(true)

    try {
      if (user) {
        setCurrentUser({ ...user, locale: nextLocale })
        await updateUserLocale(user.id, nextLocale)
      }

      syncLocaleCookie(nextLocale)
      router.refresh()
    } finally {
      setUpdatingLocale(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span
            aria-hidden="true"
            data-testid="header-brand-icon"
            className="size-7 shrink-0 bg-primary"
            style={BRAND_ICON_STYLE}
          />
          <span>Team Eisenhower</span>
        </Link>

        {user && (
          <div
            ref={wrapperRef}
            className="relative flex flex-1 items-center justify-center px-6"
          >
            <div className="relative w-full max-w-xs">
              <Input
                placeholder={t('searchPlaceholder')}
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

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector
            selected={locale}
            onChange={handleLocaleChange}
            disabled={updatingLocale}
            compact
            showTitle={false}
          />

          {user ? (
            <Link href="/my" className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className={`text-xs text-white ${THEME_BG[user.themeColor] ?? 'bg-violet-500'}`}>
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline">{user.name}</span>
            </Link>
          ) : (
            <Button size="sm" onClick={signInWithGoogle}>
              {t('login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
