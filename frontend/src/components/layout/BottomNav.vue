<template>
    <nav class="bottom-nav">
        <BottomNavItem icon="🏠" label="홈"/>
        <BottomNavItem icon="📊" label="통계"/>
        <BottomNavItem icon="➕" label="기록 추가"/>
        <BottomNavItem icon="📋" label="내역"/>
        <BottomNavItem icon="⚙️" label="설정"/>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BottomNavItem from './BottomNavItem.vue'

const route = useRoute()
</script>

<style scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    height: 60px;
    background: var(--white);
    border-top: 1px solid var(--border);

    display: flex;
    align-items: center;
}
</style>