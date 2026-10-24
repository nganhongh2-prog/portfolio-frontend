<script setup>
import { reactive, ref } from 'vue'
import api from '../api/client'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const status = ref('idle') // idle | sending | success | error
const errors = ref({})

async function submit() {
  status.value = 'sending'
  errors.value = {}
  try {
    await api.post('/contact', form)
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e) {
    status.value = 'error'
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors || {}
    }
  }
}
</script>

<template>
  <section class="px-6 py-16">
    <h1 class="text-3xl font-bold text-slate-900 mb-2">Get in touch</h1>
    <p class="text-slate-500 mb-10">Have a project in mind or just want to say hi? Send a message.</p>

    <div v-if="status === 'success'" class="rounded-lg bg-green-50 text-green-700 px-4 py-3 mb-6 text-sm">
      Thanks! Your message has been sent — I'll get back to you soon.
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input v-model="form.name" required type="text"
               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name[0] }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input v-model="form.email" required type="email"
               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email[0] }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <input v-model="form.subject" type="text"
               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea v-model="form.message" required rows="5"
               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        <p v-if="errors.message" class="text-xs text-red-500 mt-1">{{ errors.message[0] }}</p>
      </div>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {{ status === 'sending' ? 'Sending…' : 'Send message' }}
      </button>

      <p v-if="status === 'error'" class="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
    </form>
  </section>

</template>
