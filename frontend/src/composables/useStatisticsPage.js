import { ref, watch } from 'vue'
import { createEmptyStatistics, fetchStatisticsData } from '@/services/statistics'
import { getStoredUserId } from '@/utils/auth'

export function useStatisticsPage() {
  const isLoading = ref(true)
  const errorMessage = ref('')
  const selectedDate = ref(new Date())
  const statistics = ref(createEmptyStatistics(selectedDate.value))
  let latestRequestId = 0

  async function loadStatistics() {
    const requestId = ++latestRequestId

    isLoading.value = true
    errorMessage.value = ''

    try {
      const data = await fetchStatisticsData(getStoredUserId(), selectedDate.value)

      if (requestId !== latestRequestId) {
        return
      }

      statistics.value = data
    } catch (error) {
      if (requestId !== latestRequestId) {
        return
      }

      errorMessage.value = '통계 데이터를 불러오지 못했습니다. 백엔드 서버 상태를 확인해 주세요.'
      statistics.value = createEmptyStatistics(selectedDate.value)
      console.error(error)
    } finally {
      if (requestId === latestRequestId) {
        isLoading.value = false
      }
    }
  }

  function moveMonth(step) {
    selectedDate.value = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth() + step,
      1,
    )
  }

  watch(selectedDate, loadStatistics, { immediate: true })

  return {
    errorMessage,
    isLoading,
    moveMonth,
    selectedDate,
    statistics,
  }
}
