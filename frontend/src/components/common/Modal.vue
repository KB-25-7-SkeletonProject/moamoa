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
        :style="{ maxWidth: maxWidth + 'px' }"
        @click.stop
      >
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: Number,
      default: 360
    }
  },
  watch: {
    isOpen(newVal) {
      // Lock/unlock scroll
      document.body.style.overflow = newVal ? 'hidden' : '';
    }
  },
  mounted() {
    this.handleKeyDown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.$emit('close');
      }
    };
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card-md);
  max-height: 80vh;
  overflow-y: auto;
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
