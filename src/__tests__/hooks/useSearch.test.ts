import { renderHook, act, waitFor } from '@testing-library/react'
import { useSearch } from '@/hooks/useSearch'
import type { Team } from '@/types'

const mockSearchTasksByTitle = jest.fn()

jest.mock('@/lib/firebase/taskRepository', () => ({
  searchTasksByTitle: (...args: unknown[]) => mockSearchTasksByTitle(...args),
}))

jest.mock('@/lib/firebase/config', () => ({
  db: {},
}))

const mockTeams: Team[] = [
  { id: 'team-1', name: '프론트엔드팀', memberIds: ['user-1'] },
  { id: 'team-2', name: '백엔드팀', memberIds: ['user-1'] },
]

const mockTasks = [
  {
    id: 'task-1',
    teamId: 'team-1',
    weekKey: '2026-W16',
    title: '로그인 구현',
    description: '',
    assigneeId: 'user-1',
    deadline: '2026-04-25',
    status: 'todo' as const,
    matrixPosition: null,
  },
]

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    mockSearchTasksByTitle.mockResolvedValue(mockTasks)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('빈 쿼리면 결과를 반환하지 않는다', async () => {
    const { result } = renderHook(() => useSearch('', mockTeams))
    expect(result.current.results.tasks).toHaveLength(0)
    expect(result.current.results.teams).toHaveLength(0)
  })

  it('300ms debounce 후 검색을 실행한다', async () => {
    const { result } = renderHook(() => useSearch('로그인', mockTeams))

    expect(mockSearchTasksByTitle).not.toHaveBeenCalled()

    act(() => { jest.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(mockSearchTasksByTitle).toHaveBeenCalledWith(
        ['team-1', 'team-2'],
        '로그인'
      )
    })
  })

  it('태스크 결과에 teamName을 추가한다', async () => {
    const { result } = renderHook(() => useSearch('로그인', mockTeams))

    act(() => { jest.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(result.current.results.tasks[0].teamName).toBe('프론트엔드팀')
    })
  })

  it('팀 이름으로 클라이언트 필터링한다', async () => {
    mockSearchTasksByTitle.mockResolvedValue([])
    const { result } = renderHook(() => useSearch('프론트', mockTeams))

    act(() => { jest.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(result.current.results.teams).toHaveLength(1)
      expect(result.current.results.teams[0].name).toBe('프론트엔드팀')
    })
  })

  it('결과 없을 때 빈 배열을 반환한다', async () => {
    mockSearchTasksByTitle.mockResolvedValue([])
    const { result } = renderHook(() => useSearch('없는검색어', mockTeams))

    act(() => { jest.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(result.current.results.tasks).toHaveLength(0)
      expect(result.current.results.teams).toHaveLength(0)
    })
  })
})
