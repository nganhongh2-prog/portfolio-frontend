<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/client'

const skills = ref([])
const loading = ref(true)
const progress = ref({})


onMounted(async () => {
  try {
    const { data } = await api.get('/skills')
    skills.value = data
    skills.value.forEach(skill => { progress.value[skill.id] = 0 })
    setTimeout(() => { skills.value.forEach(skill => { progress.value[skill.id] = skill.proficiency }) }, 150)
  } finally {
    loading.value = false
  }
})

const grouped = computed(() => {
  const groups = {}
  for (const skill of skills.value) {
    const key = skill.category || 'Other'
    if (!groups[key]) groups[key] = []
    groups[key].push(skill)
  }
  return groups
})
</script>

<template>
  <section class="px-6 py-16">
    <h1 class="text-3xl font-bold text-slate-900 mb-2">Skills</h1>
    <p class="text-slate-500 mb-10">Technologies and tools I work with.</p>

    <div v-if="loading" class="text-slate-400">Loading…</div>
    <div v-else-if="!skills.length" class="text-slate-400">No skills listed yet.</div>

    <div v-else class="grid sm:grid-cols-2 gap-x-12 gap-y-10">
      <div v-for="(items, category) in grouped" :key="category">
        <h2 class="font-semibold text-slate-800 mb-4">{{ category }}</h2>
        <div class="space-y-4">
          <div v-for="skill in items" :key="skill.id">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-700">{{ skill.name }}</span>
              <span class="text-slate-400">{{ skill.proficiency }}%</span>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" :style="{ width: (progress[skill.id] || 0) + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>
