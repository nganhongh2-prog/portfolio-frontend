import { defineStore } from 'pinia'
import api from '../api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/login', { email, password })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('admin_token', data.token)
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const { data } = await api.get('/me')
        this.user = data
      } catch {
        this.logout()
      }
    },

    async logout() {
      try {
        if (this.token) await api.post('/logout')
      } catch {
        // ignore network errors on logout
      }
      this.token = null
      this.user = null
      localStorage.removeItem('admin_token')
    },
  },
})
