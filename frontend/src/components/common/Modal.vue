<template>
  <transition name="modal" v-if="isOpen">
    <div
      class="backdrop"
      @click="$emit('close')"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="card"
        :style="{ maxWidth: resolvedMaxWidth + 'px' }"
        @click.stop
      >
        <button v-if="showClose" class="closeBtn" @click="$emit('close')" type="button">
          ✕
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

defineOptions({
  name: 'Modal'
})

const emit = defineEmits(['close'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  maxWidth: {
    type: Number,
    default: 360
  },
  showClose: {
    type: Boolean,
    default: false
  }
})

const resolvedMaxWidth = computed(() => {
  if (props.maxWidth !== 360) {
    return props.maxWidth
  }
  if (props.size === 'sm') return 260
  if (props.size === 'lg') return 400
  return 320
})

function syncBodyScroll(isOpen) {
  document.body.style.overflow = isOpen ? 'hidden' : ''
}

watch(() => props.isOpen, (newVal) => {
  syncBodyScroll(newVal)
})

function handleKeyDown(event) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  syncBodyScroll(props.isOpen)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  syncBodyScroll(false)
})
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.card {
  position: relative;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card-md);
  max-height: 80vh;
  overflow-y: auto;
}

.closeBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: var(--font-size-16);
  cursor: pointer;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .card,
.modal-leave-active .card {
  transition: transform 0.3s ease;
}

.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.9);
}
</style>
