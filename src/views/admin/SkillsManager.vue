<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api/client'

const skills = ref([])
const loading = ref(true)
const editingId = ref(null)
const error = ref('')

const emptyForm = () => ({ name: '', category: '', proficiency: 80, sort_order: 0 })
const form = reactive(emptyForm())

async function load() {
  loading.value = true
  const { data } = await api.get('/skills')
  skills.value = data
  loading.value = false
}
onMounted(load)

function startEdit(skill) {
  Object.assign(form, skill)
  editingId.value = skill.id
}

function cancel() {
  Object.assign(form, emptyForm())
  editingId.value = null
  error.value = ''
}

async function save() {
  error.value = ''
  try {
    if (editingId.value) {
      await api.put(`/skills/${editingId.value}`, form)
    } else {
      await api.post('/skills', form)
    }
    cancel()
    await load()
  } catch (e) {
    error.value = Object.values(e.response?.data?.errors || {}).flat().join(' ') || 'Could not save skill.'
  }
}

async function remove(skill) {
  if (!confirm(`Delete "${skill.name}"?`)) return
  await api.delete(`/skills/${skill.id}`)
  await load()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-6">Skills</h1>

    <div class="grid sm:grid-cols-1 gap-8">
      <div>
        <div v-if="loading" class="text-slate-400">Loading…</div>
        <div v-else class="space-y-2">
        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 font-semibold text-slate-700">
                  {{ $t('Name') }}
                </th>

                <th class="px-6 py-4 font-semibold text-slate-700">
                  {{ $t('Category') }}
                </th>

                <th class="px-6 py-4 font-semibold text-slate-700 min-w-[220px]">
                  {{ $t('Proficiency') }}
                </th>
                <th class="px-6 py-4 font-semibold text-slate-700 min-w-[220px]">
                  {{ $t('Achtion') }}
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="skill in skills"
                :key="skill.id"
                class="hover:bg-slate-50 transition-colors duration-200"
              >
                <!-- Name -->
                <td class="px-6 py-4 font-medium text-slate-800">
                  {{ skill.name }}
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                  >
                    {{ skill.category }}
                  </span>
                </td>
                <!-- Proficiency -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">

                    <!-- <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        class="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        :style="{ width: skill.proficiency + '%' }"
                      ></div>
                    </div> -->

                    <span class="w-12 text-right font-medium text-slate-600">
                      {{ skill.proficiency }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button @click="startEdit(skill)" class="text-sm text-white bg-blue-500 px-3 py-1.5 rounded-lg">Edit</button>
                    <button @click="remove(skill)" class="text-sm text-white bg-red-500 px-3 py-1.5 rounded-lg">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          <p v-if="!skills.length" class="text-slate-400">No skills yet.</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 h-fit">
        <h2 class="font-semibold text-slate-800 mb-4">{{ editingId ? 'Edit skill' : 'New skill' }}</h2>
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input v-model="form.name" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input v-model="form.category" placeholder="Frontend, Backend, Tools…" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Proficiency ({{ form.proficiency }}%)</label>
            <input v-model.number="form.proficiency" type="range" min="0" max="100" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Sort order</label>
            <input v-model.number="form.sort_order" type="number" class="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
          </div>

          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

          <div class="flex gap-3">
            <button type="submit" class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              {{ editingId ? 'Save' : 'Add' }}
            </button>
            <button v-if="editingId" type="button" @click="cancel"
                    class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>
