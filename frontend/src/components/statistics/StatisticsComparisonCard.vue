<template>
  <Card class="stats-card">
    <h2 class="section-title">{{ title }}</h2>
    <div v-for="item in items" :key="item.label" class="comparison-row">
      <span class="comp-label">{{ item.label }}</span>
      <div class="comp-values">
        <span class="comp-val prev">{{ item.previous }}</span>
        <span class="comp-arrow">→</span>
        <span class="comp-current-group" :class="item.state">
          <span class="comp-val current">{{ item.current }}</span>
          <span v-if="item.changeLabel" class="comp-val change">{{ item.changeLabel }}</span>
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
  display: grid;
  grid-template-columns: minmax(64px, auto) max-content;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--bg);
}

.comparison-row:last-child {
  border-bottom: none;
}

.comp-label {
  font-size: var(--font-size-13);
  color: var(--text-muted);
  min-width: 0;
}

.comp-values {
  display: grid;
  grid-template-columns: minmax(88px, max-content) 16px max-content;
  align-items: center;
  gap: 8px;
}

.comp-val {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-500);
  color: var(--text);
}

.comp-current-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.comp-current-group .comp-val {
  white-space: nowrap;
}

.comp-current-group.better .comp-val {
  color: var(--income);
}

.comp-current-group.worse .comp-val {
  color: var(--expense);
}

.comp-current-group.same .comp-val {
  color: var(--text);
}

.comp-val.current {
  font-weight: var(--font-weight-700);
}

.comp-val.change {
  text-align: left;
}

.comp-val.prev {
  color: var(--text-subtle);
  text-align: left;
}

.comp-arrow {
  font-size: var(--font-size-12);
  color: var(--border-muted);
  text-align: center;
}

@media (max-width: 420px) {
  .comparison-row {
    grid-template-columns: minmax(56px, auto) minmax(0, 1fr);
    align-items: flex-start;
  }

  .comp-values {
    grid-template-columns: minmax(72px, auto) 16px minmax(0, 1fr);
  }
}

@media (max-width: 1279px) {
  .comparison-row {
    align-items: flex-start;
  }
}

@media (min-width: 768px) {
  .comp-values {
    grid-template-columns: minmax(104px, max-content) 18px max-content;
  }

  .comp-label,
  .comp-val {
    font-size: var(--font-size-14);
  }
}

@media (min-width: 1280px) {
  .comparison-row {
    grid-template-columns: minmax(72px, auto) max-content;
  }

  .comp-values {
    grid-template-columns: minmax(112px, max-content) 20px max-content;
  }

  .section-title {
    font-size: var(--font-size-16);
  }

  .comp-label,
  .comp-val {
    font-size: var(--font-size-15);
  }
}
</style>
