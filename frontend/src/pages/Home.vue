<template>
  <LayoutWrapper
    :title="dashboardTitle"
    desc="로그인한 날짜에만 자동으로 출석 체크가 반영됩니다"
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

      <DashboardSection title="출석 체크">
        <Calendar
          :year="displayYear"
          :month="displayMonth"
          :days="calendarDays"
          :today="todayInView"
          :interactive="false"
          @prev="moveMonth(-1)"
          @next="moveMonth(1)"
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
  </LayoutWrapper>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import Calendar from '@/components/common/Calendar.vue'
import RecordCard from '@/components/common/RecordCard.vue'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import { fetchTransactionGroups } from '@/services/transactions'
import { flattenTransactionGroups } from '@/utils/transaction'

const user = loadUser()
const now = new Date()
const todayDateKey = buildDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
const displayYear = ref(now.getFullYear())
const displayMonth = ref(now.getMonth() + 1)
const checkedDates = ref(loadCheckedDates(user?.id))
const todayRecords = ref([])

const dashboardTitle = computed(() =>
  user?.name ? `${user.name}님의 출석 대시보드` : '출석 대시보드'
)

const checkedDateSet = computed(() => new Set(checkedDates.value))

const calendarDays = computed(() => {
  const totalDays = new Date(displayYear.value, displayMonth.value, 0).getDate()

  return Array.from({ length: totalDays }, (_, index) => {
    const date = index + 1
    const key = buildDateKey(displayYear.value, displayMonth.value, date)

    return {
      date,
      checked: checkedDateSet.value.has(key),
    }
  })
})

const todayInView = computed(() => {
  const isCurrentMonth =
    displayYear.value === now.getFullYear() && displayMonth.value === now.getMonth() + 1

  return isCurrentMonth ? now.getDate() : undefined
})

const checkedCount = computed(() => calendarDays.value.filter((day) => day.checked).length)

const attendanceRate = computed(() => {
  const totalDays = calendarDays.value.length || 1
  return Math.round((checkedCount.value / totalDays) * 100)
})

const todayChecked = computed(() => {
  const todayKey = buildDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
  return checkedDateSet.value.has(todayKey)
})

const streakCount = computed(() => {
  let streak = 0
  const cursor = new Date(now)

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

watch(
  checkedDates,
  (value) => {
    if (typeof window !== 'undefined' && user?.id) {
      window.localStorage.setItem(`moamoa-attendance-days:${user.id}`, JSON.stringify(value))
    }
  },
  { deep: true }
)

onMounted(async () => {
  if (!user?.id) {
    recentRecords.value = []
    return
  }

  try {
    const groups = await fetchTransactionGroups({ userId: user.id })
    todayRecords.value = flattenTransactionGroups(groups).filter(
      (record) => record.dateKey === todayDateKey,
    )
  } catch (error) {
    todayRecords.value = []
    console.error('오늘 기록을 불러오지 못했습니다.', error)
  }
})

function moveMonth(step) {
  const next = new Date(displayYear.value, displayMonth.value - 1 + step, 1)
  displayYear.value = next.getFullYear()
  displayMonth.value = next.getMonth() + 1
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
</style>
