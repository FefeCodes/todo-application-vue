import axios from 'axios'
import type { Task } from '../types'

const BASE_URL = 'https://api.oluwasetemi.dev'

export interface FetchTasksResponse {
  data: Task[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const fetchTasks = async (
  page: number = 1,
  limit: number = 10,
): Promise<FetchTasksResponse> => {
  console.log('Fetching tasks for page:', page, 'limit:', limit)
  const { data } = await axios.get<FetchTasksResponse>(
    `${BASE_URL}/tasks?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    },
  )
  return data
}

export const fetchTask = async (id: string): Promise<Task> => {
  const { data } = await axios.get<Task[]>(`${BASE_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return (data as any).data || data
}

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const { data } = await axios.post<Task>(`${BASE_URL}/tasks`, task, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return data
}

export const fetchTodos = async (): Promise<Task[]> => {
  const { data } = await axios.get<Task[]>(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return Array.isArray(data) ? data : (data as any).data
}

export const updateTask = async (id: string | number, updates: Partial<Task>): Promise<Task> => {
  const { data } = await axios.patch<Task>(`${BASE_URL}/tasks/${id}`, updates, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return data
}

export const deleteTask = async (id: string | number): Promise<void> => {
  await axios.delete(`${BASE_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
}
