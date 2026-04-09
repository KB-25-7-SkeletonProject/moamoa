<template>
  <section class="stats-section">
    <div class="section-copy">
      <h2 class="section-heading">{{ section.heading }}</h2>
      <p v-if="section.description" class="section-description">{{ section.description }}</p>
    </div>

    <div class="stats-grid">
      <StatisticsPieCard
        :title="pieTitle"
        :center-label="section.summaryLabel"
        :total-amount="section.pie.totalAmount"
        :items="section.pie.items"
      />
      <StatisticsBarCard
        :title="`${sectionName} 월별 추이`"
        :items="section.bars"
      />
      <StatisticsComparisonCard
        :title="`${sectionName} 전월 비교`"
        :items="section.comparison"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatisticsBarCard from '@/components/statistics/StatisticsBarCard.vue'
import StatisticsComparisonCard from '@/components/statistics/StatisticsComparisonCard.vue'
import StatisticsPieCard from '@/components/statistics/StatisticsPieCard.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const sectionName = computed(() => props.section.heading.replace(' 통계', ''))
const pieTitle = computed(() => `이달의 ${sectionName.value} 카테고리 비율`)
</script>

<style scoped>
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-heading {
  margin: 0;
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.section-description {
  margin: 0;
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (min-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .section-heading {
    font-size: var(--font-size-20);
  }

  .section-description {
    font-size: var(--font-size-14);
  }
}
</style>
