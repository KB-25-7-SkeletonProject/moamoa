<template>
    <LayoutWrapper>
        <AppHeader title="이번 달 내역 💰" desc="설명" />
        <!-- desc는 날짜 동적으로 받아와서 넣어야 함 -->
        <div>홈 화면입니다</div>
        <FloatingButton />
    </LayoutWrapper>
</template>

<script setup>
import LayoutWrapper from '@/components/layout/LayoutWrapper.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import FloatingButton from '@/components/layout/FloatingButton.vue';
</script>