<template>
  <LayoutWrapper
    :title="dashboardTitle"
    desc="오늘의 출석 현황과 기록, 광고 배너를 한눈에 확인해보세요"
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

      <DashboardSection title="이번 달 요약">
        <div v-if="hasMonthlyRecords" class="monthly-pie-grid">
          <StatisticsPieCard
            title="지출"
            center-label="총지출"
            :total-amount="monthlyExpensePie.totalAmount"
            :items="monthlyExpensePie.items"
            :show-total-amount="false"
          />
          <StatisticsPieCard
            title="수입"
            center-label="총수입"
            :total-amount="monthlyIncomePie.totalAmount"
            :items="monthlyIncomePie.items"
            :show-total-amount="false"
          />
        </div>
        <div v-else class="card recent-card">
          <p class="empty-copy">이번 달 기록이 없어요!</p>
        </div>
        <RouterLink class="stats-link" to="/statistics">자세히 보기</RouterLink>
      </DashboardSection>

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

      <DashboardSection title="추천 광고">
        <div class="ad-card card">
          <template v-if="activeAd">
            <div class="ad-frame">
              <img
                :src="activeAd.src"
                :alt="activeAd.title"
                class="ad-image"
                @error="handleAdError(activeAd.src)"
              />
              <div class="ad-overlay">
                <p class="ad-label">SPONSORED</p>
                <strong class="ad-title">{{ activeAd.title }}</strong>
                <p class="ad-copy">{{ activeAd.copy }}</p>
              </div>
            </div>

            <div v-if="availableAds.length > 1" class="ad-dots">
              <button
                v-for="(banner, index) in availableAds"
                :key="banner.src"
                type="button"
                :class="['ad-dot', index === currentAdIndex ? 'active' : '']"
                :aria-label="`${banner.title} 보기`"
                @click="currentAdIndex = index"
              />
            </div>
          </template>

          <div v-else class="ad-empty">
            <p class="ad-empty-title">광고 이미지를 준비해주세요</p>
            <p class="ad-empty-copy">
              `frontend/public/ads` 폴더에 `banner-01.png`, `banner-02.png`, `banner-03.png`
              파일을 넣으면 5초 간격으로 자동 재생됩니다.
            </p>
          </div>
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
import { RouterLink } from 'vue-router'

import Calendar from '@/components/common/Calendar.vue'
import Modal from '@/components/common/Modal.vue'
import RecordCard from '@/components/common/RecordCard.vue'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import StatisticsPieCard from '@/components/statistics/StatisticsPieCard.vue'
import { ALL_CATEGORIES } from '@/constants/category'
import { STATISTICS_PIE_COLOR_MAP } from '@/constants/statistics'
import { readRecords } from '@/services/finance'
import { formatCurrency, getMonthlyCategoryTotals } from '@/utils/financeFormatters'
import { formatExactCurrency } from '@/utils/transaction'

const AD_ROTATION_MS = 5000
const AD_BANNERS = [
  {
    src: '/ads/banner-01.png',
    title: 'KB 국민카드 x MoaMoa',
    copy: '첫 번째 광고 이미지를 이 영역에서 노출합니다.',
  },
  {
    src: '/ads/banner-02.png',
    title: 'Its your life',
    copy: '5초마다 다음 광고 이미지로 자동 전환됩니다.',
  },
  {
    src: '/ads/banner-03.png',
    title: '지금 확인해보세요',
    copy: '준비한 세 번째 배너도 같은 위치에서 반복 노출됩니다.',
  },
]

const user = loadUser()
const initialNow = new Date()
const currentDate = ref(new Date())
const displayYear = ref(initialNow.getFullYear())
const displayMonth = ref(initialNow.getMonth() + 1)
const checkedDates = ref(loadCheckedDates(user?.id))
const records = ref([])
const isDayRecordsModalOpen = ref(false)
const selectedDateKey = ref('')
const failedAdSources = ref([])
const currentAdIndex = ref(0)

let clockTimer = null
let adRotationTimer = null

const categoryNameById = ALL_CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.name
  return acc
}, {})

const dashboardTitle = computed(() =>
  user?.name ? `${user.name}님의 용돈기입장 MoaMoa` : '용돈기입장 MoaMoa'
)

const checkedDateSet = computed(() => new Set(checkedDates.value))

const todayDateKey = computed(() =>
  buildDateKey(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    currentDate.value.getDate()
  )
)

const recordsByDate = computed(() => {
  const map = new Map()

  records.value.forEach((record) => {
    const key = record.date
    if (!key) {
      return
    }

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(record)
  })

  return map
})

const todayRecords = computed(() =>
  (recordsByDate.value.get(todayDateKey.value) || []).map((record) => ({
    ...record,
    title: record.memo || categoryNameById[record.categoryId] || '기타',
    category: categoryNameById[record.categoryId] || '기타',
    time: formatTime(record.createdAt),
    amount: formatRecordAmount(record),
  }))
)

const availableAds = computed(() =>
  AD_BANNERS.filter((banner) => !failedAdSources.value.includes(banner.src))
)

const activeAd = computed(() => {
  if (!availableAds.value.length) {
    return null
  }

  return availableAds.value[currentAdIndex.value % availableAds.value.length]
})

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

const todayChecked = computed(() => checkedDateSet.value.has(todayDateKey.value))

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

