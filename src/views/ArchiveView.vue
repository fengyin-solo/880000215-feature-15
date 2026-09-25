<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import PanelSection from '../components/common/PanelSection.vue'
import ArchivePendingPanel from '../components/restoration/ArchivePendingPanel.vue'
import ArchiveRecordTable from '../components/restoration/ArchiveRecordTable.vue'
import { useArchiveStore } from '../composables/useArchiveStore'

const {
  pendingEntries,
  stagedEntries,
  archivedEntries,
  pendingWithoutBox,
  autoAssignBoxes,
} = useArchiveStore()

const pendingPieces = computed(() =>
  pendingEntries.value.reduce((total, entry) => total + entry.pieces.length, 0),
)

const flattenedPieces = computed(() =>
  pendingEntries.value.reduce(
    (total, entry) =>
      total + entry.pieces.filter((piece) => piece.flattened).length,
    0,
  ),
)
</script>

<template>
  <div class="view-stack">
    <header class="archive-header">
      <RouterLink to="/tasks" class="back-link">← 返回任务清单</RouterLink>
      <p class="archive-intro">
        归档前批次按文献对象、盒号和尺寸生成待入盒列表；存在盒号重号、尺寸超过盒位上限或整批尚未平整的情况时不可入盒。
        已存在批次沿用原盒号，不会被自动分配改写。
      </p>
    </header>

    <PanelSection
      title="待入盒列表"
      :badge="`${pendingEntries.length} 批待入盒`"
    >
      <div class="toolbar">
        <div class="summary-chips">
          <span class="summary-chip">
            待入盒 <strong>{{ pendingEntries.length }}</strong> 批 /
            {{ pendingPieces }} 件
          </span>
          <span class="summary-chip">
            已平整 <strong>{{ flattenedPieces }}</strong> / {{ pendingPieces }} 件
          </span>
          <span class="summary-chip summary-chip--warn">
            待分配盒号 <strong>{{ pendingWithoutBox }}</strong> 批
          </span>
          <span class="summary-chip">
            暂存 <strong>{{ stagedEntries.length }}</strong> 批
          </span>
          <span class="summary-chip">
            已封存 <strong>{{ archivedEntries.length }}</strong> 批
          </span>
        </div>
        <button
          type="button"
          class="assign-button"
          :disabled="pendingWithoutBox === 0"
          @click="autoAssignBoxes"
        >
          自动分配空余盒号
        </button>
      </div>
      <p class="toolbar-hint">
        自动分配仅补填空缺盒号，已填写盒号及已存在批次的原盒号保持不变。
      </p>
      <ArchivePendingPanel />
    </PanelSection>

    <PanelSection
      title="无酸盒暂存"
      :badge="`${stagedEntries.length} 批暂存中`"
    >
      <ArchiveRecordTable mode="staged" />
    </PanelSection>

    <PanelSection
      title="已完成入盒"
      :badge="`${archivedEntries.length} 批已封存`"
    >
      <ArchiveRecordTable mode="archived" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 24px;
}

.archive-header {
  display: grid;
  gap: 10px;
}

.back-link {
  color: #7e6038;
  text-decoration: none;
  font-size: 0.88rem;
}

.back-link:hover {
  color: #5d4322;
  text-decoration: underline;
}

.archive-intro {
  margin: 0;
  max-width: 60rem;
  color: #5f4c33;
  font-size: 0.94rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.summary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-chip {
  padding: 7px 12px;
  border-radius: 999px;
  background: #f1e8d6;
  color: #6a5439;
  font-size: 0.82rem;
}

.summary-chip strong {
  font-size: 0.95rem;
  color: #4a3520;
}

.summary-chip--warn {
  background: #f6e5b9;
  color: #8b6314;
}

.assign-button {
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  font-size: 0.86rem;
  cursor: pointer;
}

.assign-button:disabled {
  background: #b9a98e;
  cursor: not-allowed;
}

.toolbar-hint {
  margin: 0 0 14px;
  color: #82684b;
  font-size: 0.78rem;
}
</style>
