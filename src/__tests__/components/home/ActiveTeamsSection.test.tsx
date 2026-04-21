import { render, screen } from '@testing-library/react'
import ActiveTeamsSection from '@/components/home/ActiveTeamsSection'
import type { Team, User } from '@/types'

const mockUsers: User[] = [
  { id: 'user-1', name: '김철수', avatar: 'avatar-1', themeColor: 'violet' },
  { id: 'user-2', name: '이영희', avatar: 'avatar-2', themeColor: 'blue' },
]

const mockTeams: Team[] = [
  { id: 'team-1', name: '프로덕트팀', memberIds: ['user-1', 'user-2'] },
  { id: 'team-2', name: '디자인팀', memberIds: ['user-1'] },
]

describe('ActiveTeamsSection', () => {
  it('섹션 헤더를 렌더한다', () => {
    render(<ActiveTeamsSection teams={mockTeams} users={mockUsers} />)
    expect(screen.getByRole('heading', { name: /My Active Teams/i })).toBeInTheDocument()
  })

  it('팀 카드를 팀 수만큼 렌더한다', () => {
    render(<ActiveTeamsSection teams={mockTeams} users={mockUsers} />)
    expect(screen.getByText('프로덕트팀')).toBeInTheDocument()
    expect(screen.getByText('디자인팀')).toBeInTheDocument()
  })

  it('팀이 없을 때 빈 상태 메시지를 렌더한다', () => {
    render(<ActiveTeamsSection teams={[]} users={mockUsers} />)
    expect(screen.getByText(/팀이 없습니다/)).toBeInTheDocument()
  })

  it('각 팀 카드에 멤버 수를 표시한다', () => {
    render(<ActiveTeamsSection teams={mockTeams} users={mockUsers} />)
    expect(screen.getByText('2 members')).toBeInTheDocument()
    expect(screen.getByText('1 members')).toBeInTheDocument()
  })
})
