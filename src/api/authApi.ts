import axios from 'axios'
import type { User, AuthResponse } from '../types'

const BASE_URL = 'https://api.oluwasetemi.dev'

export const register = async (user: Record<string, string>): Promise<AuthResponse> => {
  const { data, status } = await axios.post<AuthResponse>(`${BASE_URL}/auth/register`, user)
  if (status === 201) {
    localStorage.setItem('token', data.accessToken || '')
    localStorage.setItem('refreshToken', data.refreshToken || '')
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  console.log('Register response:', { data, status })
  return data
}

export const login = async (credentials: Record<string, string>): Promise<AuthResponse> => {
  const { data, status } = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, credentials)
  if (data.accessToken) {
    localStorage.setItem('token', data.accessToken || '')
    localStorage.setItem('refreshToken', data.refreshToken || '')
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  console.log('Login response:', { data, status })
  return data
}

export const logout = async (): Promise<void> => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

export const getMe = async (): Promise<User> => {
  const { data } = await axios.get<User>(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return data
}

export const updateMe = async (updates: Partial<User>): Promise<AuthResponse> => {
  const { data } = await axios.put<AuthResponse>(`${BASE_URL}/auth/me`, updates, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return data
}
