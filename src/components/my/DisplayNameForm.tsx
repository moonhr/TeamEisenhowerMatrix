'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'

type DisplayNameFormProps = {
  value: string
  onChange: (name: string) => void
}

export default function DisplayNameForm({ value, onChange }: DisplayNameFormProps) {
  const t = useTranslations('DisplayNameForm')

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{t('title')}</h3>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
        className="max-w-xs"
      />
    </div>
  )
}
