import { render, waitFor } from '@testing-library/react'

import { AuthProvider } from '../../lib/auth'

const mockRefresh = jest.fn()
const mockRouter = { refresh: mockRefresh }
const mockSignInWithPopup = jest.fn()
const mockSignOut = jest.fn()
const mockOnAuthStateChanged = jest.fn()
const mockGetUser = jest.fn()
const mockCreateUser = jest.fn()
const mockUpdateUserLocale = jest.fn()
const mockSyncLocaleCookie = jest.fn()
const mockUseLocale = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

jest.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: unknown }) => children,
}))

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}))

jest.mock('../../lib/firebase/config', () => ({
  auth: { name: 'mock-auth' },
}))

jest.mock('../../lib/firebase/userRepository', () => ({
  getUser: (...args: unknown[]) => mockGetUser(...args),
  createUser: (...args: unknown[]) => mockCreateUser(...args),
  updateUserLocale: (...args: unknown[]) => mockUpdateUserLocale(...args),
}))

jest.mock('../../lib/i18n/localeCookie', () => ({
  syncLocaleCookie: (...args: unknown[]) => mockSyncLocaleCookie(...args),
}))

describe('AuthProvider', () => {
  const firebaseUser = {
    uid: 'user-1',
    displayName: 'Alice',
    email: 'alice@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLocale.mockReturnValue('ko')
    mockCreateUser.mockResolvedValue(undefined)
    mockUpdateUserLocale.mockResolvedValue(undefined)
    mockOnAuthStateChanged.mockImplementation((_, callback: (user: typeof firebaseUser | null) => void) => {
      void callback(firebaseUser)
      return jest.fn()
    })
  })

  it('syncs the locale cookie and refreshes when the saved locale differs from the current locale', async () => {
    mockGetUser.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      avatar: 'avatar-1',
      themeColor: 'violet',
      colorScheme: 'light',
      locale: 'en',
    })

    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockSyncLocaleCookie).toHaveBeenCalledWith('en')
    })

    expect(mockRefresh).toHaveBeenCalledTimes(1)
    expect(mockCreateUser).not.toHaveBeenCalled()
    expect(mockUpdateUserLocale).not.toHaveBeenCalled()
  })

  it('creates new users with the current locale instead of always defaulting to Korean', async () => {
    mockUseLocale.mockReturnValue('en')
    mockGetUser.mockResolvedValue(null)

    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({ locale: 'en' })
      )
    })

    expect(mockSyncLocaleCookie).not.toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('backfills locale for existing users that do not have one yet', async () => {
    mockUseLocale.mockReturnValue('en')
    mockGetUser.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      avatar: 'avatar-1',
      themeColor: 'violet',
      colorScheme: 'light',
    })

    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockUpdateUserLocale).toHaveBeenCalledWith('user-1', 'en')
    })

    expect(mockSyncLocaleCookie).not.toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
  })
})
