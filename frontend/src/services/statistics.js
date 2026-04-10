import api from './api'
import { getStoredUserId } from '@/utils/auth'
import {
  LEGACY_CATEGORY_ID_MAP,
  STATISTICS_BAR_COLORS,
  STATISTICS_ENDPOINTS,
  STATISTICS_PIE_COLOR_MAP,
  STATISTICS_SECTION_META,
} from '@/constants/statistics'

function normalizeCategoryId(value) {
  const categoryId = String(value || '').trim()
  return LEGACY_CATEGORY_ID_MAP[categoryId] || categoryId
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(date)
}

function formatMonthOnlyLabel(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
  }).format(date)
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`
}

function formatCompactCurrency(value) {
  const amount = Number(value || 0)

  if (amount >= 10000) {
    const compact = Math.round(amount / 1000) / 10
    return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}만`
  }

  return amount.toLocaleString('ko-KR')
}

function createSectionSkeleton() {
  return {
    heading: '',
    description: '',
    summaryLabel: '',
    titles: {
      pie: '',
      bar: '',
      comparison: '',
    },
    pie: {
      totalAmount: '0원',
      items: [],
    },
    bars: [],
    comparison: [],
  }
}

function createSectionMeta(type) {
  return STATISTICS_SECTION_META[type]
}

function toValidDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isSameMonth(date, targetDate) {
  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth()
  )
}

function sumRecordAmounts(records) {
  return records.reduce((sum, record) => sum + Number(record.amount || 0), 0)
}

function getComparisonState(delta, reverse = false) {
  if (delta === 0) {
    return 'same'
  }

  if (reverse) {
    return delta > 0 ? 'better' : 'worse'
  }

  return delta < 0 ? 'better' : 'worse'
}

function getChangeLabel(delta, amount, suffix = '') {
  if (delta === 0) {
    return '(변동 없음)'
  }

  const formattedAmount = suffix ? `${amount}${suffix}` : formatCurrency(amount)
  return delta < 0 ? `(${formattedAmount} 감소)` : `(${formattedAmount} 증가)`
}

function createComparisonItem(label, previous, current, options = {}) {
  const delta = current - previous
  const absDelta = Math.abs(delta)

  return {
    label,
    previous: options.suffix ? `${previous}${options.suffix}` : formatCurrency(previous),
    current: options.suffix ? `${current}${options.suffix}` : formatCurrency(current),
    changeLabel: options.showChange === false ? '' : getChangeLabel(delta, absDelta, options.suffix),
    state: getComparisonState(delta, options.reverse),
  }
}

function getMonthDates(baseDate, count = 4) {
  return Array.from({ length: count }, (_, index) => {
    const offset = count - index - 1
    return new Date(baseDate.getFullYear(), baseDate.getMonth() - offset, 1)
  })
}

function createTrendItems(monthDates, amounts, activeColor, inactiveColor) {
  const maxValue = Math.max(...amounts, 0)
  const currentIndex = amounts.length - 1

  return amounts.map((amount, index) => ({
    label: formatMonthOnlyLabel(monthDates[index]),
    rawAmount: amount,
    amount: formatCompactCurrency(amount),
    width: maxValue === 0 ? 0 : Math.max((amount / maxValue) * 100, 8),
    color: index === currentIndex ? activeColor : inactiveColor,
    active: index === currentIndex,
  }))
}

function createPieItems(categoryTotals, colorMap, fallbackColors) {
  const total = categoryTotals.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return categoryTotals.map((item, index) => {
    const value = Number(item.amount || 0)
    const percent = total === 0 ? 0 : Math.round((value / total) * 100)

    return {
      label: item.label,
      rawAmount: value,
      amount: formatCurrency(value),
      percent,
      color: colorMap[item.id] || fallbackColors[index % fallbackColors.length],
    }
  })
}

function buildCategoryMaps(categories = []) {
  const byId = new Map()
  const byType = {
    expense: [],
    income: [],
  }

  categories.forEach((category) => {
    const normalized = {
      ...category,
      id: normalizeCategoryId(category.id),
    }

    byId.set(normalized.id, normalized)

    if (normalized.type === 'expense' || normalized.type === 'income') {
      byType[normalized.type].push(normalized)
    }
  })

  return { byId, byType }
}

function normalizeRecords(records = []) {
  return records
    .map((record) => {
      const date = toValidDate(record.date)
      const amount = Number(record.amount || 0)

      if (!date || !Number.isFinite(amount)) {
        return null
      }

      return {
        ...record,
        amount,
        date,
        categoryId: normalizeCategoryId(record.categoryId || record.category),
      }
    })
    .filter(Boolean)
}

function getMonthlyTotals(records, type, monthDates) {
  return monthDates.map((monthDate) =>
    sumRecordAmounts(
      records.filter((record) => record.type === type && isSameMonth(record.date, monthDate)),
    ),
  )
}

function getCategoryTotals(records, categoriesById, type, targetDate) {
  const totals = new Map()

  records.forEach((record) => {
    if (record.type !== type || !isSameMonth(record.date, targetDate)) {
      return
    }

    totals.set(record.categoryId, (totals.get(record.categoryId) || 0) + record.amount)
  })

  return [...totals.entries()]
    .map(([categoryId, amount]) => ({
      id: categoryId,
      label: categoriesById.get(categoryId)?.name || '기타',
      amount,
    }))
    .sort((left, right) => right.amount - left.amount)
}

