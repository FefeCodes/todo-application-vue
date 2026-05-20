<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth'
import * as api from '../api/authApi'

const { user, setUser } = useAuth()
const toast = useToast()

const name = ref(user.value?.name || '')
const email = ref(user.value?.email || '')

// In case the user details arrive slightly after mount
watch(user, (newUser) => {
  if (newUser) {
    name.value = newUser.name
    email.value = newUser.email
  }
})

const { mutate } = useMutation({
  mutationFn: (data: { name: string; email: string }) => api.updateMe(data),
  onSuccess: (data: any) => {
    setUser(data.user)
    toast.success('Profile updated successfully!')
  },
  onError: () => toast.error('Failed to update profile'),
})

const handleSubmit = () => {
  mutate({ name: name.value, email: email.value })
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <label class="flex flex-col">
        Name
        <input
          type="text"
          v-model="name"
          class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </label>

      <label class="flex flex-col">
        Email
        <input
          type="email"
          v-model="email"
          class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </label>
    </form>
  </div>
</template>
