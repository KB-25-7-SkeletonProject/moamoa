import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'
import Home from '@/pages/Home.vue'
import Statistics from '@/pages/Statistics.vue'
import RecordPage from '@/pages/RecordPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import TransactionPage from '@/pages/TransactionPage.vue'

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
      path: '/transaction',
      name: 'transaction',
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
      path: '/record',
      name: 'record',
      component: RecordPage,
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
  const hasUser =
    typeof window !== 'undefined' &&
    Boolean(window.sessionStorage.getItem('moamoa-user'))

  // 로그인 필요한 페이지 접근 시
  if (to.meta.requiresAuth && !hasUser) {
    return '/login'
  }

  // 로그인된 상태에서 로그인 페이지 접근 시
  if (to.meta.guestOnly && hasUser) {
    return '/home'
  }

  return true
})

export default router