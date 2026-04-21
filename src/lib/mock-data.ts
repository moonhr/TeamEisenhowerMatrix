import type { User, Team, Task } from '@/types'
import { DEFAULT_PRIORITY_TAGS } from './priority-tags'

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet', colorScheme: 'light' },
  { id: 'user-2', name: '이영희', avatar: 'avatar-2', themeColor: 'blue',   colorScheme: 'light' },
  { id: 'user-3', name: '박민준', avatar: 'avatar-3', themeColor: 'green',  colorScheme: 'light' },
]

export const MOCK_TEAMS: Team[] = [
  { id: 'team-1', name: '프로덕트팀', memberIds: ['user-1', 'user-2', 'user-3'], priorityTags: DEFAULT_PRIORITY_TAGS },
  { id: 'team-2', name: '디자인팀',   memberIds: ['user-1', 'user-2'],           priorityTags: DEFAULT_PRIORITY_TAGS },
]

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '스프린트 계획 수립',
    description: '다음 스프린트 목표 및 태스크 정의',
    assigneeId: 'user-1',
    deadline: '2026-04-25',
    status: 'todo',
    matrixPosition: 'do',
  },
  {
    id: 'task-2',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '기술 부채 정리',
    description: '레거시 코드 리팩토링 계획 수립',
    assigneeId: 'user-2',
    deadline: '2026-05-01',
    status: 'todo',
    matrixPosition: 'schedule',
  },
  {
    id: 'task-3',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '주간 보고서 작성',
    description: '팀 현황 보고서 템플릿 작성',
    assigneeId: 'user-3',
    deadline: '2026-04-22',
    status: 'todo',
    matrixPosition: 'delegate',
  },
  {
    id: 'task-4',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '불필요한 회의 정리',
    description: '비효율적인 정기 회의 목록 검토',
    assigneeId: 'user-1',
    deadline: '2026-04-30',
    status: 'todo',
    matrixPosition: 'eliminate',
  },
  {
    id: 'task-5',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: '신규 기능 요구사항 분석',
    description: '다음 분기 로드맵 정리',
    assigneeId: 'user-2',
    deadline: '2026-04-28',
    status: 'todo',
    matrixPosition: null,
  },
  {
    id: 'task-6',
    teamId: 'team-1',
    weekKey: '2026-W17',
    title: 'API 문서 업데이트',
    description: '신규 엔드포인트 문서화',
    assigneeId: 'user-3',
    deadline: '2026-04-24',
    status: 'todo',
    matrixPosition: null,
  },
]

export const AVATARS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
  'avatar-8',
]
