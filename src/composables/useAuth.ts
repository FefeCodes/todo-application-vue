import { ref, readonly } from 'vue'
import * as api from '../api/authApi'
import type { User } from '../types'

const user = ref<User | null>(null)

export function useAuth() {
  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        return
      }
      const me = await api.getMe()
      user.value = me
    } catch (error) {
      user.value = null
    }
  }

  const login = async (credentials: Record<string, string>) => {
    const data = await api.login(credentials)
    user.value = data.user
  }

  const logout = async () => {
    await api.logout()
    user.value = null
  }

  const register = async (userInfo: Record<string, string>) => {
    const data = await api.register(userInfo)
    user.value = data.user
    return data.message || 'Registration successful'
  }

  return {
    user: readonly(user),
    setUser: (u: User | null) => (user.value = u),
    fetchUser,
    login,
    logout,
    register,
  }
}
