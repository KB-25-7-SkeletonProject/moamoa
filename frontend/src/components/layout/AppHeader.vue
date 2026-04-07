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
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
}

.desc {
    font-size: 12px;
    color: var(--text-secondary);
}
</style>