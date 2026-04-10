<template>
  <LayoutWrapper title="설정" desc="계정 및 보안 설정">
    <div class="page-shell">
      <section class="page-section">
        <article class="settings-card">
        <header class="section-head">
          <p class="section-eyebrow">SECURITY</p>
          <h2 class="section-title">비밀번호 변경</h2>
          <p class="section-copy">현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.</p>
        </header>

        <form class="password-form" @submit.prevent="handleChangePassword">
          <label class="field-block">
            <span class="field-label">현재 비밀번호</span>
            <input
              v-model="form.currentPassword"
              class="field-input"
              type="password"
              autocomplete="current-password"
              placeholder="현재 비밀번호를 입력하세요"
            />
          </label>

          <label class="field-block">
            <span class="field-label">새 비밀번호</span>
            <input
              v-model="form.newPassword"
              class="field-input"
              type="password"
              autocomplete="new-password"
              placeholder="새 비밀번호를 입력하세요"
            />
          </label>

          <label class="field-block">
            <span class="field-label">새 비밀번호 확인</span>
            <input
              v-model="form.confirmPassword"
              class="field-input"
              type="password"
              autocomplete="new-password"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </label>

          <p v-if="errorMessage" class="feedback-message is-error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="feedback-message is-success">{{ successMessage }}</p>

          <button type="submit" class="action-button submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? '변경 중...' : '비밀번호 변경' }}
          </button>
        </form>
        </article>
      </section>

      <section class="page-section page-section_compact">
        <article class="settings-card">
        <header class="section-head">
          <p class="section-eyebrow">EXPORT</p>
          <h2 class="section-title">내역 추출</h2>
          <p class="section-copy">가계부 내역을 엑셀 파일로 내려받습니다.</p>
        </header>

        <p v-if="exportErrorMessage" class="feedback-message is-error">{{ exportErrorMessage }}</p>
        <p v-if="exportSuccessMessage" class="feedback-message is-success">
          {{ exportSuccessMessage }}
        </p>

        <button class="export-btn" type="button" :disabled="isExporting" @click="handleExportExcel">
          {{ isExporting ? '엑셀 파일 생성 중...' : '엑셀 파일로 내역 추출' }}
        </button>
        </article>
      </section>

      <section class="page-section page-section_compact">
        <article class="settings-card danger-card">
        <header class="section-head">
          <p class="section-eyebrow danger-eyebrow">ACCOUNT</p>
          <h2 class="section-title">로그아웃</h2>
          <p class="section-copy">
            현재 기기에서 로그인 정보를 제거하고 로그인 화면으로 이동합니다.
          </p>
        </header>

        <button class="logout-btn" @click="handleLogout">로그아웃</button>
        </article>
      </section>
    </div>
  </LayoutWrapper>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isExporting = ref(false)
const exportErrorMessage = ref('')
const exportSuccessMessage = ref('')

async function handleChangePassword() {
  errorMessage.value = ''
  successMessage.value = ''

  const currentPassword = form.currentPassword.trim()
  const newPassword = form.newPassword.trim()
  const confirmPassword = form.confirmPassword.trim()

  if (!currentPassword || !newPassword || !confirmPassword) {
    errorMessage.value = '모든 비밀번호 항목을 입력해 주세요.'
    return
  }

  if (newPassword.length < 4) {
    errorMessage.value = '새 비밀번호는 4자 이상이어야 합니다.'
    return
  }

  if (newPassword !== confirmPassword) {
    errorMessage.value = '새 비밀번호 확인이 일치하지 않습니다.'
    return
  }

  try {
    isSubmitting.value = true

    const { data } = await api.post('/api/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    })

    successMessage.value = data.message || '비밀번호가 변경되었습니다.'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
    } else {
      errorMessage.value = '비밀번호 변경에 실패했습니다.'
    }
  } finally {
    isSubmitting.value = false
  }
}

