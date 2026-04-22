import { render, screen } from '@testing-library/react'
import HomeFooter from '@/components/home/HomeFooter'

describe('HomeFooter', () => {
  it('footer 링크들을 렌더한다', () => {
    render(<HomeFooter />)

    expect(screen.getByRole('link', { name: 'Team Eisenhower Matrix' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: '기능' })).toHaveAttribute('href', '/features')
    expect(screen.getByRole('link', { name: '팀 참가' })).toHaveAttribute('href', '/join')
    expect(screen.getByRole('link', { name: '마이페이지' })).toHaveAttribute('href', '/my')
  })
})
