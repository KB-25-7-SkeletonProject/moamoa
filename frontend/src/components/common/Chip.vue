<template>
  <div
    :class="['chip', active && 'active']"
    @click="$emit('click')"
  >
    {{ label }}
  </div>
</template>

<script setup>
defineProps({
  label: String,
  active: Boolean
})
</script>

<style scoped>
.chip {
  border: 2px solid var(--border);
  border-radius: 20px;
  display: inline-block;
  background: var(--white);
  color: var(--text);
  cursor: pointer;
  transition: 0.2s;
  padding: 6px 12px;
  font-size: var(--font-size-14);
}

/* hover */
.chip:hover {
  border-color: var(--primary);
}

/* active */
.active {
  border-color: var(--primary);
  background: var(--white);
  color: var(--primary);
}
</style>
