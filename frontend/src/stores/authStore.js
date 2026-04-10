import { defineStore } from 'pinia'

function loadStoredUser() {
  const raw = sessionStorage.getItem('moamoa-user')
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return parsed
    }
    sessionStorage.removeItem('moamoa-user')
    return null
  } catch {
    sessionStorage.removeItem('moamoa-user')
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: loadStoredUser(),
  }),

  getters: {
    isLoggedIn: (state) => !!state.user?.id,
  },

  actions: {
    login(user) {
      this.user = user ?? null
      if (user) {
        sessionStorage.setItem('moamoa-user', JSON.stringify(user))
      } else {
        sessionStorage.removeItem('moamoa-user')
      }
    },

    logout() {
      this.user = null
      sessionStorage.removeItem('moamoa-user')
    },
  },
})
