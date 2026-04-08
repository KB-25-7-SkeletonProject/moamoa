<template>
  <div :class="['group', className]">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :class="['input', error ? 'inputError' : '']"
      v-bind="$attrs"
      @input="$emit('input', $event)"
    />
    <span v-if="error" class="errorMsg">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    label: String,
    error: String,
    className: String,
    id: String
  },
  computed: {
    inputId() {
      return this.id || (this.label ? this.label.replace(/\s+/g, '-').toLowerCase() : undefined);
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
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-16);
  background: var(--white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.18);
}

.inputError {
  border-color: var(--expense);
}

.errorMsg {
  font-size: var(--font-size-12);
  color: var(--expense);
}
</style>
