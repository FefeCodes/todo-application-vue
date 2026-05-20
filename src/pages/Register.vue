<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth'

const name = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
const toast = useToast()
const { register } = useAuth()

const onSubmit = async () => {
  try {
    const result = await register({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    toast.success(result || 'Registration successful! Redirecting to home...')
    router.push('/')
  } catch (error: any) {
    console.error('Registration failed:', error.response?.data)
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="max-w-md mx-auto mt-10 p-4 border rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <input v-model="name" placeholder="Name" class="w-full p-2 mb-2 border rounded" required />
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
      class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
    >
      Register
    </button>

    <p class="mt-4 text-sm text-gray-600">
      Already have an account?
      <router-link to="/login" class="text-blue-500 hover:underline"> Login </router-link>
    </p>
  </form>
</template>
