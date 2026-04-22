import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import './globals.css'
import { AuthProvider } from '@/lib/auth'
import ThemeApplier from '@/components/ThemeApplier'
import AuthGuard from '@/components/AuthGuard'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Team Eisenhower Matrix',
  description: '팀 우선순위 관리 서비스',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <AuthGuard>
              <ThemeApplier />
              {children}
            </AuthGuard>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
