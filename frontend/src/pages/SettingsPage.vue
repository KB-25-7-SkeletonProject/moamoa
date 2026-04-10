<template>
  <LayoutWrapper title="설정" desc="계정 및 앱 설정">
    <section class="page-body">
      <button class="logout-btn" @click="handleLogout">
        로그아웃
      </button>
    </section>
  </LayoutWrapper>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.logout-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: #ef4444;
  color: white;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #dc2626;
}
</style>