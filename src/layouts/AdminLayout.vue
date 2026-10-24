<script setup>
import { onMounted , ref} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLanguage = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLanguage.value
}

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  auth.fetchUser()
})

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'admin-login' })
}

const links = [
  // , exact: true
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/messages', label: 'Messages' },
]
</script>

<template>
  <div class="min-h-screen flex bg-slate-50">
    <aside class="w-56 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
      <div class="px-5 h-16 flex items-center border-b border-slate-800">
        <span class="font-semibold text-white">Admin</span>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 text-base">
        <!-- :exact="link.exact" -->
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-slate-800 text-white"
        >
        {{ $t(link.label) }}

        </router-link>
      </nav>

      <div class="px-3 py-4 border-t border-slate-800 space-y-2">
        <router-link to="/" class="block px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          &larr; View site
        </router-link>
        <button
          class="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          @click="handleLogout"
        >
          Log out
        </button>
      </div>
    </aside>

    <main class="flex-1 min-h-screen">
      <!-- Top Header -->
      <header class="h-16 shrink-0 bg-slate-900 text-slate-300 flex items-center justify-end px-6">
        <!-- Right Options -->
        <div class="flex items-center gap-3">
          <!-- Language -->
          <select
            v-model="currentLanguage"
            @change="changeLanguage"
            class="border border-slate-300 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="km">ខ្មែរ</option>
            <option value="en">English</option>
          </select>
          <!-- Future Options -->
        </div>
      </header>

      <!-- Page Content -->
      <div class="px-6 py-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
