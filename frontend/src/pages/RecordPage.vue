<template>
  <LayoutWrapper title="기록 추가" desc="새 수입과 지출을 빠르게 기록해보세요">
    <section class="page-body">
      <h2 class="page-title">기록 추가 화면</h2>
      <p class="page-copy">이 화면은 하단 네비게이션 이동 확인용 기본 페이지입니다.</p>
    </section>
  </LayoutWrapper>
</template>

<script setup>
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
</script>

<style scoped>
.page-body {
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 16px;
}

.page-title {
  margin: 0;
  font-size: var(--font-size-18);
}

.page-copy {
  margin: 8px 0 0;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .page-body {
    padding: 20px 32px;
  }
}

@media (min-width: 1280px) {
  .page-body {
    padding: 24px 48px;
  }
}
</style>
