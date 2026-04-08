<template>
  <section class="section">
    <h2 class="section-title">{{ title }}</h2>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: String,
})
</script>

<style scoped>
.section-title {
  margin: 0 0 12px;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

@media (min-width: 1280px) {
  .section-title {
    font-size: var(--font-size-16);
  }
}
</style>
