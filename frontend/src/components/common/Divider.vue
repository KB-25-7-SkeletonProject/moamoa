<template>
  <div class="divider">

    <!-- 왼쪽 선 -->
    <div class="line"></div>

    <!-- 텍스트 있을 때만 -->
    <span v-if="$slots.default" class="text">
      <slot />
    </span>

    <!-- 오른쪽 선 -->
    <div class="line"></div>

  </div>
</template>

<script setup></script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

/* 선 */
.line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* 텍스트 */
.text {
  font-size: var(--font-size-12);
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 텍스트 없을 때 */
.divider:not(:has(.text)) .line:last-child {
  display: none;
}
</style>
