import api from './api'
import { ALL_CATEGORIES } from '@/constants/category'
import { formatExactCurrency } from '@/utils/transaction'

const categoryNameById = ALL_CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.name
  return acc
}, {})

// 날짜 기준 그룹화 함수
function groupByDate(records) {
  const map = {}

  records.forEach((record) => {
    const date = record.date
    const categoryName = categoryNameById[record.categoryId] || '기타'

    if (!map[date]) {
      map[date] = {
        title: date,
        records: [],
        totalAmountValue: 0,
      }
    }

    const signedAmount = record.type === 'income' ? record.amount : -record.amount
    map[date].totalAmountValue += signedAmount

    map[date].records.push({
      ...record,
      title: record.memo || categoryName,
      category: categoryName,
      amount: formatExactCurrency(record.amount, record.type === 'income'),
      amountValue: record.amount,
      dateOrder: Number(record.date.replaceAll('-', '')),
      time: record.createdAt?.slice(11, 16) || '00:00',
    })
  })

  return Object.values(map)
    .map((group) => ({
      ...group,
      total: formatExactCurrency(group.totalAmountValue, group.totalAmountValue >= 0),
      totalType: group.totalAmountValue >= 0 ? 'income' : 'expense',
    }))
    .sort((a, b) => b.title.localeCompare(a.title))
}

export const fetchTransactionGroups = async (params = {}) => {
  const res = await api.get('/records', {
    params: {
      userId: params.userId,
      _sort: 'date',
      _order: 'desc',
    },
  })

  return groupByDate(res.data)
}
