<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import * as api from '../api/taskApi'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const {
  data: raw,
  isLoading,
  error,
} = useQuery({
  queryKey: ['task', id],
  queryFn: () => api.fetchTask(id),
  enabled: Boolean(id),
})
</script>

<template>
  <p v-if="!id">Invalid task id.</p>
  <p v-else-if="isLoading">Loading task details...</p>
  <p v-else-if="error">Error loading task.</p>
  <p v-else-if="!raw">Task not found.</p>

  <div v-else class="max-w-md mx-auto mt-10 p-4 border rounded shadow">
    <button @click="router.push('/')" class="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
      ← Back to list
    </button>

    <h2 class="text-2xl font-bold mb-4">{{ raw.name }}</h2>

    <p>
      <strong>Status:</strong>
      {{ raw.status || (raw.completed ? 'Completed ✅' : 'Incomplete ❌') }}
    </p>
    <p v-if="raw.description"><strong>Description:</strong> {{ raw.description }}</p>
    <p v-if="raw.end"><strong>End Date:</strong> {{ new Date(raw.end).toLocaleDateString() }}</p>
    <p v-if="raw.priority"><strong>Priority:</strong> {{ raw.priority.toUpperCase() }}</p>
    <p v-if="raw.duration"><strong>Duration:</strong> {{ raw.duration }} hours</p>
    <p v-if="raw.createdAt">
      <strong>Created At:</strong>
      {{ new Date(raw.createdAt).toLocaleString() }}
    </p>
    <p v-if="raw.updatedAt">
      <strong>Last Updated:</strong>
      {{ new Date(raw.updatedAt).toLocaleString() }}
    </p>
  </div>
</template>
