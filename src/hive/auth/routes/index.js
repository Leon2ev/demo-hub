import Login from '@/hive/auth/views/Login.vue'

export const hiveAuthRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'AppLayoutAuth'
    }
  }
]