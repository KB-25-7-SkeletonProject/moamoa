<template>
  <LayoutWrapper title="거래 내역" desc="필터, 정렬, 검색을 사용해서 거래 내역을 한눈에 확인하세요">
    <div class="transaction-page">
      <div class="transaction-shell">
        <div class="transaction-filter-panel">
          <Card class="transaction-filter-card" padding="sm" :interactive="false">
            <TransactionFilterBar
              v-model:search-query="searchQuery"
              v-model:selected-type="selectedType"
              v-model:selected-month="selectedMonth"
              :type-options="typeOptions"
              :month-options="monthOptions"
              :category-label="categoryFilterLabel"
              :is-category-active="selectedCategoryIds.length > 0"
              :is-category-open="isTransactionCategoryOpen"
              :date-label="dateFilterLabel"
              @toggle-category="isTransactionCategoryOpen = !isTransactionCategoryOpen"
              @open-date="isDateModalOpen = true"
            />

            <TransactionCategoryInlineFilter
              v-if="isTransactionCategoryOpen"
              :income-categories="INCOME_CATEGORIES"
              :expense-categories="EXPENSE_CATEGORIES"
              :selected-category-ids="selectedCategoryIds"
              @toggle="toggleTransactionCategory"
              @reset="resetTransactionCategory"
            />
          </Card>
        </div>

        <TransactionSortBar
          v-model:selected-sort="selectedSort"
          :count="filteredRecords.length"
          :options="sortOptions"
        />

        <Card class="summary-grid" padding="sm" :interactive="false">
          <SummaryCard label="수입" :amount="summary.income" type="income" />
          <SummaryCard label="지출" :amount="summary.expense" type="expense" />
          <SummaryCard label="잔액" :amount="summary.balance" type="balance" />
        </Card>

        <p v-if="errorMessage" class="fetch-error">{{ errorMessage }}</p>

        <div class="transaction-list">
          <TransactionDaySection
            v-for="group in visibleTransactionGroups"
            :key="group.title"
            :title="group.title"
            :total="group.total"
            :total-type="group.totalType"
            :records="group.records"
          />
          <p v-if="!errorMessage && visibleTransactionGroups.length === 0" class="empty-message">
            표시할 거래 내역이 없습니다. 필터를 초기화해보세요.
          </p>
          <div ref="loadMoreSentinel" class="load-more-sentinel" aria-hidden="true"></div>
        </div>
      </div>

      <TransactionDateFilterModal
        :is-open="isDateModalOpen"
        :date-filter="dateFilter"
        @close="isDateModalOpen = false"
        @apply="applyDateFilter"
      />
    </div>
  </LayoutWrapper>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Card, SummaryCard } from '@/components/common'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import TransactionCategoryInlineFilter from '@/components/transactions/TransactionCategoryInlineFilter.vue'
import TransactionDateFilterModal from '@/components/transactions/TransactionDateFilterModal.vue'
import TransactionDaySection from '@/components/transactions/TransactionDaySection.vue'
import TransactionFilterBar from '@/components/transactions/TransactionFilterBar.vue'
import TransactionSortBar from '@/components/transactions/TransactionSortBar.vue'
import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/category'
import { useAuthStore } from '@/stores/authStore'
import { fetchTransactionGroups } from '@/services/transactions'
import {
  flattenTransactionGroups,
  buildMonthOptions,
  filterTransactionGroups,
  getCategoryFilterLabel,
  getDateFilterLabel,
  summarizeTransactions,
  sortTransactionGroups,
} from '@/utils/transaction'

const PAGE_SIZE = 20

const typeOptions = [
  { label: '전체', value: 'all' },
  { label: '지출', value: 'expense' },
  { label: '수입', value: 'income' },
]

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '과거순', value: 'oldest' },
  { label: '금액 높은순', value: 'amountDesc' },
  { label: '금액 낮은순', value: 'amountAsc' },
]

const searchQuery = ref('')
const selectedType = ref('all')
const selectedMonth = ref('')
const selectedCategoryIds = ref([])
const selectedSort = ref('latest')
const isTransactionCategoryOpen = ref(false)
const isDateModalOpen = ref(false)
const errorMessage = ref('')

const transactionGroups = ref([])
const visibleGroupCount = ref(PAGE_SIZE)
const loadMoreSentinel = ref(null)
let loadMoreObserver = null

const dateFilter = ref({
  mode: 'single',
  singleDate: '',
  startDate: '',
  endDate: '',
})

const authStore = useAuthStore()

function resolveUserId(userValue) {
  if (!userValue) return null
  if (typeof userValue === 'object') return userValue.id || null

  if (typeof userValue === 'string') {
    try {
      const parsed = JSON.parse(userValue)
      return parsed?.id || null
    } catch {
      return null
    }
  }

  return null
}

