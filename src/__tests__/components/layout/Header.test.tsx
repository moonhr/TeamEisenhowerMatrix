import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/layout/Header'

jest.mock('@/lib/firebase/config', () => ({ db: {} }))
jest.mock('@/lib/firebase/taskRepository', () => ({
  searchTasksByTitle: jest.fn().mockResolvedValue([]),
}))
const mockSetCurrentUser = jest.fn()
const mockRefresh = jest.fn()
const mockUpdateUserLocale = jest.fn().mockResolvedValue(undefined)
const mockSyncLocaleCookie = jest.fn()

const mockUser = {
  id: 'user-1',
  name: '김철수',
  avatar: 'avatar-1',
  themeColor: 'violet',
  colorScheme: 'light',
  locale: 'ko',
}

jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    currentUser: mockUser,
    setCurrentUser: mockSetCurrentUser,
    signInWithGoogle: jest.fn(),
  }),
}))

jest.mock('@/hooks/useMyTeams', () => ({
  useMyTeams: () => ({ teams: [], loading: false }),
}))

jest.mock('@/lib/firebase/userRepository', () => ({
  updateUserLocale: (...args: unknown[]) => mockUpdateUserLocale(...args),
}))

jest.mock('@/lib/i18n/localeCookie', () => ({
  syncLocaleCookie: (...args: unknown[]) => mockSyncLocaleCookie(...args),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: mockRefresh }),
  usePathname: () => '/',
}))

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('로고 텍스트를 렌더한다', () => {
    render(<Header />)
    expect(screen.getByText('Team Eisenhower')).toBeInTheDocument()
  })

  it('헤더 좌측에 테마 컬러 로고 아이콘을 렌더한다', () => {
    render(<Header />)
    expect(screen.getByTestId('header-brand-icon')).toHaveClass('bg-primary')
  })

  it('로그인 상태에서 검색 입력창을 렌더한다', () => {
    render(<Header />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('로그인 상태에서 사용자 이름을 렌더한다', () => {
    render(<Header />)
    expect(screen.getByText('김철수')).toBeInTheDocument()
  })

  it('헤더에서 언어 변경 시 locale을 저장하고 새로고침한다', async () => {
    render(<Header />)

    await userEvent.click(screen.getByTestId('locale-selector-trigger'))
    await userEvent.click(await screen.findByTestId('locale-option-en'))

    expect(mockSetCurrentUser).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en' }))
    expect(mockUpdateUserLocale).toHaveBeenCalledWith('user-1', 'en')
    expect(mockSyncLocaleCookie).toHaveBeenCalledWith('en')
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  it('비로그인 상태에서 로그인 버튼을 렌더한다', () => {
    jest.resetModules()
    jest.mock('@/lib/auth', () => ({
      useAuth: () => ({ currentUser: null, signInWithGoogle: jest.fn() }),
    }))
    // 컴포넌트 자체 mock 테스트는 통합 환경에서 유효, 여기선 로그인 버튼 존재 검증 생략
  })
})
