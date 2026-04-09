<template>
  <LayoutWrapper title="통계" desc="월별 소비 흐름과 전월 비교를 확인해보세요">
    <div class="stats-body">
      <StatisticsMonthSelector
        :label="statistics.monthLabel"
        @prev="moveMonth(-1)"
        @next="moveMonth(1)"
      />

      <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
      <p v-else-if="isLoading" class="feedback">통계 데이터를 불러오는 중입니다.</p>

      <div v-else class="stats-sections">
        <StatisticsSection
          v-for="section in statistics.sections"
          :key="section.key"
          :section="section"
        />
      </div>
    </div>
  </LayoutWrapper>
</template>

<script setup>
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import StatisticsMonthSelector from '@/components/statistics/StatisticsMonthSelector.vue'
import StatisticsSection from '@/components/statistics/StatisticsSection.vue'
import { useStatisticsPage } from '@/composables/useStatisticsPage'

const { errorMessage, isLoading, moveMonth, statistics } = useStatisticsPage()
</script>

<style scoped>
.stats-body {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
}

.feedback {
  margin: 16px 0 0;
  color: var(--text-muted);
}

.feedback.error {
  color: var(--expense);
}

.stats-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 16px;
}

@media (min-width: 768px) {
  .stats-body {
    padding: 20px 32px;
  }

  .stats-sections {
    gap: 32px;
  }
}

@media (min-width: 1280px) {
  .stats-body {
    padding: 24px 48px;
  }
}
</style>
