<script setup>
import { archiveStatusMeta, formatSize } from '../../utils/restorationFormatters'

defineProps({
  entries: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['stage', 'restore', 'box'])
</script>

<template>
  <div class="archive-table">
    <div class="archive-row archive-head">
      <span>文献对象</span>
      <span>盒号</span>
      <span>尺寸</span>
      <span>平整</span>
      <span>暂存 / 完成记录</span>
      <span>入盒判定</span>
      <span>操作</span>
    </div>
    <div
      v-for="entry in entries"
      :key="entry.item.id"
      class="archive-row"
    >
      <span class="object-cell">
        <strong>{{ entry.item.title }}</strong>
        <small>批次 {{ entry.item.batchCode }} · 页码 {{ entry.item.pages }}</small>
      </span>
      <span>
        <em v-if="entry.item.boxNo" class="box-no">{{ entry.item.boxNo }}</em>
        <em v-else class="box-no box-no--missing">待分配</em>
      </span>
      <span>{{ formatSize(entry.item.size) }}</span>
      <span>
        <em :class="['flat-pill', entry.item.flattened ? 'flat-pill--ok' : 'flat-pill--wait']">
          {{ entry.item.flattened ? '已平整' : '未平整' }}
        </em>
      </span>
      <span class="record-cell">
        <em :class="['status-pill', `status-pill--${archiveStatusMeta(entry.item.status).tone}`]">
          {{ archiveStatusMeta(entry.item.status).label }}
        </em>
        <small v-if="entry.item.stagedAt">暂存 {{ entry.item.stagedAt }}</small>
        <small v-if="entry.item.completedAt">完成 {{ entry.item.completedAt }}</small>
      </span>
      <span class="verdict-cell">
        <template v-if="entry.item.status === '已入盒'">
          <em class="verdict verdict--done">已完成归档</em>
        </template>
        <template v-else-if="entry.failures.length">
          <em
            v-for="failure in entry.failures"
            :key="failure"
            class="verdict verdict--fail"
          >
            {{ failure }}
          </em>
        </template>
        <em v-else class="verdict verdict--ok">符合入盒标准</em>
      </span>
      <span class="action-cell">
        <template v-if="entry.item.status === '待入盒'">
          <button type="button" class="action" @click="emit('stage', entry.item.id)">
            暂存
          </button>
          <button
            type="button"
            class="action action--primary"
            :disabled="!entry.boxable"
            @click="emit('box', entry.item.id)"
          >
            入盒
          </button>
        </template>
        <template v-else-if="entry.item.status === '暂存'">
          <button type="button" class="action" @click="emit('restore', entry.item.id)">
            退回待入盒
          </button>
          <button
            type="button"
            class="action action--primary"
            :disabled="!entry.boxable"
            @click="emit('box', entry.item.id)"
          >
            入盒
          </button>
        </template>
        <small v-else>已封存</small>
      </span>
    </div>
  </div>
</template>

<style scoped>
.archive-table {
  overflow: hidden;
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 18px;
}

.archive-row {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr 1fr 0.6fr 1.1fr 1.1fr 1.1fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
}

.archive-row + .archive-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.archive-head {
  background: #efe1c6;
  color: #775936;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
}

.object-cell,
.record-cell,
.verdict-cell,
.action-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.object-cell small,
.record-cell small,
.action-cell small {
  color: #8a7150;
}

.box-no {
  font-style: normal;
  font-weight: 600;
}

.box-no--missing {
  color: #a2613a;
  font-weight: 400;
}

.flat-pill,
.status-pill,
.verdict {
  display: inline-flex;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-style: normal;
  white-space: nowrap;
}

.flat-pill--ok {
  background: #d9ead9;
  color: #366338;
}

.flat-pill--wait {
  background: #f6e5b9;
  color: #8b6314;
}

.status-pill--pending {
  background: #f6e5b9;
  color: #8b6314;
}

.status-pill--staged {
  background: #d9e5e0;
  color: #2f5d50;
}

.status-pill--completed {
  background: #d9ead9;
  color: #366338;
}

.verdict--fail {
  background: #efd0c9;
  color: #913d2f;
}

.verdict--ok,
.verdict--done {
  background: #d9ead9;
  color: #366338;
}

.action-cell {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}

.action {
  padding: 7px 12px;
  border: 1px solid rgba(93, 67, 34, 0.35);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #5d4322;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.action--primary {
  background: #5d4322;
  color: #fff8eb;
}

.action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .archive-table {
    overflow-x: auto;
  }

  .archive-row {
    min-width: 1080px;
  }
}
</style>
