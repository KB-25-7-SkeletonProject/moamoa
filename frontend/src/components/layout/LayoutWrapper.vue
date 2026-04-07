<template>
    <div>
        <main>
            <slot />
        </main>
        <BottomNav />
    </div>
</template>

<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
</script>