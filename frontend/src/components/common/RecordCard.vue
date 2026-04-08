<template>
  <div class="record">
    <div class="recordIcon" :style="recordIconStyle">
      <span class="recordEmoji">{{ resolvedIcon }}</span>
    </div>
    <div class="recordInfo">
      <span class="recordTitle">{{ resolvedTitle }}</span>
      <span v-if="metaText" class="recordMeta">{{ metaText }}</span>
    </div>
    <div class="recordAmountWrap">
      <span :class="['recordAmount', type]">{{ amount }}</span>
      <span v-if="balance" class="recordBalance">잔액 {{ balance }}</span>
    </div>
    <button v-if="onEdit" class="editBtn" @click="onEdit" aria-label="수정" type="button">
      ✏️
    </button>
  </div>
</template>

<script>
const CATEGORY_ICON_MAP = {
  급여: '💰',
  용돈: '🧧',
  부수입: '💵',
  이자소득: '💸',
  상여금: '🤑',
  '주식/배당': '📈',
  포인트: '🪙',
  기타: '📦',
  식비: '🍔',
  교통: '🚇',
  쇼핑: '🛍️',
  의료: '💊',
  교육: '📚',
  여가: '🎬',
  주거: '🏠'
}

export default {
  name: 'RecordCard',
  props: {
    iconBg: String,
    icon: String,
    title: String,
    category: String,
    memo: String,
    createdAt: String,
    amount: String,
    balance: String,
    type: {
      type: String,
      validator: (value) => !value || ['income', 'expense'].includes(value)
    },
    onEdit: Function
  },
  computed: {
    recordIconStyle() {
      return {
        background: this.iconBg || 'var(--surface-muted)'
      };
    },
    resolvedTitle() {
      return this.title || this.category;
    },
    metaText() {
      return [this.memo, this.createdAt].filter(Boolean).join(' · ');
    },
    resolvedIcon() {
      if (this.icon) return this.icon;
      return CATEGORY_ICON_MAP[this.category] || '📦';
    }
  }
}
</script>

<style scoped>
.record {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-card-sm);
}

.recordIcon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recordEmoji {
  font-size: var(--font-size-18);
  line-height: 1;
  text-align: center;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
}

.recordInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.recordTitle {
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.recordMeta {
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.recordAmountWrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.recordAmount {
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-700);
}

.recordAmount.income {
  color: var(--income);
}

.recordAmount.expense {
  color: var(--expense);
}

.recordBalance {
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.editBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-14);
  padding: 4px;
}
</style>
