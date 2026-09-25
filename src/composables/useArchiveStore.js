import { computed, reactive } from 'vue'

import {
  archiveEntries,
  ARCHIVE_STATUS,
  restorationBatches,
  restorationTasks,
} from '../data/restorationData'
import {
  entryMaxSize,
  evaluateEntry,
  normalizeBoxNumber,
  suggestBoxNumber,
} from '../utils/boxingRules'

// 模块级单例：任务清单、批次档案与无酸盒归档清单共用同一份状态，
// 从归档清单返回任务清单后两处状态保持一致。
const state = reactive({
  tasks: restorationTasks.map((task) => ({ ...task })),
  batches: restorationBatches.map((batch) => ({ ...batch })),
  archiveEntries: archiveEntries.map((entry) => ({
    ...entry,
    pieces: entry.pieces.map((piece) => ({ ...piece })),
  })),
})

const STAGE_BY_STATUS = {
  [ARCHIVE_STATUS.PENDING]: '归档前',
  [ARCHIVE_STATUS.STAGED]: '无酸盒暂存',
  [ARCHIVE_STATUS.ARCHIVED]: '已归档',
}

function toStatusDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

function syncLinkedRecords(entry) {
  const task = state.tasks.find((item) => item.title === entry.title)
  if (task) {
    task.stage = STAGE_BY_STATUS[entry.status]
  }

  const batch = state.batches.find((item) => item.code === entry.batchCode)
  if (batch) {
    batch.status = STAGE_BY_STATUS[entry.status]
  }
}

export function useArchiveStore() {
  const tasks = computed(() => state.tasks)
  const batches = computed(() => state.batches)
  const entries = computed(() => state.archiveEntries)

  const pendingEntries = computed(() =>
    state.archiveEntries
      .filter((entry) => entry.status === ARCHIVE_STATUS.PENDING)
      .sort((a, b) => {
        const boxA = normalizeBoxNumber(a.boxNumber)
        const boxB = normalizeBoxNumber(b.boxNumber)
        if (boxA === '' && boxB !== '') return 1
        if (boxB === '' && boxA !== '') return -1
        if (boxA !== boxB) return boxA.localeCompare(boxB)
        return a.title.localeCompare(b.title, 'zh-Hans-CN')
      }),
  )

  const stagedEntries = computed(() =>
    state.archiveEntries
      .filter((entry) => entry.status === ARCHIVE_STATUS.STAGED)
      .sort((a, b) => (b.stagedAt ?? '').localeCompare(a.stagedAt ?? '')),
  )

  const archivedEntries = computed(() =>
    state.archiveEntries
      .filter((entry) => entry.status === ARCHIVE_STATUS.ARCHIVED)
      .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? '')),
  )

  const pendingWithoutBox = computed(
    () =>
      pendingEntries.value.filter(
        (entry) => normalizeBoxNumber(entry.boxNumber) === '',
      ).length,
  )

  // 当前盒号占用情况：按盒号归集批次，用于重号判定
  const occupiedBoxes = computed(() => {
    const map = new Map()
    state.archiveEntries.forEach((entry) => {
      const boxNumber = normalizeBoxNumber(entry.boxNumber)
      if (!boxNumber) {
        return
      }
      if (!map.has(boxNumber)) {
        map.set(boxNumber, [])
      }
      map.get(boxNumber).push(entry)
    })
    return map
  })

  function getEvaluation(entry) {
    const occupied = state.archiveEntries
      .filter(
        (other) =>
          other.id !== entry.id &&
          normalizeBoxNumber(other.boxNumber) ===
            normalizeBoxNumber(entry.boxNumber),
      )
      .map((other) => normalizeBoxNumber(other.boxNumber))

    return evaluateEntry(entry, occupied)
  }

  // 已存在批次沿用原盒号：锁定记录不允许改写，自动分配也必须跳过
  function setBoxNumber(entryId, value) {
    const entry = state.archiveEntries.find((item) => item.id === entryId)
    if (!entry || entry.locked || entry.status !== ARCHIVE_STATUS.PENDING) {
      return
    }
    entry.boxNumber = String(value ?? '').toUpperCase()
  }

  function togglePieceFlattened(entryId, pieceId) {
    const entry = state.archiveEntries.find((item) => item.id === entryId)
    if (!entry || entry.status !== ARCHIVE_STATUS.PENDING) {
      return
    }
    const piece = entry.pieces.find((item) => item.id === pieceId)
    if (piece) {
      piece.flattened = !piece.flattened
    }
  }

  // 只为盒号空缺的待入盒批次分配可用盒号；已有盒号（含沿用原盒号）一律保留
  function autoAssignBoxes() {
    pendingEntries.value.forEach((entry) => {
      if (entry.locked || normalizeBoxNumber(entry.boxNumber) !== '') {
        return
      }

      const occupied = Array.from(occupiedBoxes.value.keys())
      const suggestion = suggestBoxNumber(entryMaxSize(entry.pieces), occupied)
      if (suggestion) {
        entry.boxNumber = suggestion
        occupied.push(suggestion)
      }
    })
  }

  function stageEntry(entryId) {
    const entry = state.archiveEntries.find((item) => item.id === entryId)
    if (!entry || entry.status !== ARCHIVE_STATUS.PENDING) {
      return
    }
    if (!getEvaluation(entry).canBox) {
      return
    }
    entry.status = ARCHIVE_STATUS.STAGED
    // 入盒后盒号即固定，后续任何自动分配都不得改写
    entry.locked = true
    entry.stagedAt = toStatusDate()
    syncLinkedRecords(entry)
  }

  function archiveEntry(entryId) {
    const entry = state.archiveEntries.find((item) => item.id === entryId)
    if (!entry || entry.status !== ARCHIVE_STATUS.STAGED) {
      return
    }
    entry.status = ARCHIVE_STATUS.ARCHIVED
    entry.archivedAt = toStatusDate()
    syncLinkedRecords(entry)
  }

  return {
    tasks,
    batches,
    entries,
    pendingEntries,
    stagedEntries,
    archivedEntries,
    pendingWithoutBox,
    occupiedBoxes,
    getEvaluation,
    setBoxNumber,
    togglePieceFlattened,
    autoAssignBoxes,
    stageEntry,
    archiveEntry,
  }
}
