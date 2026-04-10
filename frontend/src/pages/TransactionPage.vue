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

        <div class="transaction-list">
          <TransactionDaySection
            v-for="group in visibleTransactionGroups"
            :key="group.title"
            :title="group.title"
            :total="group.total"
            :total-type="group.totalType"
            :records="group.records"
          />
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
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import TransactionCategoryInlineFilter from '@/components/transactions/TransactionCategoryInlineFilter.vue'
import TransactionDaySection from '@/components/transactions/TransactionDaySection.vue'
import TransactionDateFilterModal from '@/components/transactions/TransactionDateFilterModal.vue'
import TransactionFilterBar from '@/components/transactions/TransactionFilterBar.vue'
import TransactionSortBar from '@/components/transactions/TransactionSortBar.vue'
import { Card, SummaryCard } from '@/components/common'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/category'
import { fetchTransactionGroups } from '@/services/transactions'
import {
  buildMonthOptions,
  filterTransactionGroups,
  flattenTransactionGroups,
  getCategoryFilterLabel,
  getDateFilterLabel,
  summarizeTransactions,
  sortTransactionGroups,
} from '@/utils/transaction'

const PAGE_SIZE = 20

const typeOptions = [
  { label: '전체', value: 'all' },
  { label: '수입', value: 'income' },
  { label: '지출', value: 'expense' },
]

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
  { label: '금액큰순', value: 'amountDesc' },
  { label: '금액작은순', value: 'amountAsc' },
]

const searchQuery = ref('')
const selectedType = ref('all')
const selectedMonth = ref('2026-04')
const selectedCategoryIds = ref([])
const selectedSort = ref('latest')
const isTransactionCategoryOpen = ref(false)
const isDateModalOpen = ref(false)
const visibleGroupCount = ref(PAGE_SIZE)
const loadMoreSentinel = ref(null)
const transactionGroups = ref([])
const dateFilter = ref({
  mode: 'single',
  singleDate: '',
  startDate: '',
  endDate: '',
})

const categoryNameById = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((category) => [category.id, category.name]),
)

const allRecords = computed(() => flattenTransactionGroups(transactionGroups.value))
const monthOptions = computed(() => buildMonthOptions(allRecords.value))
const categoryFilterLabel = computed(() =>
  getCategoryFilterLabel(selectedCategoryIds.value, categoryNameById),
)
const dateFilterLabel = computed(() => getDateFilterLabel(dateFilter.value))

const filteredTransactionGroups = computed(() =>
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
  sortTransactionGroups(filteredTransactionGroups.value, selectedSort.value),
)
const filteredRecords = computed(() => groupedTransactions.value.flatMap((group) => group.records))
const visibleTransactionGroups = computed(() =>
  groupedTransactions.value.slice(0, visibleGroupCount.value),
)
const summary = computed(() => summarizeTransactions(filteredRecords.value))

function applyDateFilter(payload) {
  dateFilter.value = payload
  isDateModalOpen.value = false
}

function toggleTransactionCategory(categoryId) {
  selectedType.value = 'all'
  selectedCategoryIds.value = selectedCategoryIds.value.includes(categoryId)
    ? selectedCategoryIds.value.filter((item) => item !== categoryId)
    : [...selectedCategoryIds.value, categoryId]
}

function resetTransactionCategory() {
  selectedCategoryIds.value = []
}

function loadMoreTransactions() {
  if (visibleGroupCount.value >= groupedTransactions.value.length) {
    return
  }

  visibleGroupCount.value += PAGE_SIZE
}

let observer

watch(monthOptions, (options) => {
  if (!selectedMonth.value && options.length > 0) {
    selectedMonth.value = options[0].value
  }
})

watch(groupedTransactions, () => {
  visibleGroupCount.value = PAGE_SIZE
})

watch(loadMoreSentinel, (element) => {
  if (!observer || !element) return
  observer.disconnect()
  observer.observe(element)
})

onMounted(async () => {
  transactionGroups.value = await fetchTransactionGroups()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        loadMoreTransactions()
      }
    },
    {
      rootMargin: '120px 0px',
    },
  )

  if (loadMoreSentinel.value) {
    observer.observe(loadMoreSentinel.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
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
