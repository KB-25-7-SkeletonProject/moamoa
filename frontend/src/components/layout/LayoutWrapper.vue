<template>
    <div class="layout">
        <AppHeader v-if="title || desc" :title="title" :desc="desc" />
        <main>
            <slot />
        </main>
        <BottomNav />
    </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'

defineProps({
    title: String,
    desc: String
})
</script>

<style scoped>
.layout {
    min-height: 100vh;
}

main {
    padding-bottom: 60px;
}
</style>
