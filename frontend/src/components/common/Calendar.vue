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
      <span v-for="i in firstDow" :key="`empty-${i}`" />

      <!-- Day cells -->
      <button
        v-for="day in days"
        :key="day.date"
        type="button"
        :class="['day', 
          day.date === today ? 'today' : '', 
          day.mark === 'expense' ? 'hasExpense' : '',
          day.mark === 'income' ? 'hasIncome' : ''
        ]"
        @click="$emit('dayClick', day)"
      >
        <span v-if="day.checked" class="checkBadge">✓</span>
        {{ day.date }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
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
    firstDow: {
      type: Number,
      default: 0
    },
    today: Number
  },
  data() {
    return {
      dayNames: ['일', '월', '화', '수', '목', '금', '토']
    }
  }
}
</script>

<style scoped>
/* ============================================================
   Calendar Component Styles
   ============================================================ */

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
  font-size: 16px;
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

.day {
  position: relative;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.day:hover {
  background: var(--surface-muted);
}

.day.today {
  background: var(--surface-highlight);
  font-weight: var(--font-weight-700);
}

.day.hasExpense::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--expense);
  border-radius: 50%;
}

.day.hasIncome::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--income);
  border-radius: 50%;
}

.checkBadge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  color: var(--primary);
}
</style>
