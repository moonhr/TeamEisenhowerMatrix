import type { PriorityTag } from '@/types'

export const DEFAULT_PRIORITY_TAGS: PriorityTag[] = [
  { id: 'directive', label: '지시사항', color: '#ef4444' },
  { id: 'strategic', label: '전략적',   color: '#8b5cf6' },
  { id: 'deadline',  label: '마감임박', color: '#f97316' },
  { id: 'customer',  label: '고객요청', color: '#3b82f6' },
  { id: 'blocker',   label: '블로커',   color: '#ec4899' },
  { id: 'risk',      label: '리스크',   color: '#eab308' },
]
