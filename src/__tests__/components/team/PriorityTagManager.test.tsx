import { render, screen, fireEvent } from '@testing-library/react'
import PriorityTagManager from '@/components/team/PriorityTagManager'
import type { PriorityTag } from '@/types'

const mockTags: PriorityTag[] = [
  { id: 'directive', label: '지시사항', color: '#ef4444' },
  { id: 'strategic', label: '전략적',   color: '#8b5cf6' },
]

describe('PriorityTagManager', () => {
  it('현재 태그 목록을 렌더한다', () => {
    render(
      <PriorityTagManager
        open={true}
        onOpenChange={jest.fn()}
        tags={mockTags}
        onSave={jest.fn()}
      />
    )
    expect(screen.getByText('지시사항')).toBeInTheDocument()
    expect(screen.getByText('전략적')).toBeInTheDocument()
  })

  it('태그 삭제 버튼 클릭 시 목록에서 제거된다', () => {
    render(
      <PriorityTagManager
        open={true}
        onOpenChange={jest.fn()}
        tags={mockTags}
        onSave={jest.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('지시사항 삭제'))
    expect(screen.queryByText('지시사항')).not.toBeInTheDocument()
    expect(screen.getByText('전략적')).toBeInTheDocument()
  })

  it('새 태그를 입력하고 추가할 수 있다', () => {
    render(
      <PriorityTagManager
        open={true}
        onOpenChange={jest.fn()}
        tags={mockTags}
        onSave={jest.fn()}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('태그 이름'), { target: { value: '신규태그' } })
    fireEvent.click(screen.getByRole('button', { name: '태그 추가' }))
    expect(screen.getByText('신규태그')).toBeInTheDocument()
  })

  it('저장 버튼 클릭 시 onSave를 호출한다', () => {
    const onSave = jest.fn()
    render(
      <PriorityTagManager
        open={true}
        onOpenChange={jest.fn()}
        tags={mockTags}
        onSave={onSave}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(onSave).toHaveBeenCalledWith(mockTags)
  })
})
