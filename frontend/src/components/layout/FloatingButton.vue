<template>
    <button class="floating" @click="handleClick">+</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
    router.push('/entry')
}
</script>

<style scoped>
.floating {
    position: fixed;
    bottom: 80px;
    right: 20px;

    width: 56px;
    height: 56px;

    border-radius: 50%;
    border: none;

    background: var(--primary);
    color: var(--text);
    font-size: var(--font-size-24);

    z-index: 1000; 
    cursor: pointer;
}
</style>
