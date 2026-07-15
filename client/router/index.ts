import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/analyze',
      name: 'analyzer',
      component: () => import('@/views/AnalyzerPage.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router