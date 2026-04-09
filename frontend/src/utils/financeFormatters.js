function sortRecordsByRecent(records) {
  return [...records].sort((left, right) => {
    const dateDiff = new Date(right.date) - new Date(left.date)
    if (dateDiff !== 0) return dateDiff
    return String(right.id || '').localeCompare(String(left.id || ''))
  })
}

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`
}

export function formatMonthLabel(date = new Date()) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

export function formatDateLabel(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function getTotals(records) {
  return records.reduce(
    (acc, record) => {
      const amount = Number(record.amount || 0)

      if (!Number.isFinite(amount)) {
        return acc
      }

      if (record.type === 'income') acc.income += amount
      else if (record.type === 'expense') acc.expense += amount

      acc.balance = acc.income - acc.expense
      return acc
    },
    { income: 0, expense: 0, balance: 0 },
  )
}

export function getMonthlyCategoryTotals(records, baseDate = new Date()) {
  const month = baseDate.getMonth()
  const year = baseDate.getFullYear()
  const totals = {}

  records.forEach((record) => {
    const recordDate = new Date(record.date)
    const amount = Number(record.amount || 0)

    if (
      record.type === 'expense' &&
      Number.isFinite(amount) &&
      !Number.isNaN(recordDate.getTime()) &&
      recordDate.getMonth() === month &&
      recordDate.getFullYear() === year
    ) {
      const categoryId = record.categoryId || record.category
      totals[categoryId] = (totals[categoryId] || 0) + amount
    }
  })

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([categoryId, amount]) => ({ categoryId, amount }))
}

export function getRecentRecords(records, limit = 5) {
  return sortRecordsByRecent(records).slice(0, limit)
}
