<template>
  <Card class="stats-card">
    <h2 class="section-title">월별 지출 추이</h2>
    <div
      v-for="item in items"
      :key="item.label"
      class="bar-row"
    >
      <span class="bar-label" :class="{ active: item.active }">{{ item.label }}</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: `${item.width}%`, background: item.color }" />
      </div>
      <span class="bar-amount" :class="{ active: item.active }">{{ item.amount }}</span>
    </div>
  </Card>
</template>

<script setup>
import Card from '@/components/common/Card.vue'

defineProps({
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

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.bar-row:last-child {
  margin-bottom: 0;
}

.bar-label {
  width: 40px;
  flex-shrink: 0;
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.bar-label.active {
  color: var(--primary);
  font-weight: var(--font-weight-700);
}

.bar-track {
  flex: 1;
  height: 18px;
  background: var(--bg);
  border-radius: 9px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 9px;
}

.bar-amount {
  width: 52px;
  flex-shrink: 0;
  text-align: right;
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-500);
  color: var(--text-muted);
}

.bar-amount.active {
  color: var(--text);
  font-weight: var(--font-weight-700);
}

@media (min-width: 768px) {
  .bar-label {
    width: 44px;
    font-size: var(--font-size-12);
  }

  .bar-amount {
    width: 56px;
    font-size: var(--font-size-12);
  }
}

@media (min-width: 1280px) {
  .section-title {
    font-size: var(--font-size-16);
  }

  .bar-row {
    margin-bottom: 12px;
  }

  .bar-track {
    height: 20px;
  }

  .bar-label {
    width: 48px;
    font-size: var(--font-size-13);
  }

  .bar-amount {
    width: 60px;
    font-size: var(--font-size-13);
  }
}
</style>
