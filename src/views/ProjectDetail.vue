<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'

const route = useRoute()
const project = ref(null)
const loading = ref(true)
const notFound = ref(false)

async function load() {
  loading.value = true
  notFound.value = false
  try {
    const { data } = await api.get(`/projects/${route.params.slug}`)
    project.value = data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <section class=" mx-auto px-6 py-16">
    <router-link to="/projects" class="text-sm text-indigo-600 hover:underline">&larr; Back to projects</router-link>

    <div v-if="loading" class="text-slate-400 mt-8">Loading…</div>
    <div v-else-if="notFound" class="text-slate-400 mt-8">Project not found.</div>

    <article v-else-if="project" class="mt-6">
      <img
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="w-full rounded-xl mb-8 object-cover max-h-80"
      />

      <h1 class="text-3xl font-bold text-slate-900 mb-3">{{ project.title }}</h1>

      <div class="flex flex-wrap gap-2 mb-6" v-if="project.tech_stack?.length">
        <span
          v-for="tech in project.tech_stack"
          :key="tech"
          class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
        >
          {{ tech }}
        </span>
      </div>

      <p class="text-slate-600 leading-relaxed mb-6">{{ project.description }}</p>
      <p v-if="project.content" class="text-slate-600 leading-relaxed whitespace-pre-line">{{ project.content }}</p>

      <div class="flex gap-4 mt-8">
        <a v-if="project.demo_url" :href="project.demo_url" target="_blank" rel="noopener"
           class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
          Live demo
        </a>
        <a v-if="project.repo_url" :href="project.repo_url" target="_blank" rel="noopener"
           class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
          Source code
        </a>
      </div>
    </article>
  </section>

</template>
