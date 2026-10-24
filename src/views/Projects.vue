<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/projects')
    projects.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
    <p class="text-slate-500 mb-10">A selection of things I've built.</p>

    <div v-if="loading" class="text-slate-400">Loading…</div>
    <div v-else-if="!projects.length" class="text-slate-400">No projects yet — check back soon.</div>

    <div v-else class="grid sm:grid-cols-2 gap-6">
      <router-link
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.slug}`"
        class="group block rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all"
      >
        <img
          v-if="project.image_url"
          :src="project.image_url"
          :alt="project.title"
          class="w-full h-40 object-cover"
        />
        <div class="p-5">
          <div class="flex items-center gap-2 mb-1">
            <h2 class="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ project.title }}</h2>
            <span v-if="project.featured" class="text-[10px] uppercase tracking-wide bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Featured</span>
          </div>
          <p class="text-sm text-slate-500 line-clamp-2">{{ project.description }}</p>
          <div class="flex flex-wrap gap-1.5 mt-3" v-if="project.tech_stack?.length">
            <span
              v-for="tech in project.tech_stack"
              :key="tech"
              class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </section>

</template>
