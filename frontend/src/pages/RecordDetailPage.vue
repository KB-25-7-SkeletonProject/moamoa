<template>
  <LayoutWrapper title="기록 상세" desc="기록 상세 정보를 화인하세요">
    <div class="detail-shell">
      <div class="page-back-row">
        <Button variant="back" aria-label="뒤로가기" @click="goHome">←</Button>
      </div>

      <Card v-if="isLoading" padding="md" :interactive="false">
        <p class="feedback">기록 정보를 불러오는 중입니다.</p>
      </Card>

      <Card v-else-if="!record" padding="md" :interactive="false">
        <p class="feedback">기록을 찾을 수 없습니다.</p>
      </Card>

      <template v-else>
        <Card class="hero-card" padding="lg" :interactive="false">
          <div class="hero-date-row">
            <p class="hero-date">{{ formatDateLabel(record.date) }}</p>
            <p class="hero-record-date">기록일자 {{ formatDateTimeLabel(record.updatedAt) }}</p>
          </div>
          <p class="category-chip" :style="{ borderColor: categoryChipBorderColor, backgroundColor: categoryChipBorderColor }">
            <CategoryIcon :category-id="record.categoryId" :alt="resolvedCategoryName" />
            <span>{{ resolvedCategoryName }}</span>
          </p>
          <p :class="['hero-amount', record.type]">{{ formattedAmount }}</p>
        </Card>

        <Card class="info-card" padding="md" :interactive="false">
          <div class="info-row">
            <span class="info-label">유형</span>
            <strong :class="['info-value', record.type]">
              {{ record.type === 'income' ? '수입' : '지출' }}
            </strong>
          </div>
          <div class="info-row">
            <span class="info-label">카테고리</span>
            <strong class="info-value">{{ resolvedCategoryName }}</strong>
          </div>
          <div class="info-row">
            <span class="info-label">거래 후 잔액</span>
            <strong class="info-value">{{ balanceAfterLabel }}</strong>
          </div>
        </Card>

        <Card class="memo-card" padding="md" :interactive="false">
          <p class="memo-label">메모</p>
          <p class="memo-text">{{ record.memo || '메모가 없습니다.' }}</p>
        </Card>

        <Card class="related-card" padding="md" :interactive="false">
          <h3 class="section-title">같은 카테고리 최근 거래</h3>
          <div v-if="relatedRecords.length" class="related-list">
            <button
              v-for="item in relatedRecords"
              :key="item.id"
              type="button"
              class="related-record-button"
              @click="openRecordDetail(item.id)"
            >
              <RecordCard
                :category-id="item.categoryId"
                :title="item.memo || resolvedCategoryName"
                :category="resolvedCategoryName"
                :created-at="formatDateLabel(item.date)"
                :amount="formatExactCurrency(item.amount, item.type === 'income')"
                :type="item.type"
              />
            </button>
          </div>
          <p v-else class="feedback">같은 카테고리 최근 거래가 없습니다.</p>
        </Card>

        <div class="action-row">
          <Button variant="primary" size="sm" label="수정하기" @click="goToEdit" />
          <Button
            variant="outline"
            size="sm"
            label="삭제하기"
            class="delete-btn"
            :disabled="isDeleting"
            @click="confirmDeleteOpen = true"
          />
        </div>
      </template>

      <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
    </div>

    <Modal :is-open="confirmDeleteOpen" size="sm" :max-width="560" show-close @close="confirmDeleteOpen = false">
      <section class="confirm-modal">
        <h3 class="confirm-title">기록 삭제</h3>
        <p class="confirm-copy">이 기록을 삭제할까요?</p>
        <div class="confirm-actions">
          <Button variant="gray" size="md" class="confirm-btn" label="취소" @click="confirmDeleteOpen = false" />
          <Button variant="outline" size="md" class="delete-btn confirm-btn" label="삭제" :disabled="isDeleting" @click="removeRecord" />
        </div>
      </section>
    </Modal>
  </LayoutWrapper>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Modal, RecordCard } from '@/components/common'
import CategoryIcon from '@/components/common/CategoryIcon.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import { ALL_CATEGORIES } from '@/constants/category'
import { deleteRecord, getRecordById, readRecords } from '@/services/finance'
import { formatExactCurrency } from '@/utils/transaction'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const confirmDeleteOpen = ref(false)
const record = ref(null)
const allRecords = ref([])
const CATEGORY_BORDER_COLOR = {
  c001: '#FDBA74',
  c002: '#93C5FD',
  c003: '#F9A8D4',
  c004: '#FCA5A5',
  c005: '#C4B5FD',
  c006: '#67E8F9',
  c007: '#86EFAC',
  c008: '#CBD5E1',
  c101: '#86EFAC',
  c102: '#FCA5A5',
  c103: '#FDBA74',
  c104: '#93C5FD',
  c105: '#FDE047',
  c106: '#A5B4FC',
  c107: '#FDE68A',
  c108: '#CBD5E1',
}

const categoryNameById = ALL_CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.name
  return acc
}, {})

const recordId = computed(() => String(route.params.id || ''))

const resolvedCategoryName = computed(() => {
  if (!record.value) return '-'
  return categoryNameById[record.value.categoryId] || '기타'
})

const formattedAmount = computed(() => {
  if (!record.value) return '-'
  return formatExactCurrency(record.value.amount, record.value.type === 'income')
})

