import axios from 'axios'
import api from '@/services/api'

const RECORDS_ENDPOINT = '/records'
const DEFAULT_USER_ID = 'u001'
const REQUEST_FAILED_MESSAGE =
  '\uC694\uCCAD \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.'
const LEGACY_CATEGORY_ID_MAP = {
  c009: 'c101',
  c010: 'c102',
  c011: 'c103',
  c012: 'c104',
  c013: 'c105',
  c014: 'c106',
  c015: 'c107',
  c016: 'c108',
}

function getDefaultUserId() {
  return localStorage.getItem('token') || DEFAULT_USER_ID
}

function getRequestErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message) {
      return message
    }
  }

  return REQUEST_FAILED_MESSAGE
}

function isValidRecordType(type) {
  return type === 'income' || type === 'expense'
}

function normalizeDateInput(value) {
  const dateValue = String(value || '').trim()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    throw new Error(
      '\uB0A0\uC9DC\uB294 YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.',
    )
  }

  return dateValue
}

function normalizeAmountInput(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      '\uAE08\uC561\uC740 0\uBCF4\uB2E4 \uD070 \uC22B\uC790\uC5EC\uC57C \uD569\uB2C8\uB2E4.',
    )
  }

  return amount
}

function createRecordId() {
  return `r${Date.now()}`
}

function normalizeCategoryId(value) {
  const categoryId = String(value || '').trim()
  return LEGACY_CATEGORY_ID_MAP[categoryId] || categoryId
}

function buildRecordPayload(payload, currentRecord = {}) {
  const type = payload.type ?? currentRecord.type
  const categoryId = normalizeCategoryId(
    payload.categoryId ?? payload.category ?? currentRecord.categoryId,
  )
  const userId = payload.userId ?? currentRecord.userId ?? getDefaultUserId()

  if (!isValidRecordType(type)) {
    throw new Error(
      '\uB0B4\uC5ED \uD0C0\uC785\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.',
    )
  }

  if (!categoryId) {
    throw new Error('\uCE74\uD14C\uACE0\uB9AC\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.')
  }

  const date = normalizeDateInput(payload.date ?? currentRecord.date)
  const amount = normalizeAmountInput(payload.amount ?? currentRecord.amount)
  const now = new Date().toISOString()

  return {
    ...currentRecord,
    userId,
    type,
    amount,
    categoryId,
    memo: String(payload.memo ?? currentRecord.memo ?? '').trim(),
    date,
    updatedAt: now,
  }
}

function sortRecordsByRecent(records) {
  return [...records].sort((left, right) => {
    const dateDiff = new Date(right.date) - new Date(left.date)
    if (dateDiff !== 0) return dateDiff
    return String(right.id || '').localeCompare(String(left.id || ''))
  })
}

export async function readRecords({ userId = getDefaultUserId() } = {}) {
  try {
    const { data } = await api.get(RECORDS_ENDPOINT, {
      params: userId ? { userId } : undefined,
    })
    return sortRecordsByRecent(Array.isArray(data) ? data : [])
  } catch (error) {
    throw new Error(getRequestErrorMessage(error))
  }
}

export async function createRecord(payload) {
  const now = new Date().toISOString()
  const nextRecord = {
    id: createRecordId(),
    createdAt: now,
    ...buildRecordPayload(payload),
  }

  try {
    const { data } = await api.post(RECORDS_ENDPOINT, nextRecord)
    return data
  } catch (error) {
    throw new Error(getRequestErrorMessage(error))
  }
}

export async function getRecordById(recordId) {
  if (!recordId) {
    return null
  }

  try {
    const { data } = await api.get(`${RECORDS_ENDPOINT}/${encodeURIComponent(recordId)}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    throw new Error(getRequestErrorMessage(error))
  }
}

export async function updateRecord(recordId, payload) {
  const currentRecord = await getRecordById(recordId)

  if (!currentRecord) {
    return null
  }

  const updatedRecord = buildRecordPayload(payload, currentRecord)

  try {
    const { data } = await api.patch(
      `${RECORDS_ENDPOINT}/${encodeURIComponent(recordId)}`,
      updatedRecord,
    )
    return data
  } catch (error) {
    throw new Error(getRequestErrorMessage(error))
  }
}

export async function deleteRecord(recordId) {
  if (!recordId) {
    return false
  }

  const currentRecord = await getRecordById(recordId)

  if (!currentRecord) {
    return false
  }

  try {
    await api.delete(`${RECORDS_ENDPOINT}/${encodeURIComponent(recordId)}`)
  } catch (error) {
    throw new Error(getRequestErrorMessage(error))
  }

  return true
}
