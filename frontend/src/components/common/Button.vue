<template>
  <button :class="buttonClasses" :disabled="disabled" v-bind="$attrs" @click="$emit('click', $event)">
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    label: String,
    variant: {
      type: String,
      default: 'primary',
      validator: function (value) {
        return ['primary', 'toggle', 'back', 'icon', 'outline', 'gray'].indexOf(value) !== -1;
      }
    },
    size: {
      type: String,
      default: 'md',
      validator: function (value) {
        return ['sm', 'md', 'lg'].indexOf(value) !== -1;
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: '',
      validator: function (value) {
        return !value || ['expense', 'income'].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    resolvedActiveColor() {
      if (this.activeColor) {
        return this.activeColor;
      }

      const slotText = this.$slots.default?.()[0]?.children;
      if (slotText === '지출') return 'expense';
      if (slotText === '수입') return 'income';
      return '';
    },
    buttonClasses() {
      return [
        'base',
        this.variant,
        `size_${this.size}`,
        this.variant === 'toggle' && this.active ? 'toggleActive' : '',
        this.variant === 'toggle' && this.active && this.resolvedActiveColor ? this.resolvedActiveColor : ''
      ].filter(Boolean).join(' ');
    }
  }
}
</script>

<style scoped>

.base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-family);
  font-weight: var(--font-weight-500);
  cursor: pointer;
  border: none;
  outline: none;
  transition: opacity 0.15s ease, background 0.15s ease;
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--radius-md);
}

/* ── size ── */
.size_sm {
  padding: 10px 12px;
  font-size: var(--font-size-14);
}

.size_md {
  padding: 12px 16px;
  font-size: var(--font-size-16);
}

.size_lg {
  padding: 14px 20px;
  font-size: var(--font-size-16);
}

/* ── variant: primary ── */
.primary {
  width: 100%;
  min-height: 52px;
  background: var(--primary);
  color: var(--text);
  font-weight: var(--font-weight-700);
  border-radius: var(--radius-lg);
}
.primary:hover { opacity: 0.88; }
.primary:active { opacity: 0.8; transform: scale(0.99); }

.primary.size_sm {
  min-height: 40px;
}

.primary.size_lg {
  min-height: 56px;
  font-size: var(--font-size-17);
}

.outline {
  background: var(--white);
  border: 1px solid var(--primary);
  color: var(--primary);
  font-weight: var(--font-weight-700);
  width: 100%;
  min-height: 52px;
  border-radius: var(--radius-lg);
}

.gray {
  background: var(--border);
  color: var(--text-muted);
  font-weight: var(--font-weight-700);
}

.outline.size_sm {
  min-height: 40px;
}

.outline.size_lg {
  min-height: 56px;
  font-size: var(--font-size-17);
}

/* ── variant: toggle ── */
.toggle {
  flex: 1;
  height: 40px;
  background: transparent;
  color: var(--text-muted);
  font-weight: var(--font-weight-500);
  border-radius: var(--radius-md);
  padding: 0 16px;
}
.toggleActive {
  background: var(--white);
  color: var(--text);
  box-shadow: var(--shadow-card-md);
}
/* 지출 활성 → 빨강 */
.expense { color: var(--expense) !important; }
/* 수입 활성 → 초록 */
.income  { color: var(--income) !important; }

.back {
  width: 32px;
  height: 32px;
  background: transparent;
  color: var(--text);
  font-size: var(--font-size-20);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.back:hover { background: var(--surface-muted); }

.icon {
  width: 36px;
  height: 36px;
  background: var(--surface-muted);
  border-radius: var(--radius-full);
  font-size: var(--font-size-16);
  color: var(--text);
  flex-shrink: 0;
}
.icon:hover { background: var(--border); }

.base:disabled {
  background: var(--border);
  color: var(--text-muted);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
