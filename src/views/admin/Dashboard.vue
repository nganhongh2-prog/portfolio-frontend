<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/client'

const counts = ref({ projects: null, skills: null, messages: null, unread: null })

onMounted(async () => {
  const [projects, skills, messages] = await Promise.all([
    api.get('/projects'),
    api.get('/skills'),
    api.get('/contact-messages'),
  ])
  counts.value = {
    projects: projects.data.length,
    skills: skills.data.length,
    messages: messages.data.length,
    unread: messages.data.filter((m) => !m.is_read).length,
  }
})

const cards = [
  { key: 'projects', label: 'Projects', to: '/admin/projects' },
  { key: 'skills', label: 'Skills', to: '/admin/skills' },
  { key: 'messages', label: 'Messages', to: '/admin/messages', badgeKey: 'unread' },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
    <p class="text-slate-500 mb-8">Overview of your portfolio content.</p>

    <div class="grid sm:grid-cols-3 gap-4">
      <router-link
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-indigo-200 transition-all"
      >
        <p class="text-sm text-slate-500 mb-1">{{ card.label }}</p>
        <p class="text-3xl font-bold text-slate-900">{{ counts[card.key] ?? '—' }}</p>
        <p v-if="card.badgeKey && counts[card.badgeKey]" class="text-xs text-indigo-600 mt-1">
          {{ counts[card.badgeKey] }} unread
        </p>
      </router-link>
    </div>
  </div>

</template>
