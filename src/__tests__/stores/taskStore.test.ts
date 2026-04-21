import { useTaskStore } from '@/stores/taskStore'

const TEAM_ID = 'team-1'
const WEEK_KEY = '2026-W17'

beforeEach(() => {
  useTaskStore.setState({ tasks: [] })
})

describe('taskStore - addTask', () => {
  it('태스크를 추가하면 목록에 존재한다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '새 태스크', description: '', assigneeId: '', deadline: '',
    })
    const tasks = useTaskStore.getState().tasks
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('새 태스크')
    expect(tasks[0].status).toBe('todo')
    expect(tasks[0].matrixPosition).toBeNull()
  })
})

describe('taskStore - toggleTask', () => {
  it('todo 태스크를 토글하면 done이 된다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '태스크', description: '', assigneeId: '', deadline: '',
    })
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().toggleTask(id)
    expect(useTaskStore.getState().tasks[0].status).toBe('done')
  })

  it('done 태스크를 토글하면 todo가 된다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '태스크', description: '', assigneeId: '', deadline: '',
    })
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().toggleTask(id)
    useTaskStore.getState().toggleTask(id)
    expect(useTaskStore.getState().tasks[0].status).toBe('todo')
  })
})

describe('taskStore - deleteTask', () => {
  it('태스크를 삭제하면 목록에 없다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '태스크', description: '', assigneeId: '', deadline: '',
    })
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().deleteTask(id)
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })
})

describe('taskStore - moveToMatrix / moveToSidebar', () => {
  it('moveToMatrix로 matrixPosition이 설정된다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '태스크', description: '', assigneeId: '', deadline: '',
    })
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().moveToMatrix(id, 'do')
    expect(useTaskStore.getState().tasks[0].matrixPosition).toBe('do')
  })

  it('moveToSidebar로 matrixPosition이 null이 된다', () => {
    useTaskStore.getState().addTask({
      teamId: TEAM_ID, weekKey: WEEK_KEY,
      title: '태스크', description: '', assigneeId: '', deadline: '',
    })
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().moveToMatrix(id, 'schedule')
    useTaskStore.getState().moveToSidebar(id)
    expect(useTaskStore.getState().tasks[0].matrixPosition).toBeNull()
  })
})

describe('taskStore - getTasksByWeek', () => {
  it('팀ID와 weekKey로 태스크를 필터링한다', () => {
    useTaskStore.getState().addTask({ teamId: 'team-1', weekKey: '2026-W17', title: 'A', description: '', assigneeId: '', deadline: '' })
    useTaskStore.getState().addTask({ teamId: 'team-1', weekKey: '2026-W18', title: 'B', description: '', assigneeId: '', deadline: '' })
    useTaskStore.getState().addTask({ teamId: 'team-2', weekKey: '2026-W17', title: 'C', description: '', assigneeId: '', deadline: '' })

    const result = useTaskStore.getState().getTasksByWeek('team-1', '2026-W17')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('A')
  })
})

describe('taskStore - migrateWeek', () => {
  it('todo 태스크를 다음 weekKey로 이동한다', () => {
    useTaskStore.getState().addTask({ teamId: TEAM_ID, weekKey: '2026-W17', title: '미완료', description: '', assigneeId: '', deadline: '' })
    useTaskStore.getState().addTask({ teamId: TEAM_ID, weekKey: '2026-W17', title: '완료', description: '', assigneeId: '', deadline: '' })
    const doneId = useTaskStore.getState().tasks[1].id
    useTaskStore.getState().toggleTask(doneId)

    useTaskStore.getState().migrateWeek(TEAM_ID, '2026-W17', '2026-W18')

    const w18 = useTaskStore.getState().getTasksByWeek(TEAM_ID, '2026-W18')
    const w17 = useTaskStore.getState().getTasksByWeek(TEAM_ID, '2026-W17')
    expect(w18.map((t) => t.title)).toContain('미완료')
    expect(w17.map((t) => t.title)).toContain('완료')
  })
})
