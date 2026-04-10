<template>
  <section class="sort-bar">
    <p class="count-text">
      <strong>{{ count }}</strong
      ><span>건</span>
    </p>
    <div class="sort-options">
      <Chip
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :active="option.value === selectedSort"
        @click="$emit('update:selectedSort', option.value)"
      />
    </div>
  </section>
</template>

<script setup>
import { Chip } from '@/components/common'

defineProps({
  count: {
    type: Number,
    default: 0,
  },
  selectedSort: {
    type: String,
    default: 'latest',
  },
  options: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update:selectedSort'])
</script>

<style scoped>
.sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0;
}

.count-text {
  margin: 0;
  font-size: var(--font-size-12);
  color: var(--text-muted);
  white-space: nowrap;
}

.count-text strong {
  color: var(--text);
  margin-right: 2px;
}

.sort-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.sort-options::-webkit-scrollbar {
  display: none;
}
</style>
