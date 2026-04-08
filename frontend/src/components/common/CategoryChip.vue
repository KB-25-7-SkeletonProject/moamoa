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

<script>
export default {
  name: 'CategoryChip',
  props: {
    label: {
      type: String,
      required: true
    },
    onRemove: Function,
    isAdd: Boolean,
    onClick: Function
  }
}
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--surface-muted);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-14);
  color: var(--text);
  cursor: pointer;
  border: none;
}

.chipAdd {
  background: var(--primary);
  color: var(--text);
}

.chipRemove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-muted);
  padding: 0;
  margin-left: 4px;
}
</style>
