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
          <p v-else class="empty-copy">아직 오늘의 기록이 없어요.</p>
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
              `frontend/public/ads` 폴더에 `banner-01.png`, `banner-02.png`, `banner-03.png` 파일을
              넣으면 5초 간격으로 자동 재생됩니다.
            </p>
          </div>
        </div>
      </DashboardSection>
    </div>
  </LayoutWrapper>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import Calendar from '@/components/common/Calendar.vue'
import RecordCard from '@/components/common/RecordCard.vue'
import DashboardSection from '@/components/dashboard/DashboardSection.vue'
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import { fetchTransactionGroups } from '@/services/transactions'
import { flattenTransactionGroups } from '@/utils/transaction'

const AD_ROTATION_MS = 5000
const AD_BANNERS = [
  {
    src: '/ads/banner-01.png',
    title: 'KB국민은행 MoaMoa 출시',
    copy: 'MoaMoa는 KB국민은행과 함께합니다.',
  },
  {
    src: '/ads/banner-02.png',
    title: 'KB Its your life',
    copy: '지금 바로 도전하세요',
  },
  {
    src: '/ads/banner-03.png',
    title: 'KB Its your life 선발과정 선공개',
    copy: '자세한 내용은 배너를 클릭해주세요',
  },
]

const user = loadUser()
const now = new Date()
const todayDateKey = buildDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate())
const displayYear = ref(now.getFullYear())
const displayMonth = ref(now.getMonth() + 1)
const checkedDates = ref(loadCheckedDates(user?.id))
const todayRecords = ref([])
const failedAdSources = ref([])
const currentAdIndex = ref(0)

let adRotationTimer = null

const dashboardTitle = computed(() => (user?.name ? `${user.name}님의 MoaMoa 홈` : 'MoaMoa 홈'))

const checkedDateSet = computed(() => new Set(checkedDates.value))

const availableAds = computed(() =>
  AD_BANNERS.filter((banner) => !failedAdSources.value.includes(banner.src)),
)

const activeAd = computed(() => {
  if (!availableAds.value.length) {
    return null
  }

  const safeIndex = currentAdIndex.value % availableAds.value.length
  return availableAds.value[safeIndex]
})

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
  { deep: true },
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
  startAdRotation()

  if (!user?.id) {
    todayRecords.value = []
    return
  }

  try {
    const groups = await fetchTransactionGroups({ userId: user.id })
    todayRecords.value = flattenTransactionGroups(groups).filter(
      (record) => record.dateKey === todayDateKey,
    )
  } catch (error) {
    todayRecords.value = []
    console.error('오늘의 기록을 불러오지 못했습니다.', error)
  }
})

onBeforeUnmount(() => {
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
  gap: 12px;
}

.empty-copy {
  margin: 0;
  padding: 28px 0;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text-muted);
  text-align: center;
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
  background: linear-gradient(135deg, rgba(255, 225, 104, 0.18), rgba(24, 35, 58, 0.32)), #eef2f7;
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
  background: linear-gradient(135deg, rgba(255, 225, 104, 0.2), rgba(49, 71, 112, 0.12)), #f7f9fc;
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
</style>
