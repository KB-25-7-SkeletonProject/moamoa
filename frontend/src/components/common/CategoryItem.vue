<template>
  <button
    type="button"
    :class="['item', selected ? 'itemSelected' : '']"
    @click="onClick"
    :aria-pressed="selected"
  >
    <span class="itemIcon">{{ icon }}</span>
    <span class="itemLabel">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'CategoryItem',
  props: {
    label: {
      type: String,
      required: true
    },
    icon: String,
    selected: Boolean,
    onClick: Function
  }
}
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-14);
  color: var(--text);
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.itemSelected {
  background: var(--surface-highlight);
  border-color: var(--primary);
}

.itemIcon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.itemLabel {
  flex: 1;
}
</style>
