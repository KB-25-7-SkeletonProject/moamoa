import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import LoginPage from '@/pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Home,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const hasUser =
    typeof window !== 'undefined' && Boolean(window.sessionStorage.getItem('moamoa-user'))

  if (to.meta.requiresAuth && !hasUser) {
    return '/login'
  }

  if (to.meta.guestOnly && hasUser) {
    return '/dashboard'
  }

  return true
})

export default router
