<!-- -->
<template>
  <LayoutWrapper
    :title="isEditMode ? '기록 수정' : '기록 추가'"
    :desc="isEditMode ? '기존 수입과 지출 기록을 수정하세요' : '수입과 지출을 바로 기록하세요'"
  >
    <div class="page-shell">
      <section v-if="isEditMode" class="page-section page-section_back">
        <Button variant="back" aria-label="뒤로가기" @click="goToRecordDetail">←</Button>
      </section>

      <section class="page-section">
        <Card padding="md">
          <div class="type-toggle">
            <Button
              variant="toggle"
              active-color="expense"
              :active="type === 'expense'"
              @click="type = 'expense'"
            >
              지출
            </Button>
            <Button
              variant="toggle"
              active-color="income"
              :active="type === 'income'"
              @click="type = 'income'"
            >
              수입
            </Button>
          </div>

          <div class="content-stack">
            <Card padding="md" class="amount-summary">
              <div class="amount-summary__label">현재 입력 금액</div>
              <strong class="amount-summary__value">{{ formatCurrency(amount) }}</strong>
            </Card>

            <div class="field-group">
              <Input
                :model-value="amountInput"
                label="금액"
                placeholder="금액을 입력하세요"
                inputmode="numeric"
                autocomplete="off"
                @update:model-value="onAmountInput"
              />

              <Input v-model="date" label="날짜" type="date" />

              <div class="memo-field">
                <label class="memo-field__label" for="add-page-memo">메모</label>
                <textarea
                  id="add-page-memo"
                  v-model="memo"
                  class="memo-field__textarea"
                  placeholder="예: 점심, 교통비, 용돈 입금"
                />
              </div>
            </div>

            <Card padding="md" class="category-card">
              <div class="section-heading">카테고리</div>
              <div class="category-grid">
                <button
                  v-for="category in availableCategories"
                  :key="category.id"
                  type="button"
                  :class="[
                    'category-option',
                    selectedCategory === category.id ? 'category-option_selected' : '',
                  ]"
                  @click="selectedCategory = category.id"
                >
                  <span class="category-option__icon">
                    <CategoryIcon :category-id="category.id" :alt="category.name" />
                  </span>
                  <span class="category-option__label">{{ category.name }}</span>
                </button>
              </div>
            </Card>
          </div>
        </Card>
      </section>

      <section class="page-section page-section_action">
        <Button :disabled="isSaving" @click="save">
          {{ isSaving ? '저장 중...' : isEditMode ? '수정하기' : '저장하기' }}
        </Button>
        <p v-if="errorMessage" class="feedback feedback_error">{{ errorMessage }}</p>
      </section>
    </div>
  </LayoutWrapper>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Input } from '@/components/common'
import CategoryIcon from '@/components/common/CategoryIcon.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/category'
import { createRecord, getRecordById, updateRecord } from '@/services/finance'
import { formatCurrency } from '@/utils/financeFormatters'

const router = useRouter()
const route = useRoute()
const editingRecordId = computed(() => String(route.query.recordId || ''))
const isEditMode = computed(() => !!editingRecordId.value)
const type = ref('expense')
const amount = ref(0)
const amountInput = ref('')
const memo = ref('')
const selectedCategory = ref(EXPENSE_CATEGORIES[0]?.id ?? '')
const isSaving = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

function getLocalDateInputValue() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

const date = ref(getLocalDateInputValue())

const availableCategories = computed(() =>
  type.value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES,
)

watch(type, (nextType) => {
  const categories = nextType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  if (!categories.some((category) => category.id === selectedCategory.value)) {
    selectedCategory.value = categories[0]?.id ?? ''
  }
})

onMounted(loadEditRecord)

function goToRecordDetail() {
  router.back()
}

function onAmountInput(value) {
  const digits = String(value).replace(/\D/g, '')
  amountInput.value = digits
  amount.value = digits ? Number(digits) : 0
}

async function save() {
  if (isSaving.value) {
    return
  }

  errorMessage.value = ''

  if (!selectedCategory.value) {
    errorMessage.value = '카테고리를 선택해 주세요.'
    return
  }

  if (!date.value) {
    errorMessage.value = '날짜를 입력해 주세요.'
    return
  }

  if (amount.value <= 0) {
    errorMessage.value = '금액은 0보다 커야 합니다.'
    return
  }

  isSaving.value = true

  try {
    const payload = {
      type: type.value,
      amount: amount.value,
      categoryId: selectedCategory.value,
      memo: memo.value,
      date: date.value,
    }

    if (isEditMode.value) {
      await updateRecord(editingRecordId.value, payload)
      router.push(`/records/${editingRecordId.value}`)
    } else {
      const created = await createRecord(payload)
      router.push(`/records/${created.id}`)
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '저장 중 문제가 발생했습니다.'
  } finally {
    isSaving.value = false
  }
}

async function loadEditRecord() {
  if (!isEditMode.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const record = await getRecordById(editingRecordId.value)

    if (!record) {
      errorMessage.value = '수정할 기록을 찾을 수 없습니다.'
      return
    }

    type.value = record.type || 'expense'
    amount.value = Number(record.amount || 0)
    amountInput.value = String(record.amount || '')
    memo.value = record.memo || ''
    date.value = record.date || getLocalDateInputValue()
    selectedCategory.value = record.categoryId || selectedCategory.value
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '기록 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.page-shell {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
  display: grid;
  gap: 16px;
}

.page-section {
  padding: 0;
}

.page-section_back {
  padding: 0;
}

.page-section_action {
  padding: 0;
}

.feedback {
  margin-top: 12px;
  font-size: var(--font-size-14);
  color: var(--text-muted);
}

.feedback_error {
  color: var(--expense);
}

.type-toggle {
  display: flex;
  gap: 8px;
  padding: 4px;
  margin-bottom: 16px;
  border-radius: var(--radius-lg);
  background: var(--surface-muted);
}

.amount-summary {
  margin-bottom: 16px;
  background: var(--surface-muted);
}

.content-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-card {
  height: 100%;
}

.amount-summary__label {
  margin-bottom: 6px;
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.amount-summary__value {
  display: block;
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.memo-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.memo-field__label {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--text);
}

.memo-field__textarea {
  min-height: 120px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--text);
  font-size: var(--font-size-16);
  resize: vertical;
}

.memo-field__textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
}

.section-heading {
  margin-bottom: 12px;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--white);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.category-option:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-card-sm);
}

.category-option_selected {
  border-color: var(--primary);
  background: var(--surface-highlight);
}

.category-option__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-option__label {
  font-size: var(--font-size-14);
}

@media (min-width: 768px) {
  .page-shell {
    padding: 20px 32px;
  }
}

@media (min-width: 1280px) {
  .page-shell {
    padding: 24px 48px;
  }

  .amount-summary {
    margin-bottom: 20px;
  }
}
</style>
