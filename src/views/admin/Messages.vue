<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/client'

const messages = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await api.get('/contact-messages')
  messages.value = data
  loading.value = false
}
onMounted(load)

async function markRead(message) {
  await api.patch(`/contact-messages/${message.id}/read`)
  message.is_read = true
}

async function remove(message) {
  if (!confirm('Delete this message?')) return
  await api.delete(`/contact-messages/${message.id}`)
  await load()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-6">Messages</h1>

    <div v-if="loading" class="text-slate-400">Loading…</div>
    <div v-else-if="!messages.length" class="text-slate-400">No messages yet.</div>

    <div v-else class="space-y-3">
      <div v-for="message in messages" :key="message.id"
           class="rounded-lg border bg-white px-4 py-3"
           :class="message.is_read ? 'border-slate-200' : 'border-indigo-300'">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-medium text-slate-800">
              {{ message.subject || '(no subject)' }}
              <span v-if="!message.is_read" class="ml-2 text-[10px] uppercase tracking-wide bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">New</span>
            </p>
            <p class="text-sm text-slate-500">{{ message.name }} &lt;{{ message.email }}&gt;</p>
          </div>
          <div class="flex gap-2 shrink-0 text-sm">
            <button v-if="!message.is_read" @click="markRead(message)" class="text-indigo-600 hover:underline">Mark read</button>
            <button @click="remove(message)" class="text-red-500 hover:underline">Delete</button>
          </div>
        </div>
        <p class="text-sm text-slate-600 mt-2 whitespace-pre-line">{{ message.message }}</p>
      </div>
    </div>
  </div>

</template>
