<template>
    <header class="header">
        <div class="header-inner">
        <div class="text-group">
            <div class="title">{{ title }}</div>
            <div class="desc">{{ desc }}</div>
        </div>
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

    position: sticky;
    top: 0;
    z-index: 999;
}

.header-inner {
    width: min(100%, 1280px);
    margin: 0 auto;
    padding: 16px;
    min-height: 80px;

    display: flex;
    align-items: center;
}

.text-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.title {
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-700);
    color: var(--text);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.desc {
    font-size: var(--font-size-12);
    color: var(--text-secondary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (min-width: 768px) {
    .header-inner {
        padding: 16px 32px;
        min-height: 84px;
    }
}

@media (min-width: 1280px) {
    .header-inner {
        padding: 16px 48px;
        min-height: 88px;
    }
}
</style>
