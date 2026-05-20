export interface User {
  id: string | number
  name: string
  email: string
}

export interface Task {
  id: string | number
  name: string
  completed: boolean
  description?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  status?: string
  priority?: string
  owner?: any
  end?: string
  duration?: number
}

export interface AuthResponse {
  user: User
  message?: string
  accessToken?: string
  refreshToken?: string
}
