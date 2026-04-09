<template>
  <div :class="['divider', hasText && 'dividerWithText']">
    <div class="line"></div>
    <span v-if="hasText" class="text">
      <slot />
    </span>
    <div v-if="hasText" class="line"></div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots()
const hasText = computed(() => Boolean(slots.default))
</script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
}

.line {
  width: 100%;
  height: 1px;
  background: var(--border);
}

.dividerWithText {
  gap: 8px;
  margin: 12px 0;
}

.dividerWithText .line {
  flex: 1;
}

.text {
  font-size: var(--font-size-12);
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