function getSavingsAmount(records, targetDate) {
  const income = sumRecordAmounts(
    records.filter((record) => record.type === 'income' && isSameMonth(record.date, targetDate)),
  )
  const expense = sumRecordAmounts(
    records.filter((record) => record.type === 'expense' && isSameMonth(record.date, targetDate)),
  )

  return income - expense
}

function getSavingsRate(records, targetDate) {
  const income = sumRecordAmounts(
    records.filter((record) => record.type === 'income' && isSameMonth(record.date, targetDate)),
  )
  const expense = sumRecordAmounts(
    records.filter((record) => record.type === 'expense' && isSameMonth(record.date, targetDate)),
  )

  if (income <= 0) {
    return 0
  }

  return Math.max(0, Math.round(((income - expense) / income) * 100))
}

function buildComparisonItems({
  type,
  currentMonthRecords,
  previousMonthRecords,
  currentCategoryTotals,
  previousCategoryTotals,
}) {
  const currentTotal = sumRecordAmounts(currentMonthRecords)
  const previousTotal = sumRecordAmounts(previousMonthRecords)
  const currentById = new Map(currentCategoryTotals.map((item) => [item.id, item]))
  const previousById = new Map(previousCategoryTotals.map((item) => [item.id, item]))
  const categoryPriority = [...currentCategoryTotals, ...previousCategoryTotals]
    .filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index)
    .slice(0, 2)

  const items = [
    createComparisonItem(
      type === 'expense' ? '전체 지출' : '전체 수입',
      previousTotal,
      currentTotal,
      { reverse: type === 'income' },
    ),
  ]

  categoryPriority.forEach((item) => {
    const current = currentById.get(item.id)?.amount || 0
    const previous = previousById.get(item.id)?.amount || 0

    items.push(
      createComparisonItem(item.label, previous, current, {
        reverse: type === 'income',
      }),
    )
  })

  return items
}

function buildSection({
  key,
  type,
  records,
  categoriesById,
  date,
  monthDates,
  colorMap,
  activeColor,
  inactiveColor,
}) {
  const meta = createSectionMeta(type)
  const fallbackColors = Object.values(colorMap)
  const previousDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)

  const currentMonthRecords = records.filter(
    (record) => record.type === type && isSameMonth(record.date, date),
  )
  const previousMonthRecords = records.filter(
    (record) => record.type === type && isSameMonth(record.date, previousDate),
  )

  const currentCategoryTotals = getCategoryTotals(records, categoriesById, type, date)
  const previousCategoryTotals = getCategoryTotals(records, categoriesById, type, previousDate)
  const monthlyTotals = getMonthlyTotals(records, type, monthDates)
  const comparison = buildComparisonItems({
    type,
    currentMonthRecords,
    previousMonthRecords,
    currentCategoryTotals,
    previousCategoryTotals,
  })

  if (type === 'expense') {
    comparison.push(
      createComparisonItem(
        '저축률',
        getSavingsRate(records, previousDate),
        getSavingsRate(records, date),
        {
          suffix: '%',
          reverse: true,
        },
      ),
    )
  } else {
    comparison.push(
      createComparisonItem(
        '저축 가능액',
        getSavingsAmount(records, previousDate),
        getSavingsAmount(records, date),
        {
          reverse: true,
        },
      ),
    )
  }

  return {
    key,
    ...meta,
    pie: {
      totalAmount: formatCompactCurrency(sumRecordAmounts(currentMonthRecords)),
      items: createPieItems(currentCategoryTotals, colorMap, fallbackColors),
    },
    bars: createTrendItems(monthDates, monthlyTotals, activeColor, inactiveColor),
    comparison,
  }
}

export function createEmptyStatistics(date = new Date()) {
  return {
    monthLabel: formatMonthLabel(date),
    sections: [
      {
        key: 'expense',
        ...createSectionMeta('expense'),
        ...createSectionSkeleton(),
      },
      {
        key: 'income',
        ...createSectionMeta('income'),
        ...createSectionSkeleton(),
      },
    ],
  }
}

export async function fetchStatisticsData(userId, date) {
  const targetUserId = userId || getStoredUserId()
  const monthDates = getMonthDates(date, 4)

  const [{ data: recordsData }, { data: categoriesData }] = await Promise.all([
    api.get(STATISTICS_ENDPOINTS.records, {
      params: targetUserId ? { userId: targetUserId } : undefined,
    }),
    api.get(STATISTICS_ENDPOINTS.categories),
  ])

  const records = normalizeRecords(Array.isArray(recordsData) ? recordsData : [])
  const { byId: categoriesById } = buildCategoryMaps(Array.isArray(categoriesData) ? categoriesData : [])

  return {
    monthLabel: formatMonthLabel(date),
    sections: [
      buildSection({
        key: 'expense',
        type: 'expense',
        records,
        categoriesById,
        date,
        monthDates,
        colorMap: STATISTICS_PIE_COLOR_MAP.expense,
        activeColor: STATISTICS_BAR_COLORS.expense.active,
        inactiveColor: STATISTICS_BAR_COLORS.expense.inactive,
      }),
      buildSection({
        key: 'income',
        type: 'income',
        records,
        categoriesById,
        date,
        monthDates,
        colorMap: STATISTICS_PIE_COLOR_MAP.income,
        activeColor: STATISTICS_BAR_COLORS.income.active,
        inactiveColor: STATISTICS_BAR_COLORS.income.inactive,
      }),
    ],
  }
}
