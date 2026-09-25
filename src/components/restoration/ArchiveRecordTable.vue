<script setup>
import { computed } from 'vue'

import { useArchiveStore } from '../../composables/useArchiveStore'
import { formatDateTime } from '../../utils/restorationFormatters'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['staged', 'archived'].includes(value),
  },
})

const { stagedEntries, archivedEntries, archiveEntry } = useArchiveStore()

const rows = computed(() =>
  props.mode === 'staged' ? stagedEntries.value : archivedEntries.value,
)

const emptyHint = computed(() =>
  props.mode === 'staged'
    ? '暂存区暂无批次。'
    : '尚无完成入盒封存的批次。',
)
</script>

<template>
  <div :class="['record-table', `record-table--${mode}`]">
    <div class="record-row record-head">
      <span>文献对象（批次）</span>
      <span>盒号</span>
      <span>件数 / 尺寸</span>
      <span>{{ mode === 'staged' ? '暂存时间' : '封存时间' }}</span>
      <span v-if="mode === 'staged'">操作</span>
    </div>

    <p v-if="rows.length === 0" class="empty-hint">{{ emptyHint }}</p>

    <div v-for="entry in rows" :key="entry.id" class="record-row">
      <div>
        <strong>{{ entry.title }}</strong>
        <small>批次 {{ entry.batchCode }}</small>
      </div>
      <div class="record-box">
        <span class="locked-box">
          🔒 {{ entry.boxNumber }}
        </span>
        <small>盒号已锁定，不参与自动改写</small>
      </div>
      <div class="record-meta">
        <span>{{ entry.pieces.length }} 件</span>
        <small>
          {{ Math.max(...entry.pieces.map((piece) => piece.width)) }} ×
          {{ Math.max(...entry.pieces.map((piece) => piece.height)) }} mm
        </small>
      </div>
      <div class="record-time">
        <span>{{ formatDateTime(entry.stagedAt) }}</span>
        <small v-if="mode === 'archived'">
          封存于 {{ formatDateTime(entry.archivedAt) }}
        </small>
      </div>
      <div v-if="mode === 'staged'">
        <button
          type="button"
          class="archive-button"
          @click="archiveEntry(entry.id)"
        >
          确认封存
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.record-table {
  overflow: hidden;
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 18px;
}

.record-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.9fr 1.4fr 0.8fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
}

.record-table--archived .record-row {
  grid-template-columns: 1.3fr 1.1fr 1fr 1.6fr;
}

.record-row + .record-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.record-head {
  background: #efe1c6;
  color: #775936;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
}

.record-row > div strong,
.record-row > div span {
  display: block;
}

.record-row small {
  display: block;
  margin-top: 4px;
  color: #82684b;
  font-size: 0.76rem;
}

.locked-box {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;
  background: #e4ddcd;
  color: #5d4322;
  font-size: 0.84rem;
  letter-spacing: 0.04em;
}

.archive-button {
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  background: #3f5d3a;
  color: #f3f7ee;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.archive-button:hover {
  background: #334c2f;
}

.empty-hint {
  margin: 0;
  padding: 20px 16px;
  text-align: center;
  color: #6a5439;
  background: rgba(255, 255, 255, 0.72);
}

@media (max-width: 960px) {
  .record-table {
    overflow-x: auto;
  }

  .record-row {
    min-width: 760px;
  }
}
</style>
