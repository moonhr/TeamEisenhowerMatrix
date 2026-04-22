import { render, screen } from '@testing-library/react'
import AboutPageContent from '@/components/marketing/AboutPageContent'

describe('AboutPageContent', () => {
  it('소개 페이지 핵심 섹션을 렌더한다', () => {
    render(<AboutPageContent />)

    expect(screen.getByRole('heading', { level: 1, name: /개인적으로 쓰던 아이젠하워 매트릭스를 팀의 대화로 확장했습니다/i })).toBeInTheDocument()
    expect(screen.getByText(/우선순위의 이유를 팀이 함께 볼 수 있는 화면이 필요했습니다/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /왜 만들게 되었는가/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /그래서 이렇게 만들고 있습니다/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /실생활에서 나온 아이디어라는 인상을 남기고 싶었습니다/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /기능 보기/i })).toHaveAttribute('href', '/features')
    expect(screen.getByRole('link', { name: /홈으로/i })).toHaveAttribute('href', '/')
  })
})
