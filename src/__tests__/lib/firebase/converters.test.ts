import { toTask, fromTask, toTeam, toUser } from '@/lib/firebase/converters'

describe('toTask', () => {
  const raw = {
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '태스크',
    description: '설명',
    assigneeId: 'user-1',
    deadline: '2026-04-25',
    status: 'todo',
    matrixPosition: 'do',
  }

  it('Firestore 문서 데이터를 Task 타입으로 변환한다', () => {
    const task = toTask('task-1', raw)
    expect(task).toEqual({
      id: 'task-1',
      teamId: 'team-1',
      weekKey: '2026-W17',
      title: '태스크',
      description: '설명',
      assigneeId: 'user-1',
      deadline: '2026-04-25',
      status: 'todo',
      matrixPosition: 'do',
    })
  })

  it('matrixPosition이 없으면 null로 변환한다', () => {
    const task = toTask('task-1', { ...raw, matrixPosition: undefined })
    expect(task.matrixPosition).toBeNull()
  })

  it('status가 없으면 todo로 기본값 처리한다', () => {
    const task = toTask('task-1', { ...raw, status: undefined })
    expect(task.status).toBe('todo')
  })
})

describe('fromTask', () => {
  it('Task를 Firestore 저장용 객체로 변환한다', () => {
    const task = {
      id: 'task-1',
      teamId: 'team-1',
      weekKey: '2026-W17',
      title: '태스크',
      description: '설명',
      assigneeId: 'user-1',
      deadline: '2026-04-25',
      status: 'todo' as const,
      matrixPosition: null,
    }
    const data = fromTask(task)
    expect(data.id).toBeUndefined()
    expect(data.teamId).toBe('team-1')
    expect(data.matrixPosition).toBeNull()
  })
})

describe('toTeam', () => {
  it('Firestore 문서 데이터를 Team 타입으로 변환한다', () => {
    const team = toTeam('team-1', {
      name: '프로덕트팀',
      memberIds: ['user-1', 'user-2'],
    })
    expect(team).toEqual({ id: 'team-1', name: '프로덕트팀', memberIds: ['user-1', 'user-2'] })
  })

  it('memberIds가 없으면 빈 배열로 변환한다', () => {
    const team = toTeam('team-1', { name: '팀', memberIds: undefined })
    expect(team.memberIds).toEqual([])
  })
})

describe('toUser', () => {
  it('Firestore 문서 데이터를 User 타입으로 변환한다', () => {
    const user = toUser('user-1', {
      name: '김철수',
      avatar: 'avatar-1',
      themeColor: 'violet',
    })
    expect(user).toEqual({ id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet' })
  })
})
