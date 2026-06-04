<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import * as api from '../api/taskApi'
import TaskItem from './TaskItem.vue'
import { useAuth } from '../composables/useAuth'
import type { Task } from '../types'

const props = defineProps<{
  search?: string
  filter?: string
  refetchTrigger?: boolean
}>()

const DEFAULT_ITEMS_PER_PAGE = 10

const page = ref(1)
const online = ref(navigator.onLine)
const showMine = ref(false)
const itemsPerPage = ref<number | 'all'>(DEFAULT_ITEMS_PER_PAGE)

const { user } = useAuth()

// Vue's computed handles reactive dependencies automatically
const limit = computed(() => (itemsPerPage.value === 'all' ? 1000000 : Number(itemsPerPage.value)))

const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['tasks', page, itemsPerPage],
  queryFn: () => api.fetchTasks(page.value, limit.value),
  placeholderData: keepPreviousData,
  staleTime: 1000 * 60 * 5,
})

// Refetch when the prop from Home.vue toggles
watch(
  () => props.refetchTrigger,
  () => {
    refetch()
  },
)

// Reset to page 1 when items per page changes
watch(itemsPerPage, () => {
  page.value = 1
})

const updateOnlineStatus = () => {
  online.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

// Computed property to handle all filtering reactively
const filteredTasks = computed(() => {
  let tasks: Task[] = data.value?.data || []

  if (props.search) {
    tasks = tasks.filter((t) => t.name.toLowerCase().includes(props.search!.toLowerCase()))
  }

  const ownerMatches = (owner: any) => {
    if (!user.value) return false
    if (!owner) return false
    if (typeof owner === 'string') {
      return owner === user.value.id || owner === (user.value as any)._id
    }
    return (
      owner.id === user.value.id ||
      owner._id === user.value.id ||
      owner.id === (user.value as any)._id ||
      owner._id === (user.value as any)._id
    )
  }

  if (showMine.value) tasks = tasks.filter((t) => ownerMatches(t.owner))
  if (props.filter === 'complete') tasks = tasks.filter((t) => t.completed)
  if (props.filter === 'incomplete') tasks = tasks.filter((t) => !t.completed)
  if (props.filter === 'high') tasks = tasks.filter((t) => t.priority === 'HIGH')
  if (props.filter === 'medium') tasks = tasks.filter((t) => t.priority === 'MEDIUM')
  if (props.filter === 'low') tasks = tasks.filter((t) => t.priority === 'LOW')
  if (props.filter === 'TODO') tasks = tasks.filter((t) => t.status === 'TODO')
  if (props.filter === 'DONE') tasks = tasks.filter((t) => t.status === 'DONE')
  if (props.filter === 'IN_PROGRESS') tasks = tasks.filter((t) => t.status === 'IN_PROGRESS')
  if (props.filter === 'CANCELLED') tasks = tasks.filter((t) => t.status === 'CANCELLED')

  return tasks
})

const totalPages = computed(() => {
  const meta = data.value?.meta
  return (
    meta?.totalPages ||
    Math.max(
      1,
      Math.ceil(
        (meta?.total || 0) / (itemsPerPage.value === 'all' ? meta?.total || 1 : limit.value),
      ),
    )
  )
})
</script>

<template>
  <p v-if="isLoading">Loading tasks...</p>
  <p v-else-if="isError">Error: {{ (error as Error).message }}</p>

  <div v-else class="relative">
    <div v-if="!online" class="bg-red-200 text-red-800 p-2 text-center mb-2 rounded">
      You are offline. Viewing saved tasks.
    </div>

    <div class="mb-4 flex items-center gap-4 justify-between">
      <div class="flex items-center gap-3">
        <button
          role="switch"
          :aria-checked="showMine"
          @click="showMine = !showMine"
          :class="`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${showMine ? 'bg-blue-600' : 'bg-gray-300'}`"
        >
          <span
            :class="`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMine ? 'translate-x-6' : 'translate-x-1'}`"
          />
        </button>
        <span class="text-sm">Show only my tasks</span>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Items per page:</label>
        <select v-model="itemsPerPage" class="p-2 border rounded" aria-label="Items per page">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>

    <p v-if="filteredTasks.length === 0">No tasks found</p>
    <ul v-else>
      <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" />
    </ul>

    <div class="flex justify-center mt-4 space-x-2">
      <button
        :disabled="page === 1"
        @click="page = Math.max(page - 1, 1)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      <button
        :disabled="page === totalPages"
        @click="page = Math.min(page + 1, totalPages)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
