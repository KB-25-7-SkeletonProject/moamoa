<template>
  <Card class="stats-card">
    <h2 class="section-title">{{ title }}</h2>
    <div v-for="item in items" :key="item.label" class="comparison-row">
      <span class="comp-label">{{ item.label }}</span>
      <div class="comp-values">
        <span class="comp-val prev">{{ item.previous }}</span>
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
  grid-template-columns: 88px minmax(0, 1fr);
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
  text-align: left;
  min-width: 0;
}

.comp-values {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  align-items: center;
  column-gap: 8px;
  width: 100%;
  min-width: 0;
}

.comp-val {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-500);
  color: var(--text);
}

.comp-current-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
  text-align: right;
  justify-self: end;
  width: max-content;
  max-width: 100%;
}

.comp-current-group .comp-val {
  white-space: nowrap;
}

.comp-current-group.better .comp-val {
  color: var(--stats-comparison-better);
}

.comp-current-group.worse .comp-val {
  color: var(--stats-comparison-worse);
}

.comp-current-group.same .comp-val {
  color: var(--stats-comparison-same);
}

.comp-val.current {
  font-weight: var(--font-weight-700);
}

.comp-val.change {
  text-align: right;
}

.comp-val.prev {
  color: var(--text-subtle);
  text-align: left;
  min-width: 0;
}

@media (max-width: 420px) {
  .comparison-row {
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: flex-start;
  }

  .comp-values {
    grid-template-columns: 76px minmax(0, 1fr);
  }
}

@media (max-width: 1279px) {
  .comparison-row {
    align-items: flex-start;
  }
}

@media (min-width: 768px) {
  .comparison-row {
    grid-template-columns: 96px minmax(0, 1fr);
  }

  .comp-values {
    grid-template-columns: 128px minmax(0, 1fr);
  }

  .comp-current-group {
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .comp-label,
  .comp-val {
    font-size: var(--font-size-14);
  }
}

@media (min-width: 1280px) {
  .comparison-row {
    grid-template-columns: 104px minmax(0, 1fr);
  }

  .section-title {
    font-size: var(--font-size-16);
  }

  .comp-values {
    grid-template-columns: 136px minmax(0, 1fr);
  }

  .comp-label,
  .comp-val {
    font-size: var(--font-size-15);
  }
}
</style>