async function handleExportExcel() {
  exportErrorMessage.value = ''
  exportSuccessMessage.value = ''

  try {
    isExporting.value = true

    const [{ data: records }, { data: categories }] = await Promise.all([
      api.get('/records'),
      api.get('/categories'),
    ])

    const normalizedRecords = Array.isArray(records) ? records : []
    const normalizedCategories = Array.isArray(categories) ? categories : []

    if (normalizedRecords.length === 0) {
      exportErrorMessage.value = '내보낼 내역이 없습니다.'
      return
    }

    const workbook = buildExcelWorkbook(normalizedRecords, normalizedCategories)
    const fileName = createExportFileName()
    downloadExcelFile(workbook, fileName)

    exportSuccessMessage.value = `${normalizedRecords.length}건의 내역을 엑셀 파일로 저장했습니다.`
  } catch (error) {
    if (axios.isAxiosError(error)) {
      exportErrorMessage.value = error.response?.data?.message || '엑셀 파일 생성에 실패했습니다.'
    } else {
      exportErrorMessage.value = '엑셀 파일 생성에 실패했습니다.'
    }
  } finally {
    isExporting.value = false
  }
}

function buildExcelWorkbook(records, categories) {
  const categoryMap = new Map(
    categories.map((category) => [String(category.id || ''), category.name || '기타']),
  )

  const rows = records
    .map((record, index) => {
      const categoryId = String(record.categoryId || record.category || '')
      const typeLabel = record.type === 'income' ? '수입' : '지출'
      const categoryLabel = categoryMap.get(categoryId) || categoryId || '기타'

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(record.date || '')}</td>
          <td>${escapeHtml(typeLabel)}</td>
          <td>${escapeHtml(categoryLabel)}</td>
          <td>${Number(record.amount || 0)}</td>
          <td>${escapeHtml(record.memo || '')}</td>
          <td>${escapeHtml(record.createdAt || '')}</td>
          <td>${escapeHtml(record.updatedAt || '')}</td>
        </tr>
      `
    })
    .join('')

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta charset="utf-8" />
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #d9dee7; padding: 8px 10px; font-size: 12px; }
          th { background: #f3f5f9; font-weight: 700; }
          td { vertical-align: top; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>날짜</th>
              <th>구분</th>
              <th>카테고리</th>
              <th>금액</th>
              <th>메모</th>
              <th>생성일시</th>
              <th>수정일시</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `.trim()
}

function createExportFileName() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `moamoa-records-${year}${month}${date}-${hours}${minutes}.xls`
}

function downloadExcelFile(content, fileName) {
  const blob = new Blob(['\ufeff', content], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-shell {
  width: min(100%, 1280px);
  margin: 0 auto;
}

.page-section {
  padding: 16px;
}

.page-section_compact {
  padding-top: 0;
}

.settings-card {
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(231, 235, 242, 0.9);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.danger-card {
  background: linear-gradient(180deg, #fff9f9 0%, #ffffff 100%);
}

.section-head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.section-eyebrow,
.section-title,
.section-copy {
  margin: 0;
}

.section-eyebrow {
  color: #bf8d00;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.danger-eyebrow {
  color: #dc2626;
}

.section-title {
  color: #18233a;
  font-size: 1.3rem;
  font-weight: 800;
}

.section-copy {
  color: var(--muted);
  line-height: 1.6;
}

.password-form {
  display: grid;
  gap: 14px;
}

.field-block {
  display: grid;
  gap: 8px;
}

.feedback-message {
  margin: 0 0 12px;
  font-size: var(--font-size-13);
}

.is-error {
  color: var(--expense);
}

.is-success {
  color: var(--income);
}

.submit-button,
.export-btn,
.logout-btn {
  width: 100%;
}

.export-btn {
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: #18233a;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(24, 35, 58, 0.16);
}

.export-btn:disabled,
.logout-btn:disabled,
.submit-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.logout-btn {
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: #ef4444;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.2);
}

.logout-btn:hover {
  background: #dc2626;
}

@media (min-width: 768px) {
  .page-section {
    padding-left: 32px;
    padding-right: 32px;
  }

  .settings-card {
    padding: 28px;
  }
}

@media (min-width: 1200px) {
  .page-section {
    padding: 24px 48px;
  }
}
</style>
