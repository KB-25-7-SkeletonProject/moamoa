<template>
  <div class="record">
    <div class="recordIcon" :style="{ background: iconBg }">
      {{ icon }}
    </div>
    <div class="recordInfo">
      <span class="recordCategory">{{ category }}</span>
      <span v-if="memo" class="recordMemo">{{ memo }}</span>
    </div>
    <span :class="['recordAmount', type]">{{ amount }}</span>
    <button v-if="onEdit" class="editBtn" @click="onEdit" aria-label="수정" type="button">
      ✏️
    </button>
  </div>
</template>

<script>
export default {
  name: 'RecordCard',
  props: {
    iconBg: String,
    icon: String,
    category: String,
    memo: String,
    amount: String,
    type: {
      type: String,
      validator: (value) => !value || ['income', 'expense'].includes(value)
    },
    onEdit: Function
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
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.recordInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recordCategory {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
}

.recordMemo {
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.recordAmount {
  font-size: var(--font-size-14);
  font-weight: 600;
}

.recordAmount.income {
  color: var(--income);
}

.recordAmount.expense {
  color: var(--expense);
}

.editBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
</style>
