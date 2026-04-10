<template>
  <section class="transaction-category-filter">
    <div class="header-row">
      <strong class="section-title">카테고리 선택</strong>
      <Chip label="초기화" @click="$emit('reset')" />
    </div>

    <div class="type-row">
      <span class="type-label">수입</span>
      <div class="item-group">
        <Chip
          v-for="item in incomeItems"
          :key="item.id"
          :active="selectedCategoryIds.includes(item.id)"
          @click="$emit('toggle', item.id)"
        >
          <span class="chip-content">
            <CategoryIcon :category-id="item.id" :alt="item.name" />
            <span>{{ item.name }}</span>
          </span>
        </Chip>
      </div>
    </div>

    <div class="type-row">
      <span class="type-label">지출</span>
      <div class="item-group">
        <Chip
          v-for="item in expenseItems"
          :key="item.id"
          :active="selectedCategoryIds.includes(item.id)"
          @click="$emit('toggle', item.id)"
        >
          <span class="chip-content">
            <CategoryIcon :category-id="item.id" :alt="item.name" />
            <span>{{ item.name }}</span>
          </span>
        </Chip>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { CategoryIcon, Chip } from '@/components/common'

const props = defineProps({
  incomeCategories: {
    type: Array,
    default: () => [],
  },
  expenseCategories: {
    type: Array,
    default: () => [],
  },
  selectedCategoryIds: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['toggle', 'reset'])

const incomeItems = computed(() => props.incomeCategories)
const expenseItems = computed(() => props.expenseCategories)
</script>

<style scoped>
.transaction-category-filter {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title {
  font-size: var(--font-size-13);
  color: var(--text);
}

.type-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-label {
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-700);
  color: var(--text-muted);
}

.item-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.item-group :deep(.chip) {
  flex-shrink: 0;
  font-size: var(--font-size-12);
  max-width: 100%;
}

.chip-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.chip-content :deep(.icon) {
  width: 16px;
  height: 16px;
}
</style>
