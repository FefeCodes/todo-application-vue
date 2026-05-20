<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')

const router = useRouter()
const toast = useToast()
const { login } = useAuth()

const onSubmit = async () => {
  try {
    await login({ email: email.value, password: password.value })
    toast.success('Login successful! Redirecting to home...')
    router.push('/')
  } catch (error: any) {
    console.error('Login failed:', error.response?.data)
    toast.error(
      error.response?.data?.message || 'Login failed. Please check your credentials and try again.',
    )
  }
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="max-w-md mx-auto mt-10 px-6 py-10 flex flex-col justify-between items-center bg-blue-50 rounded-2xl"
  >
    <h2 class="text-2xl font-bold mb-6">Login</h2>
    <input v-model="email" placeholder="Email" class="w-full p-2 mb-2 border rounded" required />
    <input
      v-model="password"
      placeholder="Password"
      type="password"
      class="w-full p-2 mb-4 border rounded"
      required
    />
    <button
      type="submit"
      class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
    >
      Login
    </button>

    <p class="mt-4 text-sm text-gray-600">
      Don't have an account?
      <router-link to="/register" class="text-blue-500 hover:underline"> Register </router-link>
    </p>
  </form>
</template>
