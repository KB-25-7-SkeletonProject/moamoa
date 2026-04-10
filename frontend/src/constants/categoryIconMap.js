import defaultIcon from '@/assets/images/category-icons/default.svg'
import expenseEducationIcon from '@/assets/images/category-icons/expense-education.svg'
import expenseEtcIcon from '@/assets/images/category-icons/expense-etc.svg'
import expenseFoodIcon from '@/assets/images/category-icons/expense-food.svg'
import expenseHomeIcon from '@/assets/images/category-icons/expense-home.svg'
import expenseLeisureIcon from '@/assets/images/category-icons/expense-leisure.svg'
import expenseMedicalIcon from '@/assets/images/category-icons/expense-medical.svg'
import expenseShoppingIcon from '@/assets/images/category-icons/expense-shopping.svg'
import expenseTransportIcon from '@/assets/images/category-icons/expense-transport.svg'
import incomeAllowanceIcon from '@/assets/images/category-icons/income-allowance.svg'
import incomeBonusIcon from '@/assets/images/category-icons/income-bonus.svg'
import incomeInterestIcon from '@/assets/images/category-icons/income-interest.svg'
import incomePointIcon from '@/assets/images/category-icons/income-point.svg'
import incomeSalaryIcon from '@/assets/images/category-icons/income-salary.svg'
import incomeSideIcon from '@/assets/images/category-icons/income-side.svg'
import incomeStockIcon from '@/assets/images/category-icons/income-stock.svg'

export const CATEGORY_ICON_MAP = {
  c001: expenseFoodIcon,
  c002: expenseTransportIcon,
  c003: expenseShoppingIcon,
  c004: expenseMedicalIcon,
  c005: expenseEducationIcon,
  c006: expenseLeisureIcon,
  c007: expenseHomeIcon,
  c008: expenseEtcIcon,
  c101: incomeSalaryIcon,
  c102: incomeAllowanceIcon,
  c103: incomeSideIcon,
  c104: incomeInterestIcon,
  c105: incomeBonusIcon,
  c106: incomeStockIcon,
  c107: incomePointIcon,
  c108: expenseEtcIcon,
}

export function getCategoryIconById(categoryId) {
  return CATEGORY_ICON_MAP[categoryId] || defaultIcon
}
