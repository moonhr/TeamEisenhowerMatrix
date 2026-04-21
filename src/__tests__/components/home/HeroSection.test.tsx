import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroSection from '@/components/home/HeroSection'

describe('HeroSection', () => {
  it('h1 타이틀을 렌더한다', () => {
    render(<HeroSection userName="김철수" onNewTeam={() => {}} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Team Prioritization Matrix')
  })

  it('사용자 이름이 포함된 환영 메시지를 렌더한다', () => {
    render(<HeroSection userName="김철수" onNewTeam={() => {}} />)
    expect(screen.getByText(/김철수/)).toBeInTheDocument()
  })

  it('New Team 버튼을 렌더한다', () => {
    render(<HeroSection userName="김철수" onNewTeam={() => {}} />)
    expect(screen.getByRole('button', { name: /New Team/i })).toBeInTheDocument()
  })

  it('New Team 버튼 클릭 시 콜백을 호출한다', async () => {
    const onNewTeam = jest.fn()
    render(<HeroSection userName="김철수" onNewTeam={onNewTeam} />)
    await userEvent.click(screen.getByRole('button', { name: /New Team/i }))
    expect(onNewTeam).toHaveBeenCalledTimes(1)
  })
})
