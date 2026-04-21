import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeColorSelector from '@/components/my/ThemeColorSelector'
import type { ThemeColor } from '@/types'

const COLORS: ThemeColor[] = ['violet', 'blue', 'green', 'orange', 'rose', 'slate']

describe('ThemeColorSelector', () => {
  it('컬러 클릭 시 onChange 콜백을 호출한다', async () => {
    const onChange = jest.fn()
    render(<ThemeColorSelector selected="violet" onChange={onChange} />)

    await userEvent.click(screen.getByTestId('color-blue'))
    expect(onChange).toHaveBeenCalledWith('blue')
  })

  it('현재 선택된 컬러는 aria-pressed true를 가진다', () => {
    render(<ThemeColorSelector selected="green" onChange={() => {}} />)
    expect(screen.getByTestId('color-green')).toHaveAttribute('aria-pressed', 'true')
  })

  it('6개의 컬러 옵션을 모두 렌더한다', () => {
    render(<ThemeColorSelector selected="violet" onChange={() => {}} />)
    COLORS.forEach((color) => {
      expect(screen.getByTestId(`color-${color}`)).toBeInTheDocument()
    })
  })
})
