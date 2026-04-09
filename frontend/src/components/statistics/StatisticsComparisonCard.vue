<template>
  <Card class="stats-card">
    <h2 class="section-title">{{ title }}</h2>
    <div v-for="item in items" :key="item.label" class="comparison-row">
      <span class="comp-label">{{ item.label }}</span>
      <div class="comp-values">
        <span class="comp-val prev">{{ item.previous }}</span>
        <span class="comp-arrow">→</span>
        <span class="comp-val" :class="item.state">
          {{ item.current }} {{ item.changeLabel }}
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from '@/components/common/Card.vue'

defineProps({
  title: {
    type: String,
    default: '전월 비교',
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.stats-card {
  height: 100%;
}

.section-title {
  margin: 0 0 12px;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--bg);
}

.comparison-row:last-child {
  border-bottom: none;
}

.comp-label {
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.comp-values {
  display: flex;
  gap: 10px;
  align-items: center;
}

.comp-val {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-500);
  color: var(--text);
}

.comp-val.prev {
  color: var(--text-subtle);
}

.comp-val.better {
  color: var(--income);
}

.comp-val.worse {
  color: var(--expense);
}

.comp-val.same {
  color: var(--text);
}

.comp-arrow {
  font-size: var(--font-size-12);
  color: var(--border-muted);
}

@media (min-width: 768px) {
  .comp-label,
  .comp-val {
    font-size: var(--font-size-14);
  }
}

@media (min-width: 1280px) {
  .section-title {
    font-size: var(--font-size-16);
  }

  .comp-label,
  .comp-val {
    font-size: var(--font-size-15);
  }
}
</style>
