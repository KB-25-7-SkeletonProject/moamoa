<template>
  <Modal :is-open="isOpen" size="lg" show-close @close="$emit('close')">
    <section class="modal-section">
      <header class="modal-header">
        <h3 class="modal-title">날짜 필터</h3>
        <p class="modal-desc">특정 날짜 한 건 또는 기간을 지정해서 조회할 수 있어요.</p>
      </header>

      <div class="mode-row">
        <Chip
          v-for="option in modeOptions"
          :key="option.value"
          :label="option.label"
          :active="draftMode === option.value"
          @click="draftMode = option.value"
        />
      </div>

      <div v-if="draftMode === 'single'" class="field-group">
        <label class="field-label" for="single-date">날짜 선택</label>
        <input id="single-date" v-model="draftSingleDate" class="date-input" type="date" />
      </div>

      <div v-else class="range-grid">
        <div class="field-group">
          <label class="field-label" for="start-date">시작일</label>
          <input id="start-date" v-model="draftStartDate" class="date-input" type="date" />
        </div>
        <div class="field-group">
          <label class="field-label" for="end-date">종료일</label>
          <input id="end-date" v-model="draftEndDate" class="date-input" type="date" />
        </div>
      </div>

      <div class="modal-actions">
        <Button variant="gray" size="sm" label="초기화" @click="resetSelection" />
        <Button variant="primary" size="sm" label="적용하기" @click="applySelection" />
      </div>
    </section>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button, Chip, Modal } from '@/components/common'

const props = defineProps({
  isOpen: Boolean,
  dateFilter: {
    type: Object,
    default: () => ({
      mode: 'single',
      singleDate: '',
      startDate: '',
      endDate: ''
    })
  }
})

const emit = defineEmits(['close', 'apply'])

const modeOptions = [
  { label: '특정 날짜', value: 'single' },
  { label: '기간 설정', value: 'range' }
]

const draftMode = ref('single')
const draftSingleDate = ref('')
const draftStartDate = ref('')
const draftEndDate = ref('')

watch(
  () => [props.isOpen, props.dateFilter],
  () => {
    draftMode.value = props.dateFilter.mode || 'single'
    draftSingleDate.value = props.dateFilter.singleDate || ''
    draftStartDate.value = props.dateFilter.startDate || ''
    draftEndDate.value = props.dateFilter.endDate || ''
  },
  { immediate: true, deep: true }
)

function resetSelection() {
  draftMode.value = 'single'
  draftSingleDate.value = ''
  draftStartDate.value = ''
  draftEndDate.value = ''
}

function applySelection() {
  emit('apply', {
    mode: draftMode.value,
    singleDate: draftSingleDate.value,
    startDate: draftStartDate.value,
    endDate: draftEndDate.value
  })
}
</script>

<style scoped>
.modal-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-700);
}

.modal-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-13);
}

.mode-row {
  display: flex;
  gap: 8px;
}

.range-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: var(--font-size-13);
  color: var(--text-muted);
}

.date-input {
  width: 100%;
  min-height: 44px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  background: var(--white);
  color: var(--text);
}

.modal-actions {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 8px;
}

.modal-actions :deep(.gray) {
  min-height: 40px;
}

.modal-actions :deep(.primary) {
  min-height: 40px;
}
</style>
