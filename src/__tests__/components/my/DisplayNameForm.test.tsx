import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DisplayNameForm from '@/components/my/DisplayNameForm'

describe('DisplayNameForm', () => {
  it('입력 변경 시 onChange 콜백을 호출한다', async () => {
    const onChange = jest.fn()
    render(<DisplayNameForm value="김철수" onChange={onChange} />)

    await userEvent.type(screen.getByRole('textbox'), '!')
    expect(onChange).toHaveBeenCalled()
  })

  it('value prop이 input에 반영된다', () => {
    render(<DisplayNameForm value="홍길동" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('홍길동')
  })
})
