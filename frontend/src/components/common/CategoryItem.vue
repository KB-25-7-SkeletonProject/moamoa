<template>
  <button
    type="button"
    :class="['item', selected ? 'itemSelected' : '', borderless ? 'borderless' : '']"
    @click="handleClick"
    :aria-pressed="selected"
  >
    <span class="itemIconWrap">
      <span class="itemIcon">{{ icon }}</span>
    </span>
    <span class="itemLabel">{{ label }}</span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'CategoryItem'
})

const emit = defineEmits(['click'])

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: String,
  selected: Boolean,
  borderless: Boolean,
  onClick: Function
})

function handleClick(event) {
  emit('click', event)
  if (props.onClick) {
    props.onClick(event)
  }
}
</script>

<style scoped>
.item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 8px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-12);
  color: var(--text);
  cursor: pointer;
  width: 76px;
  min-width: 76px;
  min-height: 76px;
  text-align: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  font-family: var(--font-family);
}

.item:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-card-sm);
}

.itemSelected {
  background: var(--surface-highlight);
  border-color: var(--primary);
}

.item.borderless {
  border-color: transparent;
  box-shadow: none;
}

.item.borderless:hover {
  border-color: transparent;
  box-shadow: none;
}

.itemIconWrap {
  width: 34px;
  height: 34px;
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
  line-height: 1.2;
  word-break: keep-all;
}
</style>
