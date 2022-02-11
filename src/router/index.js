import { createRouter, createWebHashHistory } from 'vue-router'
import { hiveRoutes } from '@/hive/routes'
import { webRtcRoutes } from '@/web-rtc/routes'
import { useAuthStore } from '@/hive/auth/store'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  ...hiveRoutes,
  ...webRtcRoutes
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.name !== 'login' && !authStore.isAuthenticated) {
    next({ name: 'login', query: to.query })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else next()
})