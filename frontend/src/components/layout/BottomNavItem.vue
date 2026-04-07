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
    font-size: 22px;
    color: var(--color);
}

/* 텍스트 */
.label {
    font-size: 12px;
    color: var(--color);
}

/* 활성 상태 */
.item {
    --color: #999;
}

.item.active {
    --color: var(--primary);
}
</style>