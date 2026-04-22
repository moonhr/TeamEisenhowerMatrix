import { render, screen } from '@testing-library/react'
import FeaturesPageContent from '@/components/marketing/FeaturesPageContent'

describe('FeaturesPageContent', () => {
  it('기능 페이지 핵심 섹션을 렌더한다', () => {
    render(<FeaturesPageContent />)

    expect(screen.getByRole('heading', { level: 1, name: /팀 운영에 필요한 기능을 한 흐름으로 묶었습니다/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /핵심 기능/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /기능은 따로 놀지 않게 설계했습니다/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /팀 참가하기/i })).toHaveAttribute('href', '/join')
  })
})
