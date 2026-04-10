<template>
  <img :src="src" :alt="alt" class="icon" />
</template>

<script setup>
import { computed } from 'vue'
import { getCategoryIconById } from '@/constants/categoryIconMap'

const props = defineProps({
  categoryId: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: 'category icon',
  },
})

const src = computed(() => getCategoryIconById(String(props.categoryId || '')))
</script>

<style scoped>
.icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
}
</style>
