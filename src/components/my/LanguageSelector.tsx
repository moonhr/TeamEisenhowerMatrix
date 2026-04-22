'use client'

import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { cn } from '@/lib/utils'
import { APP_LOCALES, type AppLocale } from '@/types'

const COMPACT_LANGUAGE_OPTIONS = ['ko', 'en', 'ja', 'fr', 'de'] as const

type CompactLanguageOption = typeof COMPACT_LANGUAGE_OPTIONS[number]

const COMPACT_LANGUAGE_TO_LOCALE: Record<CompactLanguageOption, AppLocale> = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
}

const COMPACT_LANGUAGE_LABELS: Record<CompactLanguageOption, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
}

function toCompactLanguage(locale: AppLocale): CompactLanguageOption {
  if (locale === 'en' || locale === 'en-GB') return 'en'
  return locale
}

type LanguageSelectorProps = {
  selected: AppLocale
  onChange: (locale: AppLocale) => void
  disabled?: boolean
  compact?: boolean
  showTitle?: boolean
}

export default function LanguageSelector({
  selected,
  onChange,
  disabled = false,
  compact = false,
  showTitle = true,
}: LanguageSelectorProps) {
  const t = useTranslations('LanguageSelector')
  const options = compact ? COMPACT_LANGUAGE_OPTIONS : APP_LOCALES
  const value = compact ? toCompactLanguage(selected) : selected

  const getLabel = (locale: AppLocale | CompactLanguageOption) => {
    if (compact) return COMPACT_LANGUAGE_LABELS[locale as CompactLanguageOption]
    return t(`locales.${locale}`)
  }

  return (
    <div className={cn('space-y-3', compact && 'space-y-0')}>
      {showTitle && <h3 className="text-base font-semibold">{t('title')}</h3>}
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(value) => {
          if (!value) return
          if (compact) {
            onChange(COMPACT_LANGUAGE_TO_LOCALE[value as CompactLanguageOption])
            return
          }
          onChange(value as AppLocale)
        }}
      >
        <SelectTrigger
          data-testid="locale-selector-trigger"
          aria-label={t('title')}
          className={cn(
            'w-full border-border',
            compact ? 'h-8 min-w-[8.5rem] px-2.5 text-xs sm:min-w-[10rem]' : 'h-10 min-w-[14rem] text-sm'
          )}
        >
          <SelectValue placeholder={t('placeholder')}>
            {getLabel(value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((locale) => (
            <SelectItem
              key={locale}
              value={locale}
              data-testid={`locale-option-${locale}`}
              className={cn(compact && 'text-xs')}
            >
              {getLabel(locale)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
