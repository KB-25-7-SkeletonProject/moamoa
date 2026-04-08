<template>
  <div :class="['group', className]">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :class="['input', resolvedInputClass, error ? 'inputError' : '']"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="errorMsg">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'Input',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: String,
    error: String,
    className: String,
    inputClass: String,
    size: {
      type: String,
      default: '',
      validator: (value) => !value || ['sm', 'md', 'lg'].includes(value)
    },
    id: String,
    placeholder: String
  },
  computed: {
    inputId() {
      return this.id || (this.label ? this.label.replace(/\s+/g, '-').toLowerCase() : undefined);
    },
    resolvedInputClass() {
      if (this.inputClass) return this.inputClass;
      if (this.size) return `size_${this.size}`;
      return '';
    }
  }
}
</script>

<style scoped>
.group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--text);
}

.input {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--text);
  width: 100%;
  padding: 12px 16px;
  font-size: var(--font-size-16);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
}

.inputError {
  border-color: var(--expense);
  background: var(--surface-expense-softest);
}

.inputError:focus {
  border-color: var(--expense);
  box-shadow: var(--shadow-focus-error);
}

.input::placeholder {
  color: var(--text-muted);
}

.errorMsg {
  font-size: var(--font-size-12);
  color: var(--expense);
  line-height: 1.4;
}

.size_sm {
  padding: 10px 12px;
  font-size: var(--font-size-14);
}

.size_md {
  padding: 12px 16px;
  font-size: var(--font-size-16);
}

.size_lg {
  padding: 14px 18px;
  font-size: var(--font-size-16);
}
</style>
