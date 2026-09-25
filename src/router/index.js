import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import BatchLibraryView from '../views/BatchLibraryView.vue'
import TaskBoardView from '../views/TaskBoardView.vue'
import ArchiveView from '../views/ArchiveView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/batches',
    name: 'batches',
    component: BatchLibraryView,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskBoardView,
  },
  {
    path: '/archive',
    name: 'archive',
    component: ArchiveView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
