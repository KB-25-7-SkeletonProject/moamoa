<template>
  <div class="wrap">
    <div class="header">
      <span class="monthLabel">{{ year }}년 {{ month }}월</span>
      <div class="navGroup">
        <button class="navBtn" type="button" aria-label="이전 달" @click="$emit('prev')">‹</button>
        <button class="navBtn" type="button" aria-label="다음 달" @click="$emit('next')">›</button>
      </div>
    </div>

    <div class="dayNames">
      <span
        v-for="(dayName, idx) in dayNames"
        :key="dayName"
        :class="['dayName', idx === 0 ? 'sun' : '', idx === 6 ? 'sat' : '']"
      >
        {{ dayName }}
      </span>
    </div>

    <div class="grid">
      <span v-for="i in resolvedFirstDow" :key="`empty-${i}`" class="emptyCell" />

      <button
        v-for="day in normalizedDays"
        :key="day.date"
        type="button"
        :disabled="!interactive"
        :class="['day', day.date === today ? 'today' : '', !interactive ? 'readonly' : '']"
        @click="handleDayClick(day)"
      >
        <span class="dayNumber">{{ day.date }}</span>
        <span v-if="day.checked" class="checkBadge">✓</span>
        <span v-if="resolveMarks(day).length" class="markDots" aria-hidden="true">
          <span
            v-for="mark in resolveMarks(day)"
            :key="`${day.date}-${mark}`"
            :class="['markDot', mark === 'expense' ? 'markExpense' : 'markIncome']"
          />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'Calendar',
})

const emit = defineEmits(['prev', 'next', 'dayClick'])

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  days: {
    type: Array,
    required: true,
  },
  firstDow: Number,
  today: Number,
  interactive: {
    type: Boolean,
    default: true,
  },
})

const dayNames = ['일', '월', '화', '수', '목', '금', '토']

const resolvedFirstDow = computed(() => {
  if (typeof props.firstDow === 'number') {
    return props.firstDow
  }

  return new Date(props.year, props.month - 1, 1).getDay()
})

const daysInMonth = computed(() => new Date(props.year, props.month, 0).getDate())

const normalizedDays = computed(() => {
  const byDate = new Map(props.days.map((day) => [day.date, day]))

  return Array.from({ length: daysInMonth.value }, (_, index) => {
    const date = index + 1
    return {
      date,
      ...(byDate.get(date) || {}),
    }
  })
})

function handleDayClick(day) {
  if (!props.interactive) {
    return
  }

  emit('dayClick', day)
}

function resolveMarks(day) {
  if (Array.isArray(day.marks)) {
    return [...new Set(day.marks.filter((mark) => mark === 'income' || mark === 'expense'))]
  }

  if (day.mark === 'income' || day.mark === 'expense') {
    return [day.mark]
  }

  return []
}
</script>

<style scoped>
.wrap {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card-sm);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.monthLabel {
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.navGroup {
  display: flex;
  gap: 8px;
}

.navBtn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--surface-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-16);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navBtn:hover {
  background: var(--border);
}

.dayNames {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.dayName {
  text-align: center;
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-500);
  color: var(--text-muted);
  padding: 8px 0;
}

.dayName.sun {
  color: var(--expense);
}

.dayName.sat {
  color: var(--weekend-blue);
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.emptyCell {
  min-height: 60px;
}

.day {
  position: relative;
  width: 100%;
  min-height: 60px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-14);
  color: var(--text);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  padding: 9px 4px 21px;
}

.day:hover {
  background: var(--surface-muted);
}

.day.readonly {
  cursor: default;
}

.day.readonly:hover {
  background: transparent;
}

.day:disabled {
  opacity: 1;
}

.day.today {
  background: var(--surface-highlight);
  font-weight: var(--font-weight-700);
}

.dayNumber {
  position: relative;
  z-index: 1;
  line-height: 1.2;
}

.markDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.markDots {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.markExpense {
  background: var(--expense);
}

.markIncome {
  background: var(--income);
}

.checkBadge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--text);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-700);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: var(--shadow-strong);
}
</style>
