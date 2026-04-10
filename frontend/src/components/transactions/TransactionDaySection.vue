<template>
  <section class="day-section">
    <header class="day-header">
      <h3 class="day-title">{{ formattedTitle }}</h3>
      <span :class="['day-total', totalType]">{{ total }}</span>
    </header>

    <Card class="day-list" padding="sm" :interactive="false">
      <template v-for="(record, index) in records" :key="record.id">
        <RecordCard
          :category-id="record.categoryId"
          :icon="record.icon"
          :title="record.title"
          :category="record.category"
          :created-at="record.time"
          :amount="record.amount"
          :balance="record.balance"
          :type="record.type"
        />
        <Divider v-if="index < records.length - 1" class="day-divider" />
      </template>
    </Card>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Card, Divider, RecordCard } from '@/components/common'

const props = defineProps({
  title: String,
  total: String,
  totalType: {
    type: String,
    default: 'balance'
  },
  records: {
    type: Array,
    default: () => []
  }
})

const formattedTitle = computed(() => {
  const raw = props.title || ''
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return raw

  const [, year, month, day] = match
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
})
</script>

<style scoped>
.day-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px 0;
}

.day-title {
  margin: 0;
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-700);
  color: var(--text-muted);
}

.day-total {
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.day-total.income {
  color: var(--income);
}

.day-total.expense {
  color: var(--expense);
}

.day-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  overflow: hidden;
}

.day-list :deep(.record) {
  box-shadow: none;
  border-radius: 0;
  padding-left: 16px;
  padding-right: 16px;
}

.day-list :deep(.divider) {
  padding: 0 16px;
}
</style>
