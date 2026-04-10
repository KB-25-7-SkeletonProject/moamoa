<template>
  <div class="record">
    <div class="recordIcon">
      <CategoryIcon
        v-if="categoryId"
        :category-id="categoryId"
        :alt="category || '카테고리 아이콘'"
      />
      <span v-else class="recordEmoji">{{ resolvedIcon }}</span>
    </div>
    <div class="recordInfo">
      <span class="recordTitle">{{ displayTitle }}</span>
      <span v-if="displayCategory" class="recordMeta">{{ displayCategory }}</span>
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

<script setup>
import { computed } from 'vue'
import CategoryIcon from '@/components/common/CategoryIcon.vue'

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
  주거: '🏠',
}

defineOptions({
  name: 'RecordCard',
})

const props = defineProps({
  categoryId: String,
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
    validator: (value) => !value || ['income', 'expense'].includes(value),
  },
  onEdit: Function,
})

const displayTitle = computed(() => props.title || props.memo || props.category)
const displayCategory = computed(() =>
  [props.category, props.createdAt].filter(Boolean).join(' · '),
)
const resolvedIcon = computed(() => props.icon || CATEGORY_ICON_MAP[props.category] || '📦')
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
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recordEmoji {
  font-size: 28px;
  line-height: 1;
  text-align: center;
}

.recordIcon :deep(.icon) {
  width: 100%;
  height: 100%;
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
  font-size: var(--font-size-12);
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
