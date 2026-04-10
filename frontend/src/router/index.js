import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'
import Home from '@/pages/Home.vue'
import Statistics from '@/pages/Statistics.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import TransactionPage from '@/pages/TransactionPage.vue'
import AddPage from '@/pages/AddPage.vue'
import RecordDetailPage from '@/pages/RecordDetailPage.vue'
import { useAuthStore } from '@/stores/authStore'


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
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
      meta: { requiresAuth: true },
    },
    {
      path: '/entry',
      name: 'entry',
      component: AddPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/records/:id',
      name: 'record-detail',
      component: RecordDetailPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: { requiresAuth: true },
    }
  ],
})


// 인증 가드
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }
  
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return '/home'
  }

  return true
})

export default router