const userId = computed(() => resolveUserId(authStore.user))

const categoryNameById = ALL_CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.name
  return acc
}, {})

const categoryFilterLabel = computed(() =>
  getCategoryFilterLabel(selectedCategoryIds.value, categoryNameById),
)

const dateFilterLabel = computed(() => getDateFilterLabel(dateFilter.value))

// 데이터 fetch
const fetchData = async () => {
  try {
    errorMessage.value = ''
    const currentUserId = userId.value
    if (!currentUserId) {
      transactionGroups.value = []
      errorMessage.value = '로그인 사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.'
      return
    }

    transactionGroups.value = await fetchTransactionGroups({ userId: currentUserId })
  } catch (error) {
    transactionGroups.value = []
    errorMessage.value = '거래 내역을 불러오지 못했습니다. json-server 실행 상태를 확인해주세요.'
    console.error('❌ transaction fetch error', error)
  }
}

// computed
const allRecords = computed(() => flattenTransactionGroups(transactionGroups.value))
const monthOptions = computed(() => [
  { value: '', label: '전체' },
  ...buildMonthOptions(allRecords.value),
])

const filteredGroups = computed(() =>
  filterTransactionGroups(transactionGroups.value, {
    searchQuery: searchQuery.value,
    selectedType: selectedType.value,
    selectedMonth: selectedMonth.value,
    selectedCategoryIds: selectedCategoryIds.value,
    dateFilter: dateFilter.value,
    selectedSort: selectedSort.value,
  }),
)

const groupedTransactions = computed(() =>
  sortTransactionGroups(filteredGroups.value, selectedSort.value),
)

const filteredRecords = computed(() => groupedTransactions.value.flatMap((g) => g.records))

const visibleTransactionGroups = computed(() =>
  groupedTransactions.value.slice(0, visibleGroupCount.value),
)

const summary = computed(() => summarizeTransactions(filteredRecords.value))

function toggleTransactionCategory(categoryId) {
  selectedCategoryIds.value = selectedCategoryIds.value.includes(categoryId)
    ? selectedCategoryIds.value.filter((id) => id !== categoryId)
    : [...selectedCategoryIds.value, categoryId]
}

function resetTransactionCategory() {
  selectedCategoryIds.value = []
}

function applyDateFilter(nextDateFilter) {
  dateFilter.value = {
    mode: nextDateFilter.mode || 'single',
    singleDate: nextDateFilter.singleDate || '',
    startDate: nextDateFilter.startDate || '',
    endDate: nextDateFilter.endDate || '',
  }
  visibleGroupCount.value = PAGE_SIZE
  isDateModalOpen.value = false
}

onMounted(async () => {
  await fetchData()

  if (typeof IntersectionObserver === 'undefined' || !loadMoreSentinel.value) {
    return
  }

  loadMoreObserver = new IntersectionObserver((entries) => {
    const [entry] = entries
    if (!entry?.isIntersecting) {
      return
    }

    if (visibleGroupCount.value < groupedTransactions.value.length) {
      visibleGroupCount.value += PAGE_SIZE
    }
  })

  loadMoreObserver.observe(loadMoreSentinel.value)
})

onBeforeUnmount(() => {
  if (loadMoreObserver) {
    loadMoreObserver.disconnect()
  }
})

watch([searchQuery, selectedType, selectedMonth, selectedSort, selectedCategoryIds, dateFilter], () => {
  visibleGroupCount.value = PAGE_SIZE
}, { deep: true })

watch(userId, fetchData)
</script>

<style scoped>
.transaction-page {
  background: var(--bg);
  min-height: calc(100vh - 60px);
}

.transaction-shell {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
}

.transaction-filter-panel {
  position: sticky;
  top: 64px;
  z-index: 30;
  margin-bottom: 12px;
}

.transaction-filter-card {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 8px;
  padding: 0;
  overflow: hidden;
}

.summary-grid :deep(.summary) {
  border-radius: 0;
  box-shadow: none;
  padding: 14px 8px;
  align-items: center;
}

.summary-grid :deep(.summary:not(:last-child)) {
  border-right: 1px solid var(--border);
}

.summary-grid :deep(.summaryLabel) {
  font-size: 10px;
}

.summary-grid :deep(.summaryAmount) {
  font-size: var(--font-size-14);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0 88px;
}

.fetch-error {
  margin: 12px 0 0;
  color: var(--expense);
  font-size: var(--font-size-13);
}

.empty-message {
  margin: 16px 0 0;
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-13);
}

.load-more-sentinel {
  height: 1px;
}

@media (min-width: 768px) {
  .transaction-shell {
    padding: 20px 32px;
  }
}

@media (min-width: 1280px) {
  .transaction-shell {
    padding: 24px 48px;
  }
}
</style>
