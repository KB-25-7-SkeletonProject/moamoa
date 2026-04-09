import { computed, onMounted, ref } from 'vue'
import { fetchTransactionGroups } from '@/services/transactions'
import { flattenTransactionGroups } from '@/utils/transaction'

const formatter = new Intl.NumberFormat('ko-KR')
const BASE_MONTH_KEY = '2026-04'
const PIE_COLORS = ['#ffcc00', '#5b8def', '#34c759', '#ff7a59', '#9b8cff', '#00bcd4']

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  return `${year}년 ${Number(month)}월`
}

function addMonths(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function diffMonths(baseMonthKey, targetMonthKey) {
  const [baseYear, baseMonth] = baseMonthKey.split('-').map(Number)
  const [targetYear, targetMonth] = targetMonthKey.split('-').map(Number)

  return (targetYear - baseYear) * 12 + (targetMonth - baseMonth)
}

function formatCompactAmount(amount) {
  if (amount >= 100000000) {
    return `${formatter.format(Math.round(amount / 10000000) / 10)}억`
  }

  if (amount >= 10000) {
    const compact = amount / 10000
    const rounded = compact >= 100 ? Math.round(compact) : Math.round(compact * 10) / 10
    return `${formatter.format(rounded)}만`
  }

  return `${formatter.format(amount)}원`
}

function formatExactAmount(amount) {
  return `${formatter.format(amount)}원`
}

function formatSignedAmount(amount) {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}${formatCompactAmount(Math.abs(amount))}`
}

function scaleAmount(value, factor) {
  return Math.max(0, Math.round((value * factor) / 10) * 10)
}

function aggregateRecords(records, type) {
  const filtered = records.filter((record) => record.type === type)
  const total = filtered.reduce((sum, record) => sum + record.amountValue, 0)
  const count = filtered.length
  const categories = filtered.reduce((map, record) => {
    const prev = map.get(record.category) || 0
    map.set(record.category, prev + record.amountValue)
    return map
  }, new Map())

  return {
    total,
    count,
    categories: [...categories.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value),
  }
}

function buildBaseSnapshot(records) {
  const expense = aggregateRecords(records, 'expense')
  const income = aggregateRecords(records, 'income')

  return {
    expense,
    income,
    balance: income.total - expense.total,
    totalCount: expense.count + income.count,
  }
}

function scaleCategories(categories, offset, multipliers) {
  return categories
    .map((item, index) => {
      const baseFactor = 1 + offset * multipliers.baseStep + (multipliers.spread[index] || 0)
      return {
        label: item.label,
        value: scaleAmount(item.value, Math.max(multipliers.min, baseFactor)),
      }
    })
    .filter((item) => item.value > 0)
}

function deriveSnapshot(baseSnapshot, offset) {
  if (offset === 0) {
    return baseSnapshot
  }

  const expenseCategories = scaleCategories(baseSnapshot.expense.categories, offset, {
    baseStep: 0.08,
    spread: [0.02, -0.03, 0.01, -0.04, 0.03, -0.02],
    min: 0.55,
  })
  const incomeCategories = scaleCategories(baseSnapshot.income.categories, offset, {
    baseStep: 0.03,
    spread: [0.01, -0.02, 0.015, -0.01],
    min: 0.85,
  })

  const expenseTotal = expenseCategories.reduce((sum, item) => sum + item.value, 0)
  const incomeTotal = incomeCategories.reduce((sum, item) => sum + item.value, 0)
  const expenseCount = Math.max(1, Math.round(baseSnapshot.expense.count * (1 + offset * 0.05)))
  const incomeCount = Math.max(1, Math.round(baseSnapshot.income.count * (1 + offset * 0.02)))

  return {
    expense: {
      total: expenseTotal,
      count: expenseCount,
      categories: expenseCategories,
    },
    income: {
      total: incomeTotal,
      count: incomeCount,
      categories: incomeCategories,
    },
    balance: incomeTotal - expenseTotal,
    totalCount: expenseCount + incomeCount,
  }
}

function buildPieItems(categories, total) {
  if (!categories.length || total <= 0) {
    return [
      {
        label: '데이터 없음',
        color: PIE_COLORS[0],
        percent: 100,
      },
    ]
  }

  return categories.slice(0, 5).map((item, index) => ({
    label: item.label,
    color: PIE_COLORS[index % PIE_COLORS.length],
    percent: Math.round((item.value / total) * 100),
  }))
}

function buildBarItems(categories) {
  const source = categories.slice(0, 5)
  const max = source[0]?.value || 1

  return source.map((item, index) => ({
    label: item.label,
    width: Math.max(8, Math.round((item.value / max) * 100)),
    amount: formatCompactAmount(item.value),
    color: PIE_COLORS[index % PIE_COLORS.length],
    active: index === 0,
  }))
}

function buildChangeLabel(current, previous, options = {}) {
  if (previous === 0) {
    return options.zeroLabel || '비교값 없음'
  }

  const diff = current - previous
  if (diff === 0) {
    return '변동 없음'
  }

  const rate = Math.round((Math.abs(diff) / previous) * 100)
  return `${diff > 0 ? '+' : '-'}${rate}%`
}

function buildComparisonState(current, previous, trend = 'upGood') {
  if (current === previous) return 'same'

  if (trend === 'downGood') {
    return current < previous ? 'better' : 'worse'
  }

  return current > previous ? 'better' : 'worse'
}

function buildExpenseSection(current, previous) {
  const averageCurrent =
    current.expense.count > 0 ? Math.round(current.expense.total / current.expense.count) : 0
  const averagePrevious =
    previous.expense.count > 0 ? Math.round(previous.expense.total / previous.expense.count) : 0

  return {
    key: 'expense',
    heading: '지출 분석',
    description: '카테고리별 지출 비중과 전월 대비 변화를 확인할 수 있어요.',
    summaryLabel: '총지출',
    titles: {
      pie: '카테고리 비율',
      bar: '지출 상위 카테고리',
      comparison: '전월 비교',
    },
    pie: {
      totalAmount: formatCompactAmount(current.expense.total),
      items: buildPieItems(current.expense.categories, current.expense.total),
    },
    bars: buildBarItems(current.expense.categories),
    comparison: [
      {
        label: '총지출',
        previous: formatExactAmount(previous.expense.total),
        current: formatExactAmount(current.expense.total),
        changeLabel: buildChangeLabel(current.expense.total, previous.expense.total),
        state: buildComparisonState(current.expense.total, previous.expense.total, 'downGood'),
      },
      {
        label: '건당 평균',
        previous: formatExactAmount(averagePrevious),
        current: formatExactAmount(averageCurrent),
        changeLabel: buildChangeLabel(averageCurrent, averagePrevious),
        state: buildComparisonState(averageCurrent, averagePrevious, 'downGood'),
      },
      {
        label: '지출 건수',
        previous: `${formatter.format(previous.expense.count)}건`,
        current: `${formatter.format(current.expense.count)}건`,
        changeLabel: buildChangeLabel(
          current.expense.count,
          previous.expense.count,
          { zeroLabel: '첫 집계' },
        ),
        state: buildComparisonState(current.expense.count, previous.expense.count, 'downGood'),
      },
    ],
  }
}

function buildIncomeSection(current, previous) {
  return {
    key: 'income',
    heading: '수입 분석',
    description: '수입원 비중과 순이익 흐름을 한 번에 볼 수 있어요.',
    summaryLabel: '총수입',
    titles: {
      pie: '수입 비율',
      bar: '수입 항목',
      comparison: '전월 비교',
    },
    pie: {
      totalAmount: formatCompactAmount(current.income.total),
      items: buildPieItems(current.income.categories, current.income.total),
    },
    bars: buildBarItems(current.income.categories),
    comparison: [
      {
        label: '총수입',
        previous: formatExactAmount(previous.income.total),
        current: formatExactAmount(current.income.total),
        changeLabel: buildChangeLabel(current.income.total, previous.income.total),
        state: buildComparisonState(current.income.total, previous.income.total, 'upGood'),
      },
      {
        label: '순이익',
        previous: formatSignedAmount(previous.balance),
        current: formatSignedAmount(current.balance),
        changeLabel: buildChangeLabel(current.balance, previous.balance),
        state: buildComparisonState(current.balance, previous.balance, 'upGood'),
      },
      {
        label: '수입 건수',
        previous: `${formatter.format(previous.income.count)}건`,
        current: `${formatter.format(current.income.count)}건`,
        changeLabel: buildChangeLabel(
          current.income.count,
          previous.income.count,
          { zeroLabel: '첫 집계' },
        ),
        state: buildComparisonState(current.income.count, previous.income.count, 'upGood'),
      },
    ],
  }
}

export function useStatisticsPage() {
  const isLoading = ref(true)
  const errorMessage = ref('')
  const selectedMonth = ref(BASE_MONTH_KEY)
  const baseSnapshot = ref(null)

  const statistics = computed(() => {
    if (!baseSnapshot.value) {
      return {
        monthLabel: formatMonthLabel(selectedMonth.value),
        sections: [],
      }
    }

    const current = deriveSnapshot(
      baseSnapshot.value,
      diffMonths(BASE_MONTH_KEY, selectedMonth.value),
    )
    const previous = deriveSnapshot(
      baseSnapshot.value,
      diffMonths(BASE_MONTH_KEY, addMonths(selectedMonth.value, -1)),
    )

    return {
      monthLabel: formatMonthLabel(selectedMonth.value),
      sections: [
        buildExpenseSection(current, previous),
        buildIncomeSection(current, previous),
      ],
    }
  })

  function moveMonth(delta) {
    selectedMonth.value = addMonths(selectedMonth.value, delta)
  }

  onMounted(async () => {
    try {
      const groups = await fetchTransactionGroups()
      const records = flattenTransactionGroups(groups).filter(
        (record) => record.monthKey === BASE_MONTH_KEY,
      )

      baseSnapshot.value = buildBaseSnapshot(records)
    } catch (error) {
      errorMessage.value = '통계 데이터를 불러오지 못했어요.'
      console.error(error)
    } finally {
      isLoading.value = false
    }
  })

  return {
    errorMessage,
    isLoading,
    moveMonth,
    statistics,
  }
}
