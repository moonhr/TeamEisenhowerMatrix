'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type RenameTeamModalProps = {
  open: boolean
  currentName: string
  onOpenChange: (open: boolean) => void
  onRename: (name: string) => Promise<void>
}

export default function RenameTeamModal({ open, currentName, onOpenChange, onRename }: RenameTeamModalProps) {
  const t = useTranslations('RenameTeamModal')
  const [name, setName] = useState(currentName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setName(currentName)
  }, [open, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || name.trim() === currentName) return
    setSaving(true)
    await onRename(name.trim())
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('placeholder')}
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || name.trim() === currentName || saving}
            >
              {saving ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
