<template>
  <select
    :class="['select', size]"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: Array,
  size: { default: 'md' }
})
</script>

<style scoped>
.select {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--text);
  font-family: var(--font-family);
  outline: none;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* size */
.sm {
  min-height: 36px;
  padding: 8px 12px;
  font-size: var(--font-size-14);
}

.md {
  min-height: 44px;
  padding: 12px 16px;
  font-size: var(--font-size-16);
}

.lg {
  min-height: 52px;
  padding: 14px 18px;
  font-size: var(--font-size-16);
}

/* focus */
.select:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
}
</style>
