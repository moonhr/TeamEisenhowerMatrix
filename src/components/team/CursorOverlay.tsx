import type { CursorData } from '@/lib/firebase/cursorRepository'

const AVATAR_COLORS: Record<string, string> = {
  'avatar-1': '#8b5cf6',
  'avatar-2': '#60a5fa',
  'avatar-3': '#4ade80',
  'avatar-4': '#fb923c',
  'avatar-5': '#fb7185',
  'avatar-6': '#facc15',
  'avatar-7': '#2dd4bf',
  'avatar-8': '#94a3b8',
}

type CursorOverlayProps = {
  cursors: CursorData[]
}

export default function CursorOverlay({ cursors }: CursorOverlayProps) {
  if (cursors.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {cursors.map((c) => {
        const color = AVATAR_COLORS[c.avatar] ?? '#94a3b8'
        return (
          <div
            key={c.userId}
            className="absolute left-0 top-0"
            style={{
              transform: `translate(${c.x}vw, ${c.y}vh)`,
              willChange: 'transform',
            }}
          >
            {/* 커서 화살표 */}
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              style={{ filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.3))` }}
            >
              <path
                d="M0 0L0 14L4 10L7 18L9 17L6 9L11 9Z"
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            {/* 이름 태그 */}
            <div
              className="mt-0.5 ml-3 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium text-white leading-tight"
              style={{ backgroundColor: color }}
            >
              {c.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
