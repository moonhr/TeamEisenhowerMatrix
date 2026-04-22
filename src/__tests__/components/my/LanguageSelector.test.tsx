import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import LanguageSelector from '@/components/my/LanguageSelector'

describe('LanguageSelector', () => {
  it('언어 셀렉트에서 항목 선택 시 onChange 콜백을 호출한다', async () => {
    const onChange = jest.fn()
    render(<LanguageSelector selected="ko" onChange={onChange} />)

    await userEvent.click(screen.getByTestId('locale-selector-trigger'))
    await userEvent.click(await screen.findByTestId('locale-option-en-GB'))

    expect(onChange).toHaveBeenCalledWith('en-GB')
  })

  it('현재 선택된 언어 라벨을 트리거에 표시한다', () => {
    render(<LanguageSelector selected="en-GB" onChange={() => {}} />)

    expect(screen.getByTestId('locale-selector-trigger')).toHaveTextContent('영국 영어')
  })

  it('compact 모드에서는 locale 대신 언어명만 표시한다', async () => {
    const onChange = jest.fn()
    render(<LanguageSelector selected="en-GB" onChange={onChange} compact />)

    expect(screen.getByTestId('locale-selector-trigger')).toHaveTextContent('English')

    await userEvent.click(screen.getByTestId('locale-selector-trigger'))

    expect(screen.getByTestId('locale-option-en')).toHaveTextContent('English')
    expect(screen.getByTestId('locale-option-ja')).toHaveTextContent('日本語')
    expect(screen.queryByTestId('locale-option-en-GB')).not.toBeInTheDocument()
  })

  it('확장된 locale 목록을 렌더한다', async () => {
    render(<LanguageSelector selected="ko" onChange={() => {}} />)

    await userEvent.click(screen.getByTestId('locale-selector-trigger'))

    expect(await screen.findByTestId('locale-option-ja')).toBeInTheDocument()
    expect(screen.getByTestId('locale-option-fr')).toBeInTheDocument()
    expect(screen.getByTestId('locale-option-de')).toBeInTheDocument()
  })
})
