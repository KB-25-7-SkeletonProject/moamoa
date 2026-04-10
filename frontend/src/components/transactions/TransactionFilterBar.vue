<template>
  <section class="filter-bar">
    <div class="search-wrap">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <Input
        v-model="localQuery"
        class-name="search-field"
        input-class="search-input"
        placeholder="메모, 카테고리, 시각 검색..."
      />
      <button
        v-if="localQuery"
        class="clear-button"
        type="button"
        aria-label="검색어 지우기"
        @click="clearQuery"
      >
        ✕
      </button>
    </div>

    <div class="filter-row">
      <CategoryChip
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :active="item.value === selectedType"
        :on-click="() => emit('update:selectedType', item.value)"
      />

      <div class="month-wrap">
        <Select
          :model-value="selectedMonth"
          :options="monthOptions"
          size="sm"
          @update:model-value="$emit('update:selectedMonth', $event)"
        />
      </div>

      <CategoryChip
        :label="categoryLabel"
        :active="isCategoryOpen || isCategoryActive"
        :on-click="() => emit('toggle-category')"
      />

      <CategoryChip
        :label="dateLabel"
        :active="dateLabel !== '날짜'"
        :on-click="() => emit('open-date')"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { CategoryChip, Input, Select } from '@/components/common'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  selectedType: {
    type: String,
    default: 'all',
  },
  typeOptions: {
    type: Array,
    default: () => [],
  },
  selectedMonth: {
    type: String,
    default: '',
  },
  monthOptions: {
    type: Array,
    default: () => [],
  },
  categoryLabel: {
    type: String,
    default: '카테고리',
  },
  isCategoryActive: Boolean,
  isCategoryOpen: Boolean,
  dateLabel: {
    type: String,
    default: '날짜',
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedType',
  'update:selectedMonth',
  'toggle-category',
  'open-date',
])

const localQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
})

function clearQuery() {
  emit('update:searchQuery', '')
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--surface-muted);
}

.search-icon {
  font-size: var(--font-size-15);
}

:deep(.search-field) {
  flex: 1;
}

:deep(.search-input) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 12px 0;
}

:deep(.search-input:focus) {
  border: none;
  box-shadow: none;
}

.clear-button {
  border: none;
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-12);
}

.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  align-items: center;
  flex-wrap: nowrap;
  padding-bottom: 2px;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

.month-wrap {
  flex-shrink: 0;
}

.month-wrap :deep(.select) {
  min-height: 36px;
  min-width: 76px;
  width: auto;
  padding: 8px 28px 8px 12px;
  border-radius: 20px;
  font-size: var(--font-size-12);
  border-width: 2px;
  white-space: nowrap;
}

.filter-row :deep(.chip) {
  min-height: 36px;
  font-size: var(--font-size-12);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
