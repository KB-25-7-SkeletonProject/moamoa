<template>
  <div class="ad" :role="onClick ? 'button' : undefined" @click="onClick">
    <div>
      <p class="adTitle">{{ title }}</p>
      <p class="adSub">{{ subtitle }}</p>
    </div>
    <span class="adIcon">{{ icon }}</span>
  </div>
</template>

<script>
export default {
  name: 'AdBanner',
  props: {
    title: String,
    subtitle: String,
    icon: String,
    onClick: Function
  }
}
</script>

<style scoped>
.ad {
  background: linear-gradient(135deg, #ffcc00, #ff9f1a);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--white);
  cursor: pointer;
}

.adTitle {
  margin: 0;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
}

.adSub {
  margin: 4px 0 0;
  font-size: var(--font-size-12);
  opacity: 0.9;
}

.adIcon {
  font-size: 24px;
}
</style>
