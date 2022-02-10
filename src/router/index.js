import { createRouter, createWebHashHistory } from 'vue-router'
import { webRtcRoutes } from '@/web-rtc/routes'
import { useAuthStore } from '@/hive/auth/store'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'AppLayoutAuth'
    }
  },
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