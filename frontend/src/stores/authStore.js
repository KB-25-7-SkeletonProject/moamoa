import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: sessionStorage.getItem('moamoa-user') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    login() {
      this.user = 'true'
      sessionStorage.setItem('moamoa-user', 'true')
    },

    logout() {
      this.user = null
      sessionStorage.removeItem('moamoa-user')
    },
  },
})