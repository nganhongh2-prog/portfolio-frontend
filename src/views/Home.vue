<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/profile')
    profile.value = data
  } catch {
    error.value = 'Could not load profile. Is the API running?'
  } finally {
    loading.value = false
  }
})
</script>

<template>
    <div v-if="loading" class="text-slate-400">Loading…</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div
        v-else-if="profile"
        class=" px-6 py-16"
      >

        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          WELCOME TO
          <span class="text-violet-600">MY RESUME!</span>
        </h1>

        <!-- Contact info -->
       <div class="mt-6 flex items-center gap-x-5 gap-y-2 text-sm text-violet-600">
          <a target="blank" href="https://www.google.com/maps/place/National+Technical+Training+Institute+(NTTI)/@11.567111,104.876875,18z/data=!4m6!3m5!1s0x310951bd8ff5ab0f:0x14bf178a46f8f969!8m2!3d11.567139!4d104.8768907!16s%2Fg%2F11r9j26z3!5m1!1e2?hl=en&entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D">
            <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {{ profile.location }}
          </span>
          </a>
          
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            {{ profile.email }}
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            (+885) 682 551 10 
          </span>
        </div>

        <!-- Bio -->
       <div class="mt-8 max-w-3xl space-y-5 text-[15px] leading-relaxed text-slate-600">
          <p>
            {{ profile.bio }}
          </p>
        </div>

        <!-- Social buttons -->
       <div class="mt-10 flex items-center  gap-3">
          <a href="#" class="w-11 h-11 rounded-full bg-[#1a1625] text-white flex items-center justify-center hover:bg-violet-600 transition-colors">
            <!-- Instagram -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" class="w-11 h-11 rounded-full bg-[#1a1625] text-white flex items-center justify-center hover:bg-violet-600 transition-colors">
            <!-- LinkedIn -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a v-if="profile.github_url" :href="profile.github_url" target="_blank"  class="w-11 h-11 rounded-full bg-[#1a1625] text-white flex items-center justify-center hover:bg-violet-600 transition-colors">
            <!-- GitHub -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="#" class="w-11 h-11 rounded-full bg-[#1a1625] text-white flex items-center justify-center hover:bg-violet-600 transition-colors">
            <!-- PDF -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </a>
        </div>
       
    </div>

</template>
