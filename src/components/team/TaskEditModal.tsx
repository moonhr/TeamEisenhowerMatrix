'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Calendar, Tag, Trash2, User as UserIcon } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { PriorityTag, Task, User } from '@/types'

type TaskEditFields = Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'deadline' | 'priorityTagId'>>

type Props = {
  task: Task | null
  members: User[]
  priorityTags: PriorityTag[]
  onSave: (taskId: string, fields: TaskEditFields) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

export default function TaskEditModal({ task, members, priorityTags, onSave, onDelete, onClose }: Props) {
  const t = useTranslations('TaskEditModal')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priorityTagId, setPriorityTagId] = useState('')

  useEffect(() => {
    if (!task) return
    setTitle(task.title)
    setDescription(task.description)
    setAssigneeId(task.assigneeId)
    setDeadline(task.deadline)
    setPriorityTagId(task.priorityTagId ?? '')
  }, [task])

  const handleSave = () => {
    if (!task || !title.trim()) return
    onSave(task.id, {
      title: title.trim(),
      description,
      assigneeId,
      deadline,
      priorityTagId: priorityTagId || undefined,
    })
    onClose()
  }

  const handleDelete = () => {
    if (!task) return
    onDelete(task.id)
    onClose()
  }

  const selectedTag = priorityTags.find((tag) => tag.id === priorityTagId)

  return (
    <Dialog open={!!task} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-base font-semibold">{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">
          <Input
            placeholder={t('titlePlaceholder')}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="text-sm font-medium border-0 border-b rounded-none px-0 h-9 focus-visible:ring-0 focus-visible:border-primary"
          />

          <div className="relative">
            <Textarea
              placeholder={t('descriptionPlaceholder')}
              value={description}
              onChange={(event) => setDescription(event.target.value.slice(0, 200))}
              className="min-h-[80px] resize-none text-sm border-muted bg-muted/40 focus-visible:bg-background pb-5"
            />
            <span className={`absolute bottom-2 right-2 text-[10px] ${description.length >= 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {description.length}/200
            </span>
          </div>
        </div>

        <Separator />

        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
              <UserIcon className="h-3.5 w-3.5" />
              {t('assigneeLabel')}
            </div>
            <Select value={assigneeId} onValueChange={(value) => setAssigneeId(value ?? '')}>
              <SelectTrigger className="h-8 text-xs flex-1 border-muted">
                <SelectValue placeholder={t('none')}>
                  {assigneeId ? (members.find((member) => member.id === assigneeId)?.name ?? assigneeId) : t('none')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">{t('none')}</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="text-xs">
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {t('deadlineLabel')}
            </div>
            <Input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="h-8 text-xs flex-1 border-muted"
            />
          </div>

          {priorityTags.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                {t('priorityLabel')}
              </div>
              <Select value={priorityTagId} onValueChange={(value) => setPriorityTagId(value ?? '')}>
                <SelectTrigger className="h-8 text-xs flex-1 border-muted">
                  <SelectValue placeholder={t('none')}>
                    {selectedTag ? (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: selectedTag.color }}
                        />
                        {selectedTag.label}
                      </span>
                    ) : t('none')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="text-xs">{t('none')}</SelectItem>
                  {priorityTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id} className="text-xs">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('delete')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>{t('cancel')}</Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>{t('save')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
