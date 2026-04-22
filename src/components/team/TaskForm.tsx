'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Calendar, Tag, User as UserIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { User, Task, PriorityTag } from '@/types'

type NewTaskInput = Omit<Task, 'id' | 'teamId' | 'weekKey' | 'status' | 'matrixPosition'>

type TaskFormProps = {
  members: User[]
  priorityTags?: PriorityTag[]
  onSubmit: (task: NewTaskInput) => void
}

export default function TaskForm({ members, priorityTags = [], onSubmit }: TaskFormProps) {
  const t = useTranslations('TaskForm')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priorityTagId, setPriorityTagId] = useState('')
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description, assigneeId, deadline, priorityTagId: priorityTagId || undefined })
    setTitle('')
    setDescription('')
    setAssigneeId('')
    setDeadline('')
    setPriorityTagId('')
    setExpanded(false)
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setAssigneeId('')
    setDeadline('')
    setPriorityTagId('')
    setExpanded(false)
  }

  const selectedTag = priorityTags.find((tag) => tag.id === priorityTagId)

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-2">
        <Input
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (!expanded && event.target.value) setExpanded(true)
          }}
          onFocus={() => setExpanded(true)}
          onKeyDown={(event) => event.key === 'Enter' && !event.nativeEvent.isComposing && handleSubmit()}
          className="text-sm font-medium border-0 border-b rounded-none px-0 h-9 focus-visible:ring-0 focus-visible:border-primary shadow-none"
        />
      </div>

      {expanded && (
        <>
          <div className="px-4 pb-2">
            <div className="relative">
              <Textarea
                placeholder={t('descriptionPlaceholder')}
                value={description}
                onChange={(event) => setDescription(event.target.value.slice(0, 200))}
                className="min-h-[72px] resize-none text-sm border-muted bg-muted/40 focus-visible:bg-background pb-5"
              />
              <span className={`absolute bottom-2 right-2 text-[10px] ${description.length >= 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {description.length}/200
              </span>
            </div>
          </div>

          <Separator />

          <div className="px-4 py-3 space-y-3">
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
                    <SelectItem key={member.id} value={member.id} className="text-xs">{member.name}</SelectItem>
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
                          <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: selectedTag.color }} />
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
                          <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
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

          <div className="flex items-center justify-end gap-2 px-4 py-3">
            <Button variant="outline" size="sm" onClick={handleCancel}>{t('cancel')}</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>{t('submit')}</Button>
          </div>
        </>
      )}
    </div>
  )
}
