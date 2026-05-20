<script setup lang="ts">
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'vue-toastification'
import * as api from '../api/taskApi'
import TaskList from '../components/TaskList.vue'

const queryClient = useQueryClient()
const toast = useToast()

const name = ref('')
const description = ref('')
const status = ref('TODO')
const priority = ref('LOW')
const duration = ref('')

const search = ref('')
const filter = ref('all')
const refetchTrigger = ref(false)

const { mutate: createTask, isPending } = useMutation({
  mutationFn: api.createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    toast.success('Task created successfully!')
    name.value = ''
    description.value = ''
    status.value = 'TODO'
    priority.value = 'LOW'
    duration.value = ''
    refetchTrigger.value = !refetchTrigger.value
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Failed to create task')
  },
})

const handleSubmit = () => {
  if (!name.value.trim()) {
    toast.error('Task name is required')
    return
  }

  createTask({
    name: name.value.trim(),
    status: status.value,
    priority: priority.value,
    ...(description.value && { description: description.value.trim() }),
    ...(duration.value && { duration: parseFloat(duration.value) }),
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h2 class="text-3xl font-bold mb-6">My Tasks</h2>

    <form @submit.prevent="handleSubmit" class="mb-8 p-6 bg-gray-50 rounded border">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter task name"
          class="w-full p-3 border rounded"
          required
          :disabled="isPending"
        />
      </div>

      <button
        type="submit"
        class="w-full p-3 bg-blue-500 text-white rounded font-medium"
        :disabled="isPending"
      >
        {{ isPending ? 'Creating...' : 'Add Task' }}
      </button>
    </form>

    <div class="flex gap-2 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search tasks"
        class="p-3 border rounded flex-1"
      />
      <select v-model="filter" class="p-3 border rounded">
        <option value="all">All Tasks</option>
        <option value="TODO">To Do</option>
        <option value="DONE">Done</option>
      </select>
    </div>

    <TaskList :search="search" :filter="filter" />
  </div>
</template>
