'use client'

import { useState } from 'react'
import { Pencil, LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Team } from '@/types'

type TeamManagementProps = {
  teams: Team[]
  loading?: boolean
  currentUserId: string
  onRename: (teamId: string) => void
  onExit: (teamId: string) => void
  onDelete: (teamId: string) => void
}

export default function TeamManagement({ teams, loading, currentUserId, onRename, onExit, onDelete }: TeamManagementProps) {
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null)

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Team Management</h3>
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <p className="text-sm text-muted-foreground">참가중인 팀이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {teams.map((team) => {
            const isCreator = team.creatorId === currentUserId
            return (
              <Card key={team.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium">{team.name}</span>
                  <div className="flex gap-1">
                    {isCreator && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${team.name} 이름 변경`}
                        onClick={() => onRename(team.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {isCreator ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${team.name} 삭제`}
                        onClick={() => setDeletingTeam(team)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${team.name} 나가기`}
                        onClick={() => onExit(team.id)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={!!deletingTeam} onOpenChange={(open) => { if (!open) setDeletingTeam(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>팀을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{deletingTeam?.name}</span> 팀을 삭제하면 모든 태스크가 함께 삭제되며 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onDelete(deletingTeam!.id); setDeletingTeam(null) }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
