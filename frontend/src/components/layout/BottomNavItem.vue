<template>
    <div class="item" :class="{ active }" @click="handleClick">
        <div class="icon">{{ icon }}</div>
        <div class="label">{{ label }}</div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    icon: String,
    label: String,
    active: Boolean,
    path: String
})

const router = useRouter()

const handleClick = () => {
    if (props.path) {
        router.push(props.path)
    }
}
</script>

<style scoped>
.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex: 1;
    cursor: pointer;
}

/* 아이콘 */
.icon {
    font-size: var(--font-size-22);
    color: var(--color);
}

/* 텍스트 */
.label {
    font-size: var(--font-size-12);
    color: var(--color);
}

/* 활성 상태 */
.item {
    --color: var(--text-disabled);
}

.item.active {
    --color: var(--primary);
}
</style>
