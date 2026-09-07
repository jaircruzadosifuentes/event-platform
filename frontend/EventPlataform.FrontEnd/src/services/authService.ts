import ApiClient from '../api/ApiClient'

interface TokenResponse {
  accessToken: string
  tokenType: string
  expiresInMinutes: number
  role: string
}

const authService = {
  login: async (
    role: 'Admin' | 'User'
  ): Promise<void> => {
    const response =
      await ApiClient.post<TokenResponse>(
        `/auth/token?role=${role}`
      )

    localStorage.setItem(
      'authToken',
      response.data.accessToken
    )

    localStorage.setItem(
      'userRole',
      response.data.role
    )
  },

  logout: (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
  },

  isAuthenticated: (): boolean => {
    return Boolean(
      localStorage.getItem('authToken')
    )
  },

  getRole: (): string | null => {
    return localStorage.getItem('userRole')
  },
}

export default authService