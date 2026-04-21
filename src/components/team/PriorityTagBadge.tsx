import type { PriorityTag } from '@/types'

type Props = {
  tag: PriorityTag
  size?: 'sm' | 'xs'
}

export default function PriorityTagBadge({ tag, size = 'sm' }: Props) {
  const textSize = size === 'xs' ? 'text-[10px] px-1 py-0' : 'text-xs px-1.5 py-0.5'
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${textSize}`}
      style={{ backgroundColor: tag.color + '22', color: tag.color, border: `1px solid ${tag.color}55` }}
    >
      {tag.label}
    </span>
  )
}
