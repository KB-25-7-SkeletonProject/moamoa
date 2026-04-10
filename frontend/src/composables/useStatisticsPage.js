import { computed, ref, watch } from 'vue'
import { createEmptyStatistics, fetchStatisticsData } from '@/services/statistics'
import { useAuthStore } from '@/stores/authStore'

export function useStatisticsPage() {
  const authStore = useAuthStore()
  const isLoading = ref(true)
  const errorMessage = ref('')
  const selectedDate = ref(new Date())
  const statistics = ref(createEmptyStatistics(selectedDate.value))
  const userId = computed(() => authStore.user?.id || null)
  let latestRequestId = 0

  async function loadStatistics() {
    const requestId = ++latestRequestId

    isLoading.value = true
    errorMessage.value = ''

    if (!userId.value) {
      errorMessage.value = '로그인 사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.'
      statistics.value = createEmptyStatistics(selectedDate.value)
      isLoading.value = false
      return
    }

    try {
      const data = await fetchStatisticsData(userId.value, selectedDate.value)

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

  watch([selectedDate, userId], loadStatistics, { immediate: true })

  return {
    errorMessage,
    isLoading,
    moveMonth,
    selectedDate,
    statistics,
  }
}
