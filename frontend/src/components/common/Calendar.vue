<template>
  <div class="wrap">
    <!-- Header -->
    <div class="header">
      <span class="monthLabel">{{ year }}년 {{ month }}월</span>
      <div class="navGroup">
        <button class="navBtn" @click="$emit('prev')" aria-label="이전 달" type="button">
          ‹
        </button>
        <button class="navBtn" @click="$emit('next')" aria-label="다음 달" type="button">
          ›
        </button>
      </div>
    </div>

    <!-- Day names -->
    <div class="dayNames">
      <span
        v-for="(dayName, idx) in dayNames"
        :key="dayName"
        :class="['dayName', idx === 0 ? 'sun' : '', idx === 6 ? 'sat' : '']"
      >
        {{ dayName }}
      </span>
    </div>

    <!-- Grid -->
    <div class="grid">
      <!-- Empty cells for month start offset -->
      <span v-for="i in resolvedFirstDow" :key="`empty-${i}`" class="emptyCell" />

      <!-- Day cells -->
      <button
        v-for="day in normalizedDays"
        :key="day.date"
        type="button"
        :class="['day', day.date === today ? 'today' : '']"
        @click="$emit('dayClick', day)"
      >
        <span class="dayNumber">{{ day.date }}</span>
        <span v-if="day.checked" class="checkBadge">✓</span>
        <span
          v-if="day.mark === 'expense' || day.mark === 'income'"
          :class="['markDot', day.mark === 'expense' ? 'markExpense' : 'markIncome']"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'Calendar'
})

defineEmits(['prev', 'next', 'dayClick'])

const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  days: {
    type: Array,
    required: true
  },
  firstDow: Number,
  today: Number
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
      ...(byDate.get(date) || {})
    }
  })
})
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
  min-height: 40px;
}

.day {
  position: relative;
  width: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-14);
  color: var(--text);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
  padding: 6px 4px 14px;
}

.day:hover {
  background: var(--surface-muted);
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
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
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
