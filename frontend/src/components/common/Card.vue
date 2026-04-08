<template>
  <div :class="['card', `pad_${padding}`]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    padding: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-sm);
}

.pad_sm {
  padding: 12px;
}

.pad_md {
  padding: 16px;
}

.pad_lg {
  padding: 24px;
}
</style>
