<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import api from '../../api/client'

const form = reactive({
  name: '', title: '', bio: '', avatar_url: '', email: '',
  location: '', resume_url: '', github_url: '', linkedin_url: '', twitter_url: '',
})
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)

onMounted(async () => {
  const { data } = await api.get('/profile')
  if (data) Object.assign(form, data)
  loading.value = false
})

async function save() {
  saving.value = true
  saved.value = false
  try {
    const { data } = await api.put('/profile', form)
    Object.assign(form, data)
    saved.value = true
      toast.info('Saved successfully!')

    setTimeout(() => (saved.value = false), 2500)
  } finally {
    saving.value = false
  }
}
const toast = useToast()


const fields = [
  ['name', 'Name', 'text'],
  ['title', 'Title', 'text'],
  ['email', 'Public email', 'email'],
  ['location', 'Location', 'text'],
  ['avatar_url', 'Avatar URL', 'text'],
  ['resume_url', 'Resume URL', 'text'],
  ['github_url', 'GitHub URL', 'text'],
  ['linkedin_url', 'LinkedIn URL', 'text'],
  ['twitter_url', 'Twitter URL', 'text'],
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-6">{{ $t("Profile") }}</h1>

    <div v-if="loading" class="text-slate-400">Loading…</div>

    <form v-else @submit.prevent="save" class="space-y-5 w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="[key, label, type] in fields" :key="key">
            <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t(label) }}</label>
            <input v-model="form[key]" :type="type"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
      </div>
      

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Bio</label>
        <textarea v-model="form.bio" rows="4"
               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
      </div>

      <div class="flex items-center gap-3">
        <button type="submit" :disabled="saving"
                class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors">
          <!-- {{ saving ? 'Saving' : "{{ $t('Save changes') }}" }} -->
          {{ $t('Save changes')}}
        </button>
        <!-- <span v-if="saved" class="text-sm text-green-600">Saved!</span> -->
      </div>
    </form>
  </div>

</template>
