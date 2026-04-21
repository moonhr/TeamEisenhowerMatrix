'use client'

import { useState } from 'react'
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
          <DialogTitle>새 팀 만들기</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="팀 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSubmit}>만들기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
