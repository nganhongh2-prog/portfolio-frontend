<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.email, form.password)
    router.push(route.query.redirect || { name: 'admin-dashboard' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-6">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold text-slate-900 mb-1 text-center">Admin login</h1>
      <p class="text-sm text-slate-500 mb-8 text-center">Sign in to manage your portfolio content.</p>

      <form @submit.prevent="submit" class="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input v-model="form.email" required type="email"
                 class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input v-model="form.password" required type="password"
                 class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <router-link to="/" class="block text-center text-sm text-slate-400 hover:text-slate-600 mt-6">&larr; Back to site</router-link>
    </div>
  </div>

</template>
