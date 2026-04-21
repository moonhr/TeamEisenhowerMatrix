'use client'

import { useState, useEffect } from 'react'
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

  const selectedTag = priorityTags.find((t) => t.id === priorityTagId)

  return (
    <Dialog open={!!task} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-base font-semibold">태스크 수정</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">
          {/* 제목 */}
          <Input
            placeholder="태스크 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm font-medium border-0 border-b rounded-none px-0 h-9 focus-visible:ring-0 focus-visible:border-primary"
          />

          {/* 설명 */}
          <div className="relative">
            <Textarea
              placeholder="설명을 입력하세요 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              className="min-h-[80px] resize-none text-sm border-muted bg-muted/40 focus-visible:bg-background pb-5"
            />
            <span className={`absolute bottom-2 right-2 text-[10px] ${description.length >= 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {description.length}/200
            </span>
          </div>
        </div>

        <Separator />

        {/* 메타 필드 */}
        <div className="px-6 py-4 space-y-3">
          {/* 담당자 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
              <UserIcon className="h-3.5 w-3.5" />
              담당자
            </div>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="h-8 text-xs flex-1 border-muted">
                <SelectValue placeholder="없음">
                  {assigneeId ? (members.find((m) => m.id === assigneeId)?.name ?? assigneeId) : '없음'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">없음</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-xs">
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 마감일 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              마감일
            </div>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-8 text-xs flex-1 border-muted"
            />
          </div>

          {/* 우선순위 태그 */}
          {priorityTags.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-24 shrink-0 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                태그
              </div>
              <Select value={priorityTagId} onValueChange={setPriorityTagId}>
                <SelectTrigger className="h-8 text-xs flex-1 border-muted">
                  <SelectValue placeholder="없음">
                    {selectedTag ? (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: selectedTag.color }}
                        />
                        {selectedTag.label}
                      </span>
                    ) : '없음'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="text-xs">없음</SelectItem>
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

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>취소</Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>저장</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