const monthlyExpensePie = computed(() => {
  const totals = getMonthlyCategoryTotals(records.value, currentDate.value)
  const totalAmount = totals.reduce((sum, item) => sum + item.amount, 0)

  return {
    totalAmount: formatCompactAmount(totalAmount),
    items: totals.map((item) => ({
      label: categoryNameById[item.categoryId] || '기타',
      percent: totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0,
      color: STATISTICS_PIE_COLOR_MAP.expense[item.categoryId] || 'var(--stats-expense-other)',
    })),
  }
})

const monthlyIncomePie = computed(() => {
  const totals = getMonthlyCategoryTotalsByType(records.value, currentDate.value, 'income')
  const totalAmount = totals.reduce((sum, item) => sum + item.amount, 0)

  return {
    totalAmount: formatCompactAmount(totalAmount),
    items: totals.map((item) => ({
      label: categoryNameById[item.categoryId] || '기타',
      percent: totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0,
      color: STATISTICS_PIE_COLOR_MAP.income[item.categoryId] || 'var(--stats-income-other)',
    })),
  }
})

const hasMonthlyRecords = computed(
  () => monthlyExpensePie.value.items.length > 0 || monthlyIncomePie.value.items.length > 0
)

const selectedDateRecords = computed(() => recordsByDate.value.get(selectedDateKey.value) || [])

const selectedDateLabel = computed(() =>
  selectedDateKey.value ? formatDateLabel(selectedDateKey.value) : '날짜'
)

watch(
  checkedDates,
  (value) => {
    if (typeof window !== 'undefined' && user?.id) {
      window.localStorage.setItem(`moamoa-attendance-days:${user.id}`, JSON.stringify(value))
    }
  },
  { deep: true }
)

watch(availableAds, (value) => {
  if (!value.length) {
    stopAdRotation()
    currentAdIndex.value = 0
    return
  }

  if (currentAdIndex.value >= value.length) {
    currentAdIndex.value = 0
  }

  startAdRotation()
})

onMounted(async () => {
  await fetchRecords()
  startAdRotation()

  clockTimer = window.setInterval(() => {
    currentDate.value = new Date()
  }, 60 * 1000)
})

onBeforeUnmount(() => {
  if (clockTimer) {
    window.clearInterval(clockTimer)
  }

  stopAdRotation()
})

function startAdRotation() {
  stopAdRotation()

  if (availableAds.value.length <= 1) {
    return
  }

  adRotationTimer = window.setInterval(() => {
    currentAdIndex.value = (currentAdIndex.value + 1) % availableAds.value.length
  }, AD_ROTATION_MS)
}

function stopAdRotation() {
  if (adRotationTimer) {
    window.clearInterval(adRotationTimer)
    adRotationTimer = null
  }
}

function handleAdError(src) {
  if (failedAdSources.value.includes(src)) {
    return
  }

  failedAdSources.value = [...failedAdSources.value, src]
}

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
    console.error('홈 기록을 불러오지 못했습니다.', error)
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

function formatCompactAmount(value) {
  const amount = Number(value || 0)

  if (amount >= 10000) {
    const compact = Math.round(amount / 1000) / 10
    return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}만`
  }

  return formatCurrency(amount)
}

function getMonthlyCategoryTotalsByType(sourceRecords, baseDate, type) {
  const month = baseDate.getMonth()
  const year = baseDate.getFullYear()
  const totals = {}

  sourceRecords.forEach((record) => {
    const recordDate = new Date(record.date)
    const rawAmount =
      typeof record.amountValue === 'number' && Number.isFinite(record.amountValue)
        ? record.amountValue
        : record.amount
    const amount = Number(rawAmount || 0)

    if (
      record.type === type &&
      Number.isFinite(amount) &&
      !Number.isNaN(recordDate.getTime()) &&
      recordDate.getMonth() === month &&
      recordDate.getFullYear() === year
    ) {
      const categoryId = record.categoryId || record.category
      totals[categoryId] = (totals[categoryId] || 0) + amount
    }
  })

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([categoryId, amount]) => ({ categoryId, amount }))
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
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px 4px 4px 0;
}

.record-list::-webkit-scrollbar {
  width: 6px;
}

.record-list::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--radius-full);
}

.record-list::-webkit-scrollbar-track {
  background: transparent;
}

.empty-copy {
  margin: 0;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text-muted);
  text-align: center;
  padding: 28px 0;
}

.monthly-pie-grid {
  display: grid;
  gap: 16px;
}

.stats-link {
  display: inline-block;
  margin-top: 10px;
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-500);
  color: var(--text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ad-card {
  overflow: hidden;
  padding: 12px;
}

.ad-frame {
  position: relative;
  min-height: 88px;
  border-radius: 18px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255, 225, 104, 0.18), rgba(24, 35, 58, 0.32)),
    #eef2f7;
}

.ad-image {
  width: 100%;
  height: 108px;
  object-fit: contain;
  display: block;
}

.ad-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 18px;
  background: linear-gradient(180deg, transparent 0%, rgba(17, 25, 43, 0.82) 100%);
  color: #fff;
}

.ad-label,
.ad-title,
.ad-copy,
.ad-empty-title,
.ad-empty-copy {
  margin: 0;
}

.ad-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #ffe168;
}

.ad-title {
  display: block;
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: 800;
}

.ad-copy {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.5;
}

.ad-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.ad-dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: #d1d7e2;
  cursor: pointer;
}

.ad-dot.active {
  width: 28px;
  background: #ffcc00;
}

.ad-empty {
  min-height: 108px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(255, 225, 104, 0.2), rgba(49, 71, 112, 0.12)),
    #f7f9fc;
}

.ad-empty-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #18233a;
}

.ad-empty-copy {
  margin-top: 8px;
  color: var(--text-muted);
  line-height: 1.6;
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

  .monthly-pie-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
