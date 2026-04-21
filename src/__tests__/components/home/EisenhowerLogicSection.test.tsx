import { render, screen } from '@testing-library/react'
import EisenhowerLogicSection from '@/components/home/EisenhowerLogicSection'

describe('EisenhowerLogicSection', () => {
  it('섹션 헤더를 렌더한다', () => {
    render(<EisenhowerLogicSection />)
    expect(screen.getByRole('heading', { name: /The Team Eisenhower Logic/i })).toBeInTheDocument()
  })

  it('4개의 사분면 카드를 렌더한다', () => {
    render(<EisenhowerLogicSection />)
    expect(screen.getByText('Do First')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText('Delegate')).toBeInTheDocument()
    expect(screen.getByText('Eliminate')).toBeInTheDocument()
  })

  it('각 카드에 설명 텍스트가 있다', () => {
    render(<EisenhowerLogicSection />)
    expect(screen.getByText(/긴급하고 중요한/)).toBeInTheDocument()
    expect(screen.getByText(/중요하지만 급하지 않은/)).toBeInTheDocument()
    expect(screen.getByText(/급하지만 덜 중요한/)).toBeInTheDocument()
    expect(screen.getByText(/급하지도 중요하지도 않은/)).toBeInTheDocument()
  })
})
