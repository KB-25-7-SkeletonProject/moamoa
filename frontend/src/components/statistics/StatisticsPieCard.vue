<template>
  <Card class="stats-card">
    <h2 class="section-title">{{ title }}</h2>
    <div class="pie-inner">
      <svg class="chart" width="100" height="100" viewBox="0 0 100 100" aria-label="카테고리 비율 차트">
        <circle cx="50" cy="50" r="35" fill="none" :stroke="baseStroke" stroke-width="16" />
        <path
          v-for="segment in segments"
          :key="segment.label"
          :d="segment.path"
          fill="none"
          :stroke="segment.color"
          stroke-width="16"
          stroke-linecap="butt"
        />
        <circle
          v-for="segment in fullCircleSegments"
          :key="`${segment.label}-full`"
          cx="50"
          cy="50"
          r="35"
          fill="none"
          :stroke="segment.color"
          stroke-width="16"
        />
        <text x="50" y="47" text-anchor="middle" class="amount">{{ totalAmount }}</text>
        <text x="50" y="60" text-anchor="middle" class="caption">{{ centerLabel }}</text>
      </svg>

      <div class="pie-legend">
        <div v-for="item in items" :key="item.label" class="legend-item">
          <span class="legend-dot" :style="{ background: item.color }" />
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-pct">{{ item.percent }}%</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/common/Card.vue'

const props = defineProps({
  title: {
    type: String,
    default: '카테고리 비율',
  },
  centerLabel: {
    type: String,
    default: '합계',
  },
  totalAmount: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const baseStroke = 'var(--surface-muted)'
const center = 50
const radius = 35

function polarToCartesian(angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  }
}

function createArcPath(startAngle, endAngle) {
  const start = polarToCartesian(endAngle)
  const end = polarToCartesian(startAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
  ].join(' ')
}

const segments = computed(() => {
  let startAngle = 0

  return props.items
    .filter((item) => item.percent > 0 && item.percent < 100)
    .map((item) => {
      const angle = (item.percent / 100) * 360
      const endAngle = startAngle + angle
      const segment = {
        label: item.label,
        color: item.color,
        path: createArcPath(startAngle, endAngle),
      }

      startAngle = endAngle
      return segment
    })
})

const fullCircleSegments = computed(() =>
  props.items
    .filter((item) => item.percent >= 100)
    .map((item) => ({
      label: item.label,
      color: item.color,
    })),
)
</script>

<style scoped>
.stats-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  margin: 0 0 12px;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.pie-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  min-height: 180px;
}

.chart {
  flex-shrink: 0;
}

.pie-legend {
  flex: 1;
  min-width: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.legend-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-pct {
  margin-left: auto;
  font-weight: var(--font-weight-700);
  color: var(--text);
  font-size: var(--font-size-12);
}

.amount {
  font-size: 11px;
  font-weight: var(--font-weight-700);
  fill: var(--text);
}

.caption {
  font-size: 9px;
  fill: var(--text-muted);
}

@media (min-width: 768px) {
  .pie-inner {
    min-height: 220px;
  }

  .legend-item {
    font-size: var(--font-size-13);
  }
}

@media (min-width: 1280px) {
  .section-title {
    font-size: var(--font-size-16);
  }

  .legend-item {
    font-size: var(--font-size-14);
    margin-bottom: 9px;
  }
}

@media (max-width: 359px) {
  .pie-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart {
    align-self: center;
  }

  .pie-legend {
    width: 100%;
  }
}
</style>
