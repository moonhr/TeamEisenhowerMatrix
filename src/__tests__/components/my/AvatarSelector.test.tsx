import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AvatarSelector from '@/components/my/AvatarSelector'

const AVATARS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4']

describe('AvatarSelector', () => {
  it('아바타 클릭 시 onChange 콜백을 호출한다', async () => {
    const onChange = jest.fn()
    render(<AvatarSelector avatars={AVATARS} selected="avatar-1" onChange={onChange} />)

    await userEvent.click(screen.getByTestId('avatar-avatar-2'))
    expect(onChange).toHaveBeenCalledWith('avatar-2')
  })

  it('현재 선택된 아바타는 selected 상태를 가진다', () => {
    render(<AvatarSelector avatars={AVATARS} selected="avatar-3" onChange={() => {}} />)
    expect(screen.getByTestId('avatar-avatar-3')).toHaveAttribute('aria-pressed', 'true')
  })

  it('선택되지 않은 아바타는 selected 상태가 아니다', () => {
    render(<AvatarSelector avatars={AVATARS} selected="avatar-1" onChange={() => {}} />)
    expect(screen.getByTestId('avatar-avatar-2')).toHaveAttribute('aria-pressed', 'false')
  })
})
