<template>
  <div class="month-selector">
    <button class="month-btn" type="button" aria-label="이전 달" @click="$emit('prev')">‹</button>
    <span class="month-label">{{ label }}</span>
    <button class="month-btn" type="button" aria-label="다음 달" @click="$emit('next')">›</button>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})

defineEmits(['prev', 'next'])
</script>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-btn {
  width: 28px;
  height: 28px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--white);
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-14);
  line-height: 1;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.month-btn:hover {
  border-color: var(--primary);
  background: var(--surface-highlight);
}

.month-label {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--text);
  min-width: 92px;
  text-align: center;
}
</style>
