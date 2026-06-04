<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'vue-toastification'
import * as api from '../api/taskApi'
import type { Task } from '../types'

const props = defineProps<{ task: Task }>()
const queryClient = useQueryClient()
const toast = useToast()

const { mutate: toggleTask } = useMutation({
  mutationFn: () => {
    const isNowCompleted = !props.task.completed
    return api.updateTask(props.task.id, {
      completed: isNowCompleted,
      status: isNowCompleted ? 'DONE' : 'TODO',
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  },
})

const { mutate: deleteTask } = useMutation({
  mutationFn: () => api.deleteTask(props.task.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    toast.success('Task deleted successfully!')
  },
})
</script>

<template>
  <li class="flex justify-between items-center p-3 border-b">
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        :checked="task.completed || task.status === 'DONE'"
        @change="toggleTask()"
        class="form-checkbox cursor-pointer"
      />
      <router-link
        :to="`/tasks/${task.id}`"
        :class="
          task.completed || task.status === 'DONE'
            ? 'line-through text-gray-500'
            : 'hover:underline'
        "
      >
        {{ task.name }}
      </router-link>
    </div>

    <button @click="deleteTask()" class="text-red-500 hover:text-red-700 cursor-pointer">
      Delete
    </button>
  </li>
</template>
