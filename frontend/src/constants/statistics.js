export const STATISTICS_ENDPOINTS = {
  records: '/records',
  categories: '/categories',
}

export const LEGACY_CATEGORY_ID_MAP = {
  c009: 'c101',
  c010: 'c102',
  c011: 'c103',
  c012: 'c104',
  c013: 'c105',
  c014: 'c106',
  c015: 'c107',
  c016: 'c108',
}

export const STATISTICS_BAR_COLORS = {
  expense: {
    active: 'var(--stats-expense-active)',
    inactive: 'var(--stats-expense-inactive)',
  },
  income: {
    active: 'var(--stats-income-active)',
    inactive: 'var(--stats-income-inactive)',
  },
}

export const STATISTICS_PIE_COLOR_MAP = {
  expense: {
    c001: 'var(--stats-expense-food)',
    c002: 'var(--stats-expense-transport)',
    c003: 'var(--stats-expense-shopping)',
    c004: 'var(--stats-expense-medical)',
    c005: 'var(--stats-expense-education)',
    c006: 'var(--stats-expense-leisure)',
    c007: 'var(--stats-expense-housing)',
    c008: 'var(--stats-expense-other)',
  },
  income: {
    c101: 'var(--stats-income-salary)',
    c102: 'var(--stats-income-pocket-money)',
    c103: 'var(--stats-income-side)',
    c104: 'var(--stats-income-interest)',
    c105: 'var(--stats-income-bonus)',
    c106: 'var(--stats-income-dividend)',
    c107: 'var(--stats-income-point)',
    c108: 'var(--stats-income-other)',
  },
}

export const STATISTICS_SECTION_META = {
  expense: {
    heading: '지출 통계',
    description: '카테고리별 지출 흐름과 전월 비교를 확인하세요',
    summaryLabel: '총 지출',
    titles: {
      pie: '이달의 지출 카테고리 비율',
      bar: '지출 월별 추이',
      comparison: '지출 전월 비교',
    },
  },
  income: {
    heading: '수입 통계',
    description: '월급과 부수입 흐름, 전월 대비 변화를 확인하세요',
    summaryLabel: '총 수입',
    titles: {
      pie: '이달의 수입 카테고리 비율',
      bar: '수입 월별 추이',
      comparison: '수입 전월 비교',
    },
  },
}
