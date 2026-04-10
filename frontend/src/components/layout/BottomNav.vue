<template>
    <nav class="bottom-nav">
        <div class="bottom-nav-inner">
            <BottomNavItem icon="🏠" label="홈" path="/home" :active="route.path === '/home'"/>
            <BottomNavItem icon="📊" label="통계" path="/statistics" :active="route.path === '/statistics'"/>
            <BottomNavItem icon="➕" label="기록 추가" path="/entry" :active="route.path === '/entry'"/>
            <BottomNavItem icon="📋" label="내역" path="/transaction" :active="route.path === '/transaction'"/>
            <BottomNavItem icon="⚙️" label="설정" path="/settings" :active="route.path === '/settings'"/>
        </div>
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

    background: var(--white);
    border-top: 1px solid var(--border);
    z-index: 999;
    box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.06);
}

.bottom-nav-inner {
    width: min(100%, 1280px);
    height: 60px;
    margin: 0 auto;
    padding: 0 8px;

    display: flex;
    align-items: center;
}

@media (min-width: 768px) {
    .bottom-nav-inner {
        padding: 0 24px;
    }
}

@media (min-width: 1280px) {
    .bottom-nav-inner {
        padding: 0 40px;
    }
}
</style>
