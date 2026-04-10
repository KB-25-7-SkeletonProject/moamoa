<template>
  <LayoutWrapper
    :title="dashboardTitle"
    desc="오늘의 출석 현황과 기록을 한눈에 확인해보세요"
  >
    <div class="dashboard-page">
      <section class="hero-card card">
        <p class="hero-eyebrow">ATTENDANCE DASHBOARD</p>
        <div class="hero-value">{{ checkedCount }}일 출석</div>
        <div class="hero-meta">
          <span class="hero-chip">이번 달 {{ checkedCount }}회</span>
          <span class="hero-chip">연속 {{ streakCount }}일</span>
          <span class="hero-chip">오늘 {{ todayChecked ? '출석 완료' : '미출석' }}</span>
        </div>
      </section>

      <DashboardSection title="캘린더">
        <Calendar
          :year="displayYear"
          :month="displayMonth"
          :days="calendarDays"
          :today="todayInView"
          :interactive="true"
          @prev="moveMonth(-1)"
          @next="moveMonth(1)"
          @day-click="openDayRecordsModal"
        />
      </DashboardSection>

      <section class="attendance-summary">
        <article class="attendance-count-box card">
          <span class="summary-label">이번 달 출석</span>
          <strong>{{ checkedCount }}일</strong>
        </article>
        <article class="attendance-count-box card">
          <span class="summary-label">출석률</span>
          <strong class="income">{{ attendanceRate }}%</strong>
        </article>
      </section>

      <DashboardSection title="오늘의 기록">
        <div class="card recent-card">
          <div v-if="todayRecords.length" class="record-list">
            <RecordCard
              v-for="record in todayRecords"
              :key="record.id"
              :category-id="record.categoryId"
              :title="record.title"
              :category="record.category"
              :created-at="record.time"
              :amount="record.amount"
              :type="record.type"
            />
          </div>
          <p v-else class="empty-copy">아직 기록이 없어요!</p>
        </div>
      </DashboardSection>
    </div>

    <Modal
      :is-open="isDayRecordsModalOpen"
      size="lg"
      :max-width="980"
      show-close
      @close="closeDayRecordsModal"
    >
      <section class="day-records-modal">
        <h3 class="day-records-title">{{ selectedDateLabel }}</h3>

        <div v-if="selectedDateRecords.length" class="day-records-list">
          <RecordCard
            v-for="record in selectedDateRecords"
            :key="record.id"
            :category-id="record.categoryId"
            :title="record.memo || categoryNameById[record.categoryId] || '기타'"
            :category="categoryNameById[record.categoryId] || '기타'"
            :created-at="formatTime(record.createdAt)"
            :amount="formatRecordAmount(record)"
            :type="record.type"
          />
        </div>
        <p v-else class="empty-copy">이 날짜의 수입/지출 기록이 없습니다.</p>
      </section>
    </Modal>
  </LayoutWrapper>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import Calendar from '@/components/common/Calendar.vue'
import Modal from '@/components/common/Modal.vue'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import { ALL_CATEGORIES } from '@/constants/category'
import { readRecords } from '@/services/finance'
import { formatExactCurrency } from '@/utils/transaction'
import RecordCard from '@/components/common/RecordCard.vue'

const user = loadUser()
const initialNow = new Date()
const currentDate = ref(new Date())
const displayYear = ref(initialNow.getFullYear())
const displayMonth = ref(initialNow.getMonth() + 1)
const checkedDates = ref(loadCheckedDates(user?.id))
const records = ref([])
const isDayRecordsModalOpen = ref(false)
const selectedDateKey = ref('')
let clockTimer = null

const categoryNameById = ALL_CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.name
  return acc
}, {})
const todayRecords = computed(() =>
  records.value.filter((record) => record.date === todayDateKey.value).map((record) => ({
    ...record,
    title: record.memo || categoryNameById[record.categoryId] || '기타',
    category: categoryNameById[record.categoryId] || '기타',
    time: formatTime(record.createdAt),
    amount: formatRecordAmount(record),
  })),
)

const dashboardTitle = computed(() =>
  user?.name ? `${user.name}님의 용돈기입장 MoaMoa` : '용돈기입장 MoaMoa'
)

const checkedDateSet = computed(() => new Set(checkedDates.value))
const todayDateKey = computed(() =>
  buildDateKey(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    currentDate.value.getDate(),
  ),
)

const calendarDays = computed(() => {
  const totalDays = new Date(displayYear.value, displayMonth.value, 0).getDate()

  return Array.from({ length: totalDays }, (_, index) => {
    const date = index + 1
    const key = buildDateKey(displayYear.value, displayMonth.value, date)
    const dayRecords = recordsByDate.value.get(key) || []
    const dayMarks = [...new Set(dayRecords.map((record) => record.type))]

    return {
      date,
      checked: checkedDateSet.value.has(key),
      marks: dayMarks,
    }
  })
})

