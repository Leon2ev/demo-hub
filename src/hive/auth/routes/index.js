import Login from '@/hive/auth/views/Login.vue'
import AuthLayout from '@/hive/auth/layouts/AuthLayout.vue'

export const hiveAuthRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: AuthLayout
    }
  }
]