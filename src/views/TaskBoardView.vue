<script setup>
import { RouterLink } from 'vue-router'

import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { useArchiveStore } from '../composables/useArchiveStore'

const { tasks } = useArchiveStore()
</script>

<template>
  <div class="view-stack">
    <div class="task-toolbar">
      <RouterLink to="/archive" class="archive-link">
        进入无酸盒归档清单 →
      </RouterLink>
    </div>
    <PanelSection title="任务清单" badge="按风险排序">
      <TaskTable :rows="tasks" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 16px;
}

.task-toolbar {
  display: flex;
  justify-content: flex-end;
}

.archive-link {
  padding: 9px 14px;
  border-radius: 12px;
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.86rem;
  text-decoration: none;
}

.archive-link:hover {
  background: #4a3417;
}
</style>
