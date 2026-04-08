<template>
  <button :class="buttonClasses" v-bind="$attrs" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: function (value) {
        return ['primary', 'toggle', 'back', 'icon'].indexOf(value) !== -1;
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      validator: function (value) {
        return !value || ['expense', 'income'].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    buttonClasses() {
      return [
        'base',
        this.variant,
        this.variant === 'toggle' && this.active ? 'toggleActive' : '',
        this.variant === 'toggle' && this.active && this.activeColor ? this.activeColor : ''
      ].filter(Boolean).join(' ');
    }
  }
}
</script>

<style scoped>
/* ============================================================
   Button.module.css
   Figma 수치 그대로 반영
   ============================================================ */

/* ── 공통 기반 ── */
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
}

/* ── variant: primary ── */
/* Figma: bg #FFCC00 / h-56 / radius-12 / font-700 / size-17 */
.primary {
  width: 100%;
  height: 52px;                         /* mobile 기본 */
  background: var(--primary);
  color: var(--text);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
  border-radius: var(--radius-lg);
}
.primary:hover { opacity: 0.88; }
.primary:active { opacity: 0.8; transform: scale(0.99); }

/* tablet+ */
@media (min-width: 768px) {
  .primary {
    height: 54px;
    font-size: var(--font-size-17);
  }
}
@media (min-width: 1280px) {
  .primary {
    height: 56px;
  }
}

/* ── variant: toggle ── */
/* Figma: bg transparent / h-40~42 / radius-10 / font-500 / size-14 / color #aaa */
.toggle {
  flex: 1;
  height: 40px;
  background: transparent;
  color: var(--text-muted);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  border-radius: var(--radius-md);
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

/* ── variant: back ── */
/* Figma: 32×32 / bg none / font-size-20 */
.back {
  width: 32px;
  height: 32px;
  background: transparent;
  color: var(--text);
  font-size: 20px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.back:hover { background: var(--surface-muted); }

/* ── variant: icon ── */
/* Figma: 36×36 / 원형 / bg #F7F7F7 */
.icon {
  width: 36px;
  height: 36px;
  background: var(--surface-muted);
  border-radius: var(--radius-full);
  font-size: 16px;
  color: var(--text);
  flex-shrink: 0;
}
.icon:hover { background: var(--border); }
</style>
