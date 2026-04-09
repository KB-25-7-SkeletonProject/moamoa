import { createRouter, createWebHistory } from 'vue-router'
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
      name: 'home',
      component: Home
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: TransactionPage
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics
    },
    {
      path: '/record',
      name: 'record',
      component: RecordPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ],
})

export default router
