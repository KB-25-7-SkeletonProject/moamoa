<template>
  <button
    type="button"
    :class="['item', selected ? 'itemSelected' : '']"
    @click="handleClick"
    :aria-pressed="selected"
  >
    <span class="itemIconWrap">
      <span class="itemIcon">{{ icon }}</span>
    </span>
    <span class="itemLabel">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'CategoryItem',
  emits: ['click'],
  props: {
    label: {
      type: String,
      required: true
    },
    icon: String,
    selected: Boolean,
    onClick: Function
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
      if (this.onClick) {
        this.onClick(event);
      }
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-14);
  color: var(--text);
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.item:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-card-sm);
}

.itemSelected {
  background: var(--surface-highlight);
  border-color: var(--primary);
}

.itemIconWrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.itemSelected .itemIconWrap {
  background: var(--surface-primary-soft);
}

.itemIcon {
  font-size: var(--font-size-18);
  line-height: 1;
  text-align: center;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
}

.itemLabel {
  flex: 1;
}
</style>
