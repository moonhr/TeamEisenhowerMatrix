import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { User } from '@/types'

const AVATAR_COLORS: Record<string, string> = {
  'avatar-1': 'bg-violet-400',
  'avatar-2': 'bg-blue-400',
  'avatar-3': 'bg-green-400',
  'avatar-4': 'bg-orange-400',
  'avatar-5': 'bg-rose-400',
  'avatar-6': 'bg-yellow-400',
  'avatar-7': 'bg-teal-400',
  'avatar-8': 'bg-slate-400',
}

type OnlineUsersBarProps = {
  users: User[]
}

export default function OnlineUsersBar({ users }: OnlineUsersBarProps) {
  return (
    <div className="flex items-center gap-2 border-t px-4 py-2">
      <span className="text-xs text-muted-foreground">접속 중:</span>
      <div className="flex -space-x-1">
        {users.map((user) => (
          <Avatar
            key={user.id}
            className="h-7 w-7 ring-2 ring-background"
            title={user.name}
          >
            <AvatarFallback
              className={`text-[10px] text-white ${AVATAR_COLORS[user.avatar] ?? 'bg-muted'}`}
            >
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}
