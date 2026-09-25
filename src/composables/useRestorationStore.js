import { computed, reactive } from 'vue'

import {
  archiveBoxLimit,
  archiveObjects,
  restorationTasks,
} from '../data/restorationData'
import { evaluateBoxing, nextBoxNo } from '../utils/archiveStandards'

// 模块级响应式状态：归档清单与任务清单共用同一份数据，
// 在归档清单改动后回到任务清单，两处状态保持一致
const state = reactive({
  boxLimit: { ...archiveBoxLimit },
  archiveItems: archiveObjects.map((item) => ({
    ...item,
    size: { ...item.size },
  })),
  tasks: restorationTasks.map((task) => ({ ...task })),
})

function findItem(id) {
  return state.archiveItems.find((item) => item.id === id)
}

// 按文献对象标题把归档状态与盒号同步到任务清单
function syncTask(item) {
  const task = state.tasks.find((row) => row.title === item.title)
  if (!task) return
  task.archiveStatus = item.status
  task.boxNo = item.boxNo
}

function timestamp() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function useRestorationStore() {
  const tasks = computed(() => state.tasks)

  const archiveEntries = computed(() =>
    state.archiveItems.map((item) => {
      const failures = evaluateBoxing(item, state.archiveItems, state.boxLimit)
      return {
        item,
        failures,
        boxable: item.status !== '已入盒' && failures.length === 0,
      }
    }),
  )

  const archiveStats = computed(() => {
    const stats = { pending: 0, staged: 0, completed: 0 }
    state.archiveItems.forEach((item) => {
      if (item.status === '待入盒') stats.pending += 1
      else if (item.status === '暂存') stats.staged += 1
      else if (item.status === '已入盒') stats.completed += 1
    })
    return stats
  })

  const missingBoxNoCount = computed(
    () =>
      state.archiveItems.filter((item) => !item.boxNo && item.status !== '已入盒')
        .length,
  )

  function stageItem(id) {
    const item = findItem(id)
    if (!item || item.status !== '待入盒') return
    item.status = '暂存'
    item.stagedAt = timestamp()
    syncTask(item)
  }

  function restoreItem(id) {
    const item = findItem(id)
    if (!item || item.status !== '暂存') return
    item.status = '待入盒'
    syncTask(item)
  }

  function boxItem(id) {
    const item = findItem(id)
    if (!item || item.status === '已入盒') return
    // 入盒前逐条核对标准，存在未满足条件时不允许入盒
    if (evaluateBoxing(item, state.archiveItems, state.boxLimit).length > 0) {
      return
    }
    item.status = '已入盒'
    item.completedAt = timestamp()
    syncTask(item)
  }

  function assignMissingBoxNumbers() {
    state.archiveItems.forEach((item) => {
      // 已存在批次沿用原盒号，只补齐缺失盒号，不改写已有盒号
      if (item.boxNo || item.status === '已入盒') return
      item.boxNo = nextBoxNo(state.archiveItems)
      syncTask(item)
    })
  }

  return {
    boxLimit: state.boxLimit,
    tasks,
    archiveEntries,
    archiveStats,
    missingBoxNoCount,
    stageItem,
    restoreItem,
    boxItem,
    assignMissingBoxNumbers,
  }
}
