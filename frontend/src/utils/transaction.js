const formatter = new Intl.NumberFormat('ko-KR')

export function flattenTransactionGroups(groups) {
  return groups.flatMap((group) =>
    group.records.map((record) => ({
      ...record,
      groupTitle: group.title,
      groupTotal: group.total,
      groupTotalType: group.totalType,
      monthKey: `${String(record.dateOrder).slice(0, 4)}-${String(record.dateOrder).slice(4, 6)}`,
      dateKey: `${String(record.dateOrder).slice(0, 4)}-${String(record.dateOrder).slice(4, 6)}-${String(record.dateOrder).slice(6, 8)}`,
    })),
  )
}

export function buildMonthOptions(records) {
  return [...new Set(records.map((record) => record.monthKey))]
    .sort((a, b) => b.localeCompare(a))
    .map((value) => {
      const [, month] = value.split('-')
      return {
        value,
        label: `${Number(month)}월`,
      }
    })
}

export function getCategoryFilterLabel(selectedCategoryIds, categoryNameById) {
  if (selectedCategoryIds.length === 0) return '카테고리'
  if (selectedCategoryIds.length === 1) {
    return categoryNameById[selectedCategoryIds[0]] || '카테고리'
  }
  return `카테고리 ${selectedCategoryIds.length}`
}

export function formatDateLabel(value) {
  const [, month, day] = value.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

export function getDateFilterLabel(dateFilter) {
  if (dateFilter.mode === 'single' && dateFilter.singleDate) {
    return formatDateLabel(dateFilter.singleDate)
  }
  if (dateFilter.mode === 'range' && dateFilter.startDate && dateFilter.endDate) {
    return `${formatDateLabel(dateFilter.startDate)} ~ ${formatDateLabel(dateFilter.endDate)}`
  }
  return '날짜'
}

export function formatCompactCurrency(amount, positive) {
  const absolute = Math.abs(amount)
  const prefix = positive ? '+' : '-'

  if (absolute >= 10000) {
    const compactValue = absolute / 10000
    const rounded =
      compactValue >= 100 ? Math.round(compactValue) : Math.round(compactValue * 10) / 10
    return `${prefix}${formatter.format(rounded)}만`
  }

  return `${prefix}${formatter.format(absolute)}원`
}

export function formatExactCurrency(amount, positive) {
  const absolute = Math.abs(amount)
  const prefix = positive ? '+' : '-'

  return `${prefix}${formatter.format(absolute)}원`
}

export function resolveDateMatch(dateKey, dateFilter) {
  if (dateFilter.mode === 'single') {
    return !dateFilter.singleDate || dateKey === dateFilter.singleDate
  }

  if (!dateFilter.startDate || !dateFilter.endDate) {
    return true
  }

  return dateKey >= dateFilter.startDate && dateKey <= dateFilter.endDate
}

export function filterTransactionGroups(groups, filters) {
  const query = filters.searchQuery.trim().toLowerCase()

  return groups
    .map((group) => {
      let records = group.records.filter((record) => {
        const monthKey = `${String(record.dateOrder).slice(0, 4)}-${String(record.dateOrder).slice(4, 6)}`
        const dateKey = `${String(record.dateOrder).slice(0, 4)}-${String(record.dateOrder).slice(4, 6)}-${String(record.dateOrder).slice(6, 8)}`

        const matchesType = filters.selectedType === 'all' || record.type === filters.selectedType
        const matchesMonth = filters.selectedMonth ? monthKey === filters.selectedMonth : true
        const matchesCategory =
          filters.selectedCategoryIds.length === 0 ||
          filters.selectedCategoryIds.includes(record.categoryId)
        const matchesDate = resolveDateMatch(dateKey, filters.dateFilter)
        const matchesQuery =
          !query ||
          [record.title, record.category, record.meta, record.time]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query))

        return matchesType && matchesMonth && matchesCategory && matchesDate && matchesQuery
      })

      records = sortTransactionRecords(records, filters.selectedSort)

      return {
        ...group,
        records,
      }
    })
    .filter((group) => group.records.length > 0)
}

export function sortTransactionGroups(groups, selectedSort) {
  const copied = [...groups]

  if (selectedSort === 'oldest') {
    return copied.reverse()
  }

  if (selectedSort === 'amountDesc') {
    return copied.sort(
      (a, b) =>
        Math.max(...b.records.map((record) => record.amountValue)) -
        Math.max(...a.records.map((record) => record.amountValue)),
    )
  }

  if (selectedSort === 'amountAsc') {
    return copied.sort(
      (a, b) =>
        Math.min(...a.records.map((record) => record.amountValue)) -
        Math.min(...b.records.map((record) => record.amountValue)),
    )
  }

  return copied
}

export function summarizeTransactions(records) {
  const incomeTotal = records
    .filter((record) => record.type === 'income')
    .reduce((sum, record) => sum + record.amountValue, 0)

  const expenseTotal = records
    .filter((record) => record.type === 'expense')
    .reduce((sum, record) => sum + record.amountValue, 0)

  const balanceTotal = incomeTotal - expenseTotal

  return {
    income: formatExactCurrency(incomeTotal, true),
    expense: formatExactCurrency(expenseTotal, false),
    balance: formatExactCurrency(balanceTotal, balanceTotal >= 0),
  }
}

function sortTransactionRecords(records, selectedSort) {
  if (selectedSort === 'latest') {
    return [...records].sort((a, b) => b.dateOrder - a.dateOrder || b.time.localeCompare(a.time))
  }

  if (selectedSort === 'oldest') {
    return [...records].sort((a, b) => a.dateOrder - b.dateOrder || a.time.localeCompare(b.time))
  }

  if (selectedSort === 'amountDesc') {
    return [...records].sort((a, b) => b.amountValue - a.amountValue)
  }

  if (selectedSort === 'amountAsc') {
    return [...records].sort((a, b) => a.amountValue - b.amountValue)
  }

  return records
}