const categoryChipBorderColor = computed(() => {
  if (!record.value) return '#CBD5E1'
  return CATEGORY_BORDER_COLOR[record.value.categoryId] || '#CBD5E1'
})

const balanceAfterLabel = computed(() => {
  if (!record.value) return '-'

  const sorted = [...allRecords.value].sort((a, b) => {
    const leftKey = `${a.date || ''}T${(a.createdAt || '').split('T')[1] || '00:00:00'}`
    const rightKey = `${b.date || ''}T${(b.createdAt || '').split('T')[1] || '00:00:00'}`
    if (leftKey === rightKey) return String(a.id).localeCompare(String(b.id))
    return leftKey.localeCompare(rightKey)
  })

  let balance = 0
  for (const item of sorted) {
    balance += item.type === 'income' ? Number(item.amount || 0) : -Number(item.amount || 0)
    if (item.id === record.value.id) {
      return formatExactCurrency(balance, balance >= 0)
    }
  }

  return '-'
})

const relatedRecords = computed(() => {
  if (!record.value) return []
  return allRecords.value
    .filter(
      (item) =>
        item.id !== record.value.id &&
        item.userId === record.value.userId &&
        item.categoryId === record.value.categoryId,
    )
    .slice(0, 3)
})

watch(
  () => route.params.id,
  () => {
    loadRecord()
  },
  { immediate: true },
)

async function loadRecord() {
  if (!recordId.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const found = await getRecordById(recordId.value)
    record.value = found
    if (found?.userId) {
      allRecords.value = await readRecords({ userId: found.userId })
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '기록 조회에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

function goToEdit() {
  if (!recordId.value) return
  router.push({ path: '/entry', query: { recordId: recordId.value } })
}

function openRecordDetail(id) {
  if (!id) return
  router.push(`/records/${id}`)
}

function goHome() {
  router.back()
}

async function removeRecord() {
  if (!recordId.value || isDeleting.value) return

  isDeleting.value = true
  errorMessage.value = ''

  try {
    await deleteRecord(recordId.value)
    confirmDeleteOpen.value = false
    router.push('/home')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.'
  } finally {
    isDeleting.value = false
  }
}

function formatDateLabel(value) {
  if (!value) return '-'
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return String(value)
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

function formatTime(value) {
  if (!value) return '00:00'
  return String(value).split('T')[1]?.slice(0, 5) || '00:00'
}

function formatDateTimeLabel(value) {
  if (!value) return '-'
  const [datePart = '', timePart = ''] = String(value).split('T')
  const [year = '', month = '', day = ''] = datePart.split('-')
  const hhmm = timePart.slice(0, 5) || '00:00'
  if (!year || !month || !day) return String(value)
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')} ${hhmm}`
}
</script>

<style scoped>
.detail-shell {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.page-back-row {
  display: flex;
  align-items: center;
}

.hero-card {
  background: var(--white);
}

.hero-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.hero-date {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-700);
  text-align: left;
}

.hero-record-date {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-12);
  text-align: right;
}

.category-chip {
  margin: 0 auto 10px;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid #CBD5E1;
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-700);
  color: #111;
}

.category-chip :deep(.icon) {
  width: 16px;
  height: 16px;
}

.hero-amount {
  margin: 0;
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -1px;
  text-align: center;
}

.hero-amount.income {
  color: var(--income);
}

.hero-amount.expense {
  color: var(--expense);
}

.info-card,
.memo-card,
.related-card {
  border-radius: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f1f1f1;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--text-muted);
}

.info-value {
  color: var(--text);
  font-weight: var(--font-weight-700);
}

.info-value.income {
  color: var(--income);
}

.info-value.expense {
  color: var(--expense);
}

.memo-label {
  margin: 0 0 6px;
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.memo-text {
  margin: 0;
  font-size: 24px;
  font-weight: var(--font-weight-700);
  line-height: 1.4;
}

.updated-at {
  margin: 10px 0 0;
  color: var(--text-muted);
  font-size: var(--font-size-12);
}

.updated-at span {
  margin-right: 6px;
}

.section-title {
  margin: 0 0 10px;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
}

.related-list {
  display: grid;
  gap: 8px;
}

.related-list :deep(.record) {
  box-shadow: none;
  border: 1px solid #f1f1f1;
}

.related-record-button {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.delete-btn {
  background: #d84343;
  border-color: #d84343 !important;
  color: #fff !important;
}

.confirm-modal {
  display: grid;
  gap: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.confirm-title,
.confirm-copy {
  margin: 0;
}

.confirm-copy {
  color: var(--text-muted);
}

.confirm-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
}

.confirm-actions :deep(button) {
  flex: 1;
  width: 100% !important;
  min-width: 0;
}

.confirm-btn {
  min-height: 48px;
}

.feedback {
  margin: 0;
  color: var(--text-muted);
}

.feedback.error {
  color: var(--expense);
}

@media (max-width: 767px) {
  .confirm-btn {
    min-height: 44px;
  }

  .hero-date {
    font-size: var(--font-size-16);
  }

  .hero-record-date {
    font-size: 11px;
  }

  .hero-amount {
    font-size: 44px;
  }

  .memo-text {
    font-size: var(--font-size-18);
  }
}

@media (min-width: 768px) {
  .detail-shell {
    padding: 20px 32px;
  }
}

@media (min-width: 1280px) {
  .detail-shell {
    padding: 24px 48px;
  }
}
</style>
