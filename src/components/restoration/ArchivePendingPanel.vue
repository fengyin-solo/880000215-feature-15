<script setup>
import { computed } from 'vue'

import { acidFreeBoxSpecs } from '../../data/restorationData'
import { useArchiveStore } from '../../composables/useArchiveStore'

const {
  pendingEntries,
  occupiedBoxes,
  getEvaluation,
  setBoxNumber,
  togglePieceFlattened,
  autoAssignBoxes,
  stageEntry,
} = useArchiveStore()

const boxNumberOptions = computed(() =>
  acidFreeBoxSpecs.flatMap((spec) =>
    Array.from({ length: 9 }, (_, index) => {
      const serial = String(index + 1).padStart(2, '0')
      return {
        value: `AF-${spec.type}-${serial}`,
        hint: `${spec.label} ${spec.maxWidth}×${spec.maxHeight}mm`,
      }
    }),
  ),
)

function decorated(entry) {
  const evaluation = getEvaluation(entry)
  const box = entry.boxNumber.trim().toUpperCase()
  const occupants = box && occupiedBoxes.value.has(box)
    ? occupiedBoxes.value
        .get(box)
        .filter((other) => other.id !== entry.id)
        .map((other) => other.title)
    : []
  return { entry, evaluation, occupants }
}

const decoratedEntries = computed(() =>
  pendingEntries.value.map((entry) => decorated(entry)),
)

function flatCount(entry) {
  return entry.pieces.filter((piece) => piece.flattened).length
}
</script>

<template>
  <div class="pending-table">
    <div class="pending-row pending-head">
      <span>文献对象（批次）</span>
      <span>盒号</span>
      <span>尺寸</span>
      <span>平整情况</span>
      <span>入盒标准判定</span>
      <span>操作</span>
    </div>

    <p v-if="pendingEntries.length === 0" class="empty-hint">
      暂无待入盒对象，全部批次均已暂存或归档。
    </p>

    <article
      v-for="item in decoratedEntries"
      :key="item.entry.id"
      class="pending-row pending-card"
      :class="{ 'pending-card--ready': item.evaluation.canBox }"
    >
      <div class="cell-object">
        <strong>{{ item.entry.title }}</strong>
        <small>批次 {{ item.entry.batchCode }} · 共 {{ item.entry.pieces.length }} 件</small>
      </div>

      <div class="cell-box">
        <input
          class="box-input"
          :value="item.entry.boxNumber"
          list="acid-free-box-options"
          placeholder="AF-Z-01"
          spellcheck="false"
          @input="setBoxNumber(item.entry.id, $event.target.value)"
        />
        <small v-if="item.occupants.length" class="box-warning">
          重号：已分配给「{{ item.occupants.join('、') }}」
        </small>
      </div>

      <div class="cell-size">
        <span>{{ item.evaluation.size.width }} × {{ item.evaluation.size.height }} mm</span>
        <small v-if="item.evaluation.spec" :class="item.evaluation.checks[3].passed ? 'size-ok' : 'size-bad'">
          {{ item.evaluation.spec.label }}上限
          {{ item.evaluation.spec.maxWidth }} × {{ item.evaluation.spec.maxHeight }}
        </small>
        <small v-else class="size-bad">盒型未知</small>
      </div>

      <div class="cell-flat">
        <span :class="['flat-count', { 'flat-count--done': flatCount(item.entry) === item.entry.pieces.length }]">
          {{ flatCount(item.entry) }}/{{ item.entry.pieces.length }} 已平整
        </span>
        <div class="piece-chips">
          <button
            v-for="piece in item.entry.pieces"
            :key="piece.id"
            type="button"
            class="piece-chip"
            :class="{ 'piece-chip--unflat': !piece.flattened }"
            :title="piece.flattened ? `${piece.label}已平整，点击标记未平整` : `${piece.label}尚未平整，点击标记已平整`"
            @click="togglePieceFlattened(item.entry.id, piece.id)"
          >
            {{ piece.label }}
          </button>
        </div>
      </div>

      <div class="cell-criteria">
        <ul class="criteria-list">
          <li
            v-for="check in item.evaluation.checks"
            :key="check.code"
            :class="check.passed ? 'criteria--pass' : 'criteria--fail'"
          >
            <span class="criteria-mark">{{ check.passed ? '✓' : '✕' }}</span>
            <div>
              <strong>{{ check.label }}</strong>
              <small v-if="!check.passed">{{ check.detail }}</small>
            </div>
          </li>
        </ul>
      </div>

      <div class="cell-action">
        <button
          type="button"
          class="stage-button"
          :disabled="!item.evaluation.canBox"
          @click="stageEntry(item.entry.id)"
        >
          入盒暂存
        </button>
        <small v-if="!item.evaluation.canBox">
          尚有 {{ item.evaluation.failedChecks.length }} 项未达标
        </small>
      </div>
    </article>

    <datalist id="acid-free-box-options">
      <option
        v-for="option in boxNumberOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.hint }}
      </option>
    </datalist>
  </div>
