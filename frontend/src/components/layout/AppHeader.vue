<template>
    <header class="header">
        <div class="text-group">
            <div class="title">{{ title }}</div>
            <div class="desc">{{ desc }}</div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    title: String,
    desc: String
})
</script>

<style scoped>
.header {
    background: var(--primary);
    padding: 16px;

    display: flex;
    align-items: center;

    position: sticky;
    top: 0;
    z-index: 999;
}

.text-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.title {
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-700);
    color: var(--text);
}

.desc {
    font-size: var(--font-size-12);
    color: var(--text-secondary);
}
</style>
