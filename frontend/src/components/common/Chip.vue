<template>
  <div
    :class="['chip', active && 'active']"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup>
defineEmits(['click'])

defineProps({
  label: String,
  active: Boolean
})
</script>

<style scoped>
.chip {
  border: 2px solid var(--border);
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  color: var(--text);
  font-family: var(--font-family);
  cursor: pointer;
  transition: 0.2s;
  padding: 6px 12px;
  font-size: var(--font-size-14);
  line-height: 1.2;
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
