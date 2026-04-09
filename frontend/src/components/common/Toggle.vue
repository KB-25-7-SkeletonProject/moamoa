<template>
  <label :class="['wrap', disabled ? 'disabled' : '']">
    <span v-if="label" class="label">{{ label }}</span>
    <button
      role="switch"
      :aria-checked="checked"
      :disabled="disabled"
      :class="['track', checked ? 'on' : 'off']"
      type="button"
      @click="$emit('change', !checked)"
    >
      <span class="knob" />
    </button>
  </label>
</template>

<script setup>
defineOptions({
  name: 'Toggle'
})

defineEmits(['change'])

defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  label: String,
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.wrap.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.label {
  font-size: var(--font-size-14);
  color: var(--text);
}

.track {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.track.off {
  background: var(--border);
}

.track.on {
  background: var(--primary);
}

.track:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.knob {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--white);
  transition: transform 0.2s ease;
  box-shadow: var(--shadow-knob);
}

.track.on .knob {
  transform: translateX(20px);
}
</style>
