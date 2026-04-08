<template>
  <div class="ad" :role="clickable ? 'button' : undefined" @click="handleClick">
    <div class="adContent">
      <p class="adTitle">{{ title }}</p>
      <p class="adSub">{{ subtitle }}</p>
    </div>
    <span class="adIcon" aria-hidden="true">{{ resolvedIcon }}</span>
  </div>
</template>

<script>
export default {
  name: 'AdBanner',
  emits: ['click'],
  props: {
    title: {
      type: String,
      default: '광고 영역'
    },
    subtitle: {
      type: String,
      default: '추천 혜택과 이벤트를 확인해보세요'
    },
    icon: {
      type: String,
      default: ''
    },
    onClick: Function
  },
  computed: {
    resolvedIcon() {
      return this.icon || '›';
    },
    clickable() {
      return Boolean(this.onClick || this.$attrs?.onClick);
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
      if (this.onClick) {
        this.onClick(event);
      }
    }
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
  gap: 16px;
  box-shadow: var(--shadow-card-sm);
}

.adContent {
  min-width: 0;
}

.adTitle {
  margin: 0;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
}

.adSub {
  margin: 4px 0 0;
  font-size: var(--font-size-13);
  opacity: 0.9;
}

.adIcon {
  font-size: 24px;
  font-weight: var(--font-weight-700);
  line-height: 1;
  flex-shrink: 0;
}
</style>
