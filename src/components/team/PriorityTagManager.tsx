'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PriorityTagBadge from './PriorityTagBadge'
import type { PriorityTag } from '@/types'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b',
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: PriorityTag[]
  onSave: (tags: PriorityTag[]) => void
}

export default function PriorityTagManager({ open, onOpenChange, tags, onSave }: Props) {
  const [draft, setDraft] = useState<PriorityTag[]>(tags)
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  const handleOpen = (v: boolean) => {
    if (v) setDraft(tags)
    onOpenChange(v)
  }

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) return
    const id = `custom-${Date.now()}`
    setDraft((prev) => [...prev, { id, label, color: newColor }])
    setNewLabel('')
    setNewColor(PRESET_COLORS[0])
  }

  const handleDelete = (id: string) => {
    setDraft((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = () => {
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>우선순위 태그 관리</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* 태그 목록 */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {draft.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between gap-2">
                <PriorityTagBadge tag={tag} />
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`${tag.label} 삭제`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {draft.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">태그가 없습니다</p>
            )}
          </div>

          {/* 태그 추가 */}
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">태그 추가</p>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: newColor === c ? c : 'transparent',
                    outline: newColor === c ? `2px solid ${c}55` : 'none',
                  }}
                  aria-label={c}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="태그 이름"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
                className="h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleAdd} className="h-8 shrink-0" aria-label="태그 추가">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>취소</Button>
            <Button size="sm" onClick={handleSave}>저장</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
