<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../../api/client'

const projects = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const error = ref('')

const toast = useToast()


const emptyForm = () => ({
  title: '', description: '', content: '', image_url: '',
  tech_stack: '', repo_url: '', demo_url: '', featured: false, sort_order: 0,
})
const form = reactive(emptyForm())

async function load() {
  loading.value = true
  const { data } = await api.get('/projects')
  projects.value = data
  loading.value = false
}
onMounted(load)

function startCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  error.value = ''
  showForm.value = true
}

function startEdit(project) {
  Object.assign(form, {
    ...project,
    tech_stack: (project.tech_stack || []).join(', '),
  })
  editingId.value = project.id
  error.value = ''
  showForm.value = true
}

async function save() {
  saving.value = true
  error.value = ''
  const payload = {
    ...form,
    tech_stack: form.tech_stack
      ? form.tech_stack.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  }
  try {
    if (editingId.value) {
      await api.put(`/projects/${editingId.value}`, payload)
    } else {
      await api.post('/projects', payload)
    }
    toast.info('Saved successfully!')

    showForm.value = false
    await load()
  } catch (e) {
    error.value = Object.values(e.response?.data?.errors || {}).flat().join(' ') || 'Could not save project.'
  } finally {
    saving.value = false
  }
}

async function remove(project) {
  if (!confirm(`Delete "${project.title}"?`)) return
  await api.delete(`/projects/${project.id}`)
  await load()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Projects</h1>
      <button @click="startCreate"
              class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
        + New project
      </button>
    </div>

    <div v-if="loading" class="text-slate-400">Loading…</div>

    <!-- <div v-else class="space-y-3 mb-8">
      <div v-for="project in projects" :key="project.id"
           class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div>
          <p class="font-medium text-slate-800">
            {{ project.title }}
            <span v-if="project.featured" class="ml-2 text-[10px] uppercase tracking-wide bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Featured</span>
          </p>
          <p class="text-sm text-slate-400">{{ project.description }}</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button @click="startEdit(project)" class="text-sm text-indigo-600 hover:underline">Edit</button>
          <button @click="remove(project)" class="text-sm text-red-500 hover:underline">Delete</button>
        </div>
      </div>
      <p v-if="!projects.length" class="text-slate-400">No projects yet.</p>
    </div> -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      <div v-for="project in projects" :key="project.id"
          class="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">

        <!-- Image -->
        <div class="relative h-44 bg-slate-100 overflow-hidden">
          <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">

          <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
            No Image
          </div>

          <span v-if="project.featured"
                class="absolute top-3 left-3 text-[10px] uppercase tracking-wide bg-indigo-600 text-white px-2 py-1 rounded-full">
            Featured
          </span>
        </div>

        <!-- Content -->
        <div class="p-4">

          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-800 truncate">
              {{ project.title }}
            </h3>

            <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">
              #{{ project.sort_order }}
            </span>
          </div>

          <p class="mt-2 text-sm text-slate-400 line-clamp-2">
            {{ project.description }}
          </p>

          <!-- Tech Stack -->
          <!-- <div v-if="project.tech_stack" class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="tech in project.tech_stack.split(',')" :key="tech"
                  class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
              {{ tech.trim() }}
            </span>
          </div> -->

          <!-- Links -->
          <div class="flex gap-3 mt-4">
            <a v-if="project.repo_url" :href="project.repo_url" target="_blank"
              class="text-xs text-slate-600 hover:text-slate-900">
              Repository
            </a>

            <a v-if="project.demo_url" :href="project.demo_url" target="_blank"
              class="text-xs text-indigo-600 hover:text-indigo-700">
              Live Demo
            </a>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            <button @click="startEdit(project)"
                    class="text-sm text-white bg-blue-500 px-3 py-1.5 rounded-lg">
              {{ $t('Edit') }}
            </button>

            <button @click="remove(project)"
                    class="text-sm text-white bg-red-500 px-3 py-1.5 rounded-lg">
              {{ $t('Delete') }}
            </button>
          </div>

        </div>
      </div>

      <p v-if="!projects.length" class="text-slate-400">
        No projects yet.
      </p>

    </div>

    <!-- Create / edit form -->
    <!-- <div v-if="showForm" class="rounded-xl border border-slate-200 bg-white p-6 max-w-xl">
      <h2 class="font-semibold text-slate-800 mb-4">{{ editingId ? 'Edit project' : 'New project' }}</h2>
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input v-model="form.title" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Short description</label>
          <textarea v-model="form.description" required rows="2" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full content (optional)</label>
          <textarea v-model="form.content" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <input v-model="form.image_url" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tech stack (comma-separated)</label>
          <input v-model="form.tech_stack" placeholder="Vue 3, Laravel, MySQL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Repo URL</label>
            <input v-model="form.repo_url" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Demo URL</label>
            <input v-model="form.demo_url" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input v-model="form.featured" type="checkbox" class="rounded border-slate-300" /> Featured
          </label>
          <div class="flex items-center gap-2 text-sm text-slate-700">
            Sort order
            <input v-model.number="form.sort_order" type="number" class="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <div class="flex gap-3">
          <button type="submit" :disabled="saving"
                  class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button type="button" @click="showForm = false"
                  class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div> -->
  <!-- Create / Edit Modal -->
    <div v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="showForm = false"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <!-- Modal Header -->
        <div class="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 class="text-lg font-semibold text-slate-800">
            {{ editingId ? 'Edit project' : 'New project' }}
          </h2>

          <button
            type="button"
            @click="showForm = false"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="save" class="space-y-4 p-6">

          <!-- Title -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              v-model="form.title"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <!-- Short Description -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Short description
            </label>

            <textarea
              v-model="form.description"
              required
              rows="2"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            ></textarea>
          </div>

          <!-- Full Content -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Full content (optional)
            </label>

            <textarea
              v-model="form.content"
              rows="3"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            ></textarea>
          </div>

          <!-- Image URL -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Image URL
            </label>

            <input
              v-model="form.image_url"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <!-- Tech Stack -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">
              Tech stack (comma-separated)
            </label>

            <input
              v-model="form.tech_stack"
              placeholder="Vue 3, Laravel, MySQL"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <!-- Repo + Demo -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                Repo URL
              </label>

              <input
                v-model="form.repo_url"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                Demo URL
              </label>

              <input
                v-model="form.demo_url"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

          </div>

          <!-- Featured + Sort Order -->
          <div class="flex flex-wrap items-center gap-6"><label class="flex items-center gap-2 text-sm text-slate-700">
              <input
                v-model="form.featured"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              Featured
            </label>

            <div class="flex items-center gap-2 text-sm text-slate-700">
              <span>Sort order</span>

              <input
                v-model.number="form.sort_order"
                type="number"
                class="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

          </div>

          <!-- Error -->
          <p
            v-if="error"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500"
          >
            {{ error }}
          </p>

          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <button
              type="button"
              @click="showForm = false"
              class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ saving ? 'Saving…' : 'Save' }}
            </button>

          </div>

        </form>
      </div>
    </div>
  
  </div>

</template>
