<template>
  <div class="layout">
    <AppHeader
      v-if="title || desc"
      :title="title"
      :desc="desc"
      :show-back="showBack"
      :back-icon="backIcon"
      :action-icon="actionIcon"
      :action-label="actionLabel"
      @back="$emit('back')"
      @action="$emit('action')"
    />
    <main>
      <slot />
    </main>
    <FloatingButton />
    <BottomNav />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import FloatingButton from '@/components/layout/FloatingButton.vue'

defineEmits(['back', 'action'])

defineProps({
  title: String,
  desc: String,
  showBack: Boolean,
  backIcon: {
    type: String,
    default: '←',
  },
  actionIcon: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

main {
  padding-bottom: 80px;
}
</style>