const todayInView = computed(() => {
  const isCurrentMonth =
    displayYear.value === currentDate.value.getFullYear() &&
    displayMonth.value === currentDate.value.getMonth() + 1

  return isCurrentMonth ? currentDate.value.getDate() : undefined
})

const checkedCount = computed(() => calendarDays.value.filter((day) => day.checked).length)

const attendanceRate = computed(() => {
  const totalDays = calendarDays.value.length || 1
  return Math.round((checkedCount.value / totalDays) * 100)
})

const todayChecked = computed(() => {
  return checkedDateSet.value.has(todayDateKey.value)
})

const streakCount = computed(() => {
  let streak = 0
  const cursor = new Date(currentDate.value)

  while (true) {
    const key = buildDateKey(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate())
    if (!checkedDateSet.value.has(key)) {
      break
    }

    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
})

const recordsByDate = computed(() => {
  const map = new Map()

  records.value.forEach((record) => {
    const key = record.date
    if (!key) return

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(record)
  })

  return map
})

const selectedDateRecords = computed(() => recordsByDate.value.get(selectedDateKey.value) || [])

const selectedDateLabel = computed(() =>
  selectedDateKey.value ? formatDateLabel(selectedDateKey.value) : '날짜',
)

onMounted(fetchRecords)
onMounted(() => {
  clockTimer = window.setInterval(() => {
    currentDate.value = new Date()
  }, 60 * 1000)
})

onBeforeUnmount(() => {
  if (clockTimer) {
    window.clearInterval(clockTimer)
  }
})

watch(
  checkedDates,
  (value) => {
    if (typeof window !== 'undefined' && user?.id) {
      window.localStorage.setItem(`moamoa-attendance-days:${user.id}`, JSON.stringify(value))
    }
  },
  { deep: true }
)

function moveMonth(step) {
  const next = new Date(displayYear.value, displayMonth.value - 1 + step, 1)
  displayYear.value = next.getFullYear()
  displayMonth.value = next.getMonth() + 1
}

function openDayRecordsModal(day) {
  selectedDateKey.value = buildDateKey(displayYear.value, displayMonth.value, day.date)
  isDayRecordsModalOpen.value = true
}

function closeDayRecordsModal() {
  isDayRecordsModalOpen.value = false
}

async function fetchRecords() {
  if (!user?.id) {
    records.value = []
    return
  }

  try {
    records.value = await readRecords({ userId: user.id })
  } catch (error) {
    console.error('❌ home records fetch error', error)
    records.value = []
  }
}

function loadUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.sessionStorage.getItem('moamoa-user')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadCheckedDates(userId) {
  if (typeof window === 'undefined' || !userId) {
    return []
  }

  const raw = window.localStorage.getItem(`moamoa-attendance-days:${userId}`)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildDateKey(year, month, date) {
  return `${year}-${pad(month)}-${pad(date)}`
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatDateLabel(key) {
  const [year, month, date] = key.split('-')
  return `${year}년 ${Number(month)}월 ${Number(date)}일`
}

function formatTime(value) {
  if (!value) return '00:00'
  return String(value).slice(11, 16) || '00:00'
}

function formatRecordAmount(record) {
  return formatExactCurrency(record.amount, record.type === 'income')
}
</script>

<style scoped>
.dashboard-page {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
  display: grid;
  gap: 20px;
}

.recent-card {
  padding: 8px 16px;
}

.record-list {
  display: grid;
}

.empty-copy {
  margin: 0;
}

.empty-copy {
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text-muted);
  text-align: center;
}

.empty-copy {
  padding: 28px 0;
}

.record-list {
  display: grid;
  gap: 12px;
}

.income {
  color: var(--income);
}

.expense {
  color: var(--expense);
}

.day-records-modal {
  display: grid;
  gap: 10px;
  width: min(84vw, 920px);
}

.day-records-title {
  margin: 0;
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-700);
}

.day-records-sub {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-13);
}

.day-records-list {
  display: grid;
  gap: 10px;
}

.day-records-list :deep(.record) {
  width: 100%;
  min-height: 72px;
  padding: 14px 16px;
}

.day-records-list :deep(.recordTitle) {
  font-size: var(--font-size-16);
}

.day-records-list :deep(.recordAmount) {
  font-size: var(--font-size-16);
}

@media (min-width: 768px) {
  .dashboard-page {
    padding: 20px 32px;
  }

  .day-records-modal {
    width: min(82vw, 920px);
  }

  .day-records-list {
    gap: 14px;
  }

  .day-records-list :deep(.record) {
    min-height: 84px;
    padding: 16px 22px;
  }

  .day-records-list :deep(.recordTitle) {
    font-size: var(--font-size-18);
  }

  .day-records-list :deep(.recordMeta) {
    font-size: var(--font-size-13);
  }

  .day-records-list :deep(.recordAmount) {
    font-size: var(--font-size-18);
  }
}

@media (max-width: 480px) {
  .day-records-modal {
    width: calc(100vw - 56px);
  }
}

@media (min-width: 1280px) {
  .dashboard-page {
    padding: 24px 48px;
  }
}
</style>
