http://localhost:5173/<script setup>
import { ref } from 'vue'

const open = ref(false)

const nav = [
  { to: '/', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <div class="min-h-screen flex bg-[#f8f7fc] text-slate-800">
    <!-- ========== SIDEBAR ========== -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-[#1a1625] text-white flex flex-col
             transition-transform duration-300 lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Profile -->
      <div class="pt-10 pb-6 px-6 flex flex-col items-center">
        <div class="relative">
          <img
            src="/logo.jpg"
            alt="Ngan Hong"
            class="w-24 h-24 rounded-full object-cover border-4 border-[#2d2640] shadow-lg"
          />
          <!-- small play badge like the design -->
          <div
            class="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-white
                   flex items-center justify-center shadow"
          >
            <svg class="w-3.5 h-3.5 text-[#1a1625]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <h1 class="mt-4 text-lg font-bold tracking-wide uppercase">Ngan Hong</h1>
        <p class="text-sm text-violet-300 mt-0.5">Web Developer</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          @click="open = false"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          active-class="!bg-violet-600/30 !text-violet-300"
          exact-active-class="!bg-violet-600/30 !text-violet-300"
        >
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path :d="item.icon" />
          </svg>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Bottom -->
      <div class="p-5 border-t border-white/10">
        <button
          class="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span class="text-lg">🇺🇸</span>
          <span>English</span>
          <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <p class="mt-4 text-xs text-slate-500">
          Designed by
          <span class="text-violet-400">Ngan Hong</span>
        </p>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="open = false"
    />

    <!-- ========== MAIN CONTENT ========== -->
    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Mobile header -->
      <header class="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-4 h-14 flex items-center">
        <button
          @click="open = !open"
          class="w-10 h-10 rounded-lg flex items-center justify-center text-slate-700"
        >
          <svg v-if="!open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span class="ml-3 font-semibold">Ngan Hong</span>
      </header>

      <main class="flex flex-col  min-h-[calc(100vh-80px)] px-6 py-16">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