</template>

<style scoped>
.pending-table {
  overflow: hidden;
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 18px;
}

.pending-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 0.9fr 1.1fr 1.5fr 0.8fr;
  gap: 12px;
  align-items: start;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
}

.pending-row + .pending-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.pending-head {
  align-items: center;
  background: #efe1c6;
  color: #775936;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
}

.pending-card--ready {
  background: rgba(239, 245, 234, 0.85);
}

.empty-hint {
  margin: 0;
  padding: 24px 16px;
  text-align: center;
  color: #6a5439;
  background: rgba(255, 255, 255, 0.72);
}

.cell-object strong,
.cell-size span,
.flat-count {
  display: block;
}

.cell-object small {
  display: block;
  margin-top: 4px;
  color: #82684b;
}

.box-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(79, 57, 32, 0.22);
  border-radius: 10px;
  background: #fffdf8;
  font: inherit;
  font-size: 0.86rem;
  letter-spacing: 0.04em;
  color: #2d2418;
}

.box-input:focus {
  outline: 2px solid rgba(121, 88, 47, 0.35);
  border-color: rgba(121, 88, 47, 0.5);
}

.box-warning {
  display: block;
  margin-top: 6px;
  color: #913d2f;
  font-size: 0.74rem;
}

.cell-size small {
  display: block;
  margin-top: 4px;
  font-size: 0.74rem;
}

.size-ok {
  color: #366338;
}

.size-bad {
  color: #913d2f;
}

.flat-count {
  font-size: 0.84rem;
}

.flat-count--done {
  color: #366338;
}

.piece-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.piece-chip {
  padding: 4px 8px;
  border: 1px solid rgba(54, 99, 56, 0.3);
  border-radius: 999px;
  background: #e6f0e2;
  color: #366338;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}

.piece-chip--unflat {
  border-color: rgba(145, 61, 47, 0.35);
  background: #efd0c9;
  color: #913d2f;
}

.criteria-list {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.criteria-list li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 0.8rem;
}

.criteria-mark {
  flex: none;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.68rem;
  font-weight: 700;
}

.criteria--pass {
  color: #366338;
}

.criteria--pass .criteria-mark {
  background: #cfe0c9;
}

.criteria--fail {
  color: #913d2f;
}

.criteria--fail .criteria-mark {
  background: #efd0c9;
}

.criteria-list strong {
  font-weight: 600;
}

.criteria-list small {
  display: block;
  font-size: 0.72rem;
  line-height: 1.35;
}

.cell-action {
  display: grid;
  gap: 8px;
}

.stage-button {
  padding: 9px 12px;
  border: none;
  border-radius: 12px;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  font-size: 0.84rem;
  cursor: pointer;
}

.stage-button:disabled {
  background: #b9a98e;
  cursor: not-allowed;
}

.cell-action small {
  color: #913d2f;
  font-size: 0.72rem;
}

@media (max-width: 1200px) {
  .pending-table {
    overflow-x: auto;
  }

  .pending-row {
    min-width: 1080px;
  }
}
</style>
