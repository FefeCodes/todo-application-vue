<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth'
import { useTasksSocket } from '../hooks/useTasksSocket'

const { user, logout } = useAuth()
const router = useRouter()
const toast = useToast()

const notifications = ref<any[]>([])
const showNotifications = ref(false)

const handleLogout = async () => {
  try {
    await logout()
    toast.success('Logged out successfully')
    router.push('/login')
  } catch (error) {
    toast.error('Logout failed')
    console.error('Logout error:', error)
  }
}

useTasksSocket((event: any) => {
  notifications.value = [event, ...notifications.value].slice(0, 10)

  switch (event.type) {
    case 'CREATE':
      toast.success(`New task added: ${event.task?.name}`)
      break
    case 'UPDATE':
      toast.info(`Task updated: ${event.task?.name}`)
      break
    case 'DELETE':
      toast.error(`Task deleted: ${event.task?.name}`)
      break
  }
})
</script>

<template>
  <header class="px-4 py-5 bg-blue-50 flex justify-between items-center">
    <span>
      <router-link to="/">
        <h1 class="text-xl font-bold">Todo Application</h1>
      </router-link>
    </span>

    <div v-if="user" class="flex items-center">
      <button
        aria-label="Notifications"
        @click="showNotifications = !showNotifications"
        class="mr-4 relative"
      >
        <span class="inline-block w-6 h-6 rounded-full bg-white border items-center justify-center">
          🔔
        </span>
        <span
          v-if="notifications.length > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ notifications.length }}
        </span>
      </button>

      <div
        v-if="showNotifications"
        class="absolute right-4 top-16 w-80 bg-white border rounded shadow z-50 p-2"
      >
        <h4 class="font-semibold mb-2">Notifications</h4>
        <p v-if="notifications.length === 0" class="text-gray-500">No notifications</p>
        <div v-else>
          <div
            v-for="(n, i) in notifications"
            :key="i"
            class="p-2 border-b last:border-b-0 text-sm"
            :class="
              n.type === 'DELETE'
                ? 'text-red-600'
                : n.type === 'CREATE'
                  ? 'text-green-600'
                  : 'text-blue-600'
            "
          >
            {{ n.type }}: {{ n.task?.name }}
          </div>
        </div>
      </div>

      <span class="mr-4">Hello, {{ user.name }}</span>
      <button
        @click="router.push('/profile')"
        class="text-blue-500 hover:underline cursor-pointer mr-4"
      >
        Profile
      </button>
      <button @click="handleLogout" class="text-red-500 hover:underline ml-0 cursor-pointer">
        Logout
      </button>
    </div>
  </header>
</template>
