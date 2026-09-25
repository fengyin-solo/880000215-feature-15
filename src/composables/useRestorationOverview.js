import { computed } from 'vue'

import {
  restorationBatches,
  restorationEnvironment,
} from '../data/restorationData'
import { useRestorationStore } from './useRestorationStore'

export function useRestorationOverview() {
  const { tasks } = useRestorationStore()

  const batchCount = computed(() => restorationBatches.length)
  const highRiskCount = computed(
    () => tasks.value.filter((item) => item.risk === 'high').length,
  )
  const environmentCount = computed(() => restorationEnvironment.length)
  const ownerCount = computed(
    () => new Set(tasks.value.map((item) => item.owner)).size,
  )

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}
