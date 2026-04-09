<template>
  <div :class="['chip', isAdd ? 'chipAdd' : '']" @click="onClick" :role="onClick ? 'button' : undefined">
    <span>{{ label }}</span>
    <button
      v-if="!isAdd && onRemove"
      class="chipRemove"
      @click.stop="onRemove"
      :aria-label="`${label} 삭제`"
      type="button"
    >
      ×
    </button>
  </div>
</template>

<script setup>
defineOptions({
  name: 'CategoryChip'
})

defineProps({
  label: {
    type: String,
    required: true
  },
  onRemove: Function,
  isAdd: Boolean,
  onClick: Function
})
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-muted);
  border-radius: var(--radius-xl);
  color: var(--text);
  cursor: pointer;
  border: none;
  padding: 8px 12px;
  font-size: var(--font-size-14);
}

.chipAdd {
  background: var(--primary);
  color: var(--text);
}

.chipRemove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-16);
  color: var(--text-muted);
  padding: 0;
  margin-left: 4px;
}
</style>
