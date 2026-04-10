<template>
  <div class="login-shell">
    <section class="login-card">
      <p class="login-eyebrow">MOAMOA LOGIN</p>
      <h1 class="login-title">모아모아</h1>
      <h2 class="login-title">가계부를 시작해보세요</h2>

      <form class="login-form" @submit.prevent="submit">
        <label>
          <span class="field-label">이메일</span>
          <input
            v-model="email"
            class="field-input"
            type="email"
            autocomplete="username"
            placeholder="이메일을 입력하세요"
          />
        </label>

        <label>
          <span class="field-label">비밀번호</span>
          <input
            v-model="password"
            class="field-input"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력하세요"
          />
        </label>

        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>

        <button type="submit" class="action-button login-button" :disabled="isSubmitting">
          {{ isSubmitting ? '로그인 중...' : '로그인' }}
        </button>
        <button
          type="button"
          class="action-button login-button signup-button"
          @click="openSignupNotice"
        >
          회원가입
        </button>
      </form>
    </section>

    <Modal :is-open="isSuccessModalOpen" size="sm" :show-close="false" @close="closeSuccessModal">
      <div class="success-modal">
        <div class="success-badge">MOA</div>
        <p class="success-eyebrow">LOGIN SUCCESS</p>
        <h3 class="success-title">로그인이 완료되었어요</h3>
        <p class="success-copy">오늘 출석도 함께 체크했어요. 확인을 누르면 대시보드로 이동합니다.</p>
        <button type="button" class="action-button success-button" @click="closeSuccessModal">
          확인
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import Modal from '@/components/common/Modal.vue'

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3000'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isSuccessModalOpen = ref(false)

async function submit() {
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value.trim()

  if (!trimmedEmail || !trimmedPassword) {
    errorMessage.value = '이메일과 비밀번호를 모두 입력해주세요.'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const response = await fetch(`${AUTH_API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '로그인 중 오류가 발생했습니다.')
    }

    const attendanceKey = `moamoa-attendance-days:${data.user.id}`
    const savedAttendances = Array.isArray(data.attendances) ? data.attendances : []
    const todayAttendance = formatToday()
    const nextAttendances = Array.from(new Set([...savedAttendances, todayAttendance])).sort()

    window.localStorage.setItem('token', data.user.id)
    window.localStorage.setItem(attendanceKey, JSON.stringify(nextAttendances))

    isSuccessModalOpen.value = true
  } catch (error) {
    errorMessage.value = error.message || '로그인 중 오류가 발생했습니다.'
  } finally {
    isSubmitting.value = false
  }
}

function closeSuccessModal() {
  isSuccessModalOpen.value = false
  router.push('/home')
}

function formatToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

function openSignupNotice() {
  window.alert('관리자에게 문의해주세요')
}
</script>

<style scoped>
.login-error {
  margin: 0;
  color: var(--expense);
  font-size: var(--font-size-13);
}

.signup-button {
  background: #F3F5F9;
  box-shadow: none;
  color: var(--muted);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.success-modal {
  text-align: center;
  display: grid;
  gap: 12px;
}

.success-badge {
  width: 56px;
  height: 56px;
  margin: 0 auto 4px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #FFE168 0%, #FFCC00 100%);
  color: #453500;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 16px 28px rgba(255, 204, 0, 0.28);
}

.success-eyebrow,
.success-title,
.success-copy {
  margin: 0;
}

.success-eyebrow {
  color: #BF8D00;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.success-title {
  color: #18233A;
  font-size: 1.35rem;
  font-weight: 800;
}

.success-copy {
  color: var(--muted);
  line-height: 1.6;
}

.success-button {
  width: 100%;
  margin-top: 8px;
}
</style>
