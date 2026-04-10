import { TRANSACTION_GROUPS } from '@/constants/transactionRecords'

function cloneTransactionGroups(groups) {
  return groups.map((group) => ({
    ...group,
    records: group.records.map((record) => ({ ...record }))
  }))
}

export async function fetchTransactionGroups() {
  // Mock source for now.
  // Later this can be replaced with json-server/db.json without changing the page contract.
  return cloneTransactionGroups(TRANSACTION_GROUPS)
}
