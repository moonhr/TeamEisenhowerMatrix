import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function HomeFooter() {
  const t = useTranslations('HomeFooter')
  const app = useTranslations('App')

  const pageLinks = [
    { href: '/', label: t('links.home') },
    { href: '/about', label: t('links.about') },
    { href: '/features', label: t('links.features') },
  ]

  const workspaceLinks = [
    { href: '/join', label: t('links.join') },
    { href: '/my', label: t('links.myPage') },
    { href: '/login', label: t('links.login') },
  ]

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
        <div className="flex items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/icon.svg"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-2xl font-semibold tracking-tight">
              {app('title')}
            </span>
          </Link>
        </div>

        <nav aria-label={t('pageLinksLabel')}>
          <h3 className="text-sm font-semibold">{t('pageLinksTitle')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {pageLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('workspaceLinksLabel')}>
          <h3 className="text-sm font-semibold">{t('workspaceLinksTitle')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {workspaceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
