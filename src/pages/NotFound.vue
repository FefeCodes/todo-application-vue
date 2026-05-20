<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="text-center p-10 mt-10">
    <h1 class="text-4xl font-bold mb-4 text-gray-800">404 - Page Not Found</h1>
    <p class="mb-4 text-gray-600">The page you’re looking for does not exist.</p>
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
      @click="router.push('/')"
    >
      Back to Home
    </button>
  </div>
</template>
