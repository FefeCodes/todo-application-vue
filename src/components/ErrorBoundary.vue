<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)

// This hook catches errors from any child components inside the <slot>
onErrorCaptured((err, instance, info) => {
  console.error('ErrorBoundary caught an error', err, info)

  hasError.value = true
  error.value = err as Error

  return false
})

const resetError = () => {
  hasError.value = false
  error.value = null
}
</script>

<template>
  <div v-if="hasError" class="p-10 bg-red-100 border border-red-300 rounded mt-4">
    <h2 class="text-red-500 text-xl font-bold">Something went wrong.</h2>
    <p class="text-red-700 mt-2">
      {{ error?.message || 'An unexpected error occurred.' }}
    </p>
    <button
      class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
      @click="resetError"
    >
      Try Again
    </button>
  </div>

  <slot v-else></slot>
</template>
