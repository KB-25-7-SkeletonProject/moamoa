<template>
  <div :class="['card', `pad_${padding}`, variant !== 'default' ? `variant_${variant}` : '']">
    <template v-if="hasContentSlots">
      <slot></slot>
    </template>
    <template v-else>
      <h3 v-if="title" class="title">{{ title }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    description: String,
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'income', 'expense'].includes(value)
    },
    padding: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    hasContentSlots() {
      return Boolean(this.$slots.default);
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-card-md);
  transform: translateY(-1px);
}

.variant_income {
  background: var(--surface-income-card);
}

.variant_expense {
  background: var(--surface-expense-card);
}

.title {
  margin: 0 0 8px;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.description {
  margin: 0;
  font-size: var(--font-size-14);
  line-height: 1.5;
  color: var(--text-muted);
}

.pad_sm {
  padding: 12px;
}

.pad_md {
  padding: 16px;
}

.pad_lg {
  padding: 20px;
}
</style>
