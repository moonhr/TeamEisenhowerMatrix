'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type NewTeamModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
}

export default function NewTeamModal({ open, onOpenChange, onCreate }: NewTeamModalProps) {
  const t = useTranslations('NewTeamModal')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    onCreate(name.trim())
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
