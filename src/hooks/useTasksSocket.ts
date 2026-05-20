import { onMounted, onUnmounted } from 'vue'

export interface TaskSocketEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  id?: string | number
  task: any
}

export const useTasksSocket = (onMessage: (event: TaskSocketEvent) => void) => {
  let ws: WebSocket | null = null

  onMounted(() => {
    const token = localStorage.getItem('token')

    if (!token || token === 'null') {
      console.warn('No token found, skipping WebSocket connection.')
      return
    }

    ws = new WebSocket(`wss://api.oluwasetemi.dev/ws/tasks?token=${token}`)

    ws.onopen = () => console.log('Connected to tasks WS')

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (err) {
        console.error('Failed to parse WS message:', err)
      }
    }

    ws.onerror = (err) => console.error('WS Error:', err)
    ws.onclose = () => console.log('WS disconnected')
  })

  onUnmounted(() => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.close()
    }
  })
}
