<template>
  <div class="summary">
    <span class="summaryLabel">{{ label }}</span>
    <span :class="['summaryAmount', type]">{{ amount }}</span>
  </div>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    label: String,
    amount: String,
    type: {
      type: String,
      validator: (value) => !value || ['income', 'expense', 'balance'].includes(value)
    }
  }
}
</script>

<style scoped>
.summary {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--shadow-card-sm);
}

.summaryLabel {
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.summaryAmount {
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-700);
}

.summaryAmount.income {
  color: var(--income);
}

.summaryAmount.expense {
  color: var(--expense);
}

.summaryAmount.balance {
  color: var(--text);
}
</style>
