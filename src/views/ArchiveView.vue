<script setup>
import PanelSection from '../components/common/PanelSection.vue'
import ArchiveChecklist from '../components/restoration/ArchiveChecklist.vue'
import { useRestorationStore } from '../composables/useRestorationStore'
import { BOXING_RULES } from '../utils/archiveStandards'

const {
  boxLimit,
  archiveEntries,
  archiveStats,
  missingBoxNoCount,
  stageItem,
  restoreItem,
  boxItem,
  assignMissingBoxNumbers,
} = useRestorationStore()
</script>

<template>
  <div class="view-stack">
    <PanelSection title="无酸盒归档清单" badge="归档前">
      <div class="archive-toolbar">
        <ul class="stat-chips">
          <li>待入盒 {{ archiveStats.pending }}</li>
          <li>暂存 {{ archiveStats.staged }}</li>
          <li>已入盒 {{ archiveStats.completed }}</li>
        </ul>
        <div class="toolbar-side">
          <small>
            盒位上限：长 {{ boxLimit.length }} × 宽 {{ boxLimit.width }} × 厚
            {{ boxLimit.thickness }} cm
          </small>
          <button
            type="button"
            class="assign"
            :disabled="missingBoxNoCount === 0"
            @click="assignMissingBoxNumbers"
          >
            自动分配盒号（缺 {{ missingBoxNoCount }} 个）
          </button>
          <RouterLink to="/tasks" class="back-link">返回任务清单</RouterLink>
        </div>
      </div>
      <p class="assign-note">
        自动分配只补齐缺失盒号；已存在批次沿用原盒号，不会被改写。
      </p>
      <ArchiveChecklist
        :entries="archiveEntries"
        @stage="stageItem"
        @restore="restoreItem"
        @box="boxItem"
      />
    </PanelSection>

    <PanelSection title="入盒标准" badge="逐条判定">
      <ol class="rule-list">
        <li v-for="rule in BOXING_RULES" :key="rule.key">{{ rule.label }}</li>
      </ol>
      <p class="rule-note">
        存在未满足条件的对象不允许入盒，未满足项会在清单「入盒判定」列标出。
      </p>
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 24px;
}

.archive-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.stat-chips {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stat-chips li {
  padding: 7px 12px;
  border-radius: 999px;
  background: #efe2ca;
  color: #7e6038;
  font-size: 0.82rem;
}

.toolbar-side {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #6a5439;
}

.assign {
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  font-size: 0.84rem;
  cursor: pointer;
}

.assign:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.back-link {
  font-size: 0.84rem;
  color: #5d4322;
}

.assign-note {
  margin: 0 0 16px;
  color: #8a7150;
  font-size: 0.82rem;
}

.rule-list {
  margin: 0;
  padding-left: 20px;
  color: #5c4a33;
}

.rule-list li + li {
  margin-top: 10px;
}

.rule-note {
  margin: 14px 0 0;
  color: #8a7150;
  font-size: 0.84rem;
}
</style>
