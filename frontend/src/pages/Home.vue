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

      <DashboardSection title="최근 출석 기록">
        <div class="card recent-card">
          <div v-if="recentCheckedDates.length" class="record-list">
            <div v-for="item in recentCheckedDates" :key="item.key" class="record-row">
              <div>
                <p class="record-title">{{ item.label }}</p>
                <p class="record-sub">로그인으로 자동 출석 처리되었습니다.</p>
              </div>
              <strong class="income">완료</strong>
            </div>
          </div>
          <p v-else class="empty-copy">아직 출석한 날짜가 없습니다.</p>
        </div>
      </DashboardSection>
    </div>
  </LayoutWrapper>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import Calendar from '@/components/common/Calendar.vue'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'

const user = loadUser()
const now = new Date()
const displayYear = ref(now.getFullYear())
const displayMonth = ref(now.getMonth() + 1)
const checkedDates = ref(loadCheckedDates(user?.id))

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

const recentCheckedDates = computed(() =>
  checkedDates.value
    .filter((key) => key.startsWith(`${displayYear.value}-${pad(displayMonth.value)}-`))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 5)
    .map((key) => ({
      key,
      label: formatDateLabel(key),
    }))
)

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

function formatDateLabel(key) {
  const [year, month, date] = key.split('-')
  return `${year}년 ${Number(month)}월 ${Number(date)}일`
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

.record-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.record-row:last-child {
  border-bottom: 0;
}

.record-title,
.record-sub,
.empty-copy {
  margin: 0;
}

.record-title {
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.record-sub,
.empty-copy {
  margin-top: 4px;
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.empty-copy {
  padding: 20px 0;
}

.income {
  color: var(--income);
}

@media (min-width: 768px) {
  .dashboard-page {
    padding: 20px 32px;
  }
}

@media (min-width: 1280px) {
  .dashboard-page {
    padding: 24px 48px;
  }
}
</style>