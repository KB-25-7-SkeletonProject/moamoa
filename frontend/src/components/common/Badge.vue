<template>
  <span :class="['badge', type]">
    {{ label }}
  </span>
</template>

<script setup>
defineProps({
  label: String,
  type: { default: 'default' }
})
</script>

<style scoped>
.badge {
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 5px 10px;
  font-size: var(--font-size-13);
  color: var(--buddha-gold);
  background: var(--varden);
}

/* type */
.income {
  background: var(--surface-income-soft);
  color: var(--income);
}
.expense {
  background: var(--surface-expense-soft);
  color: var(--expense);
}
</style>
