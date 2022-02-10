<script setup>
  import { watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/hive/store'
  import AppLayout from '@/layouts/AppLayout.vue'
  import { isEmpty } from '@/utils/lang.js'

  const router = useRouter()
  const route = useRoute()
  
  const authStore = useAuthStore()
  watch(() => 
    authStore.isAuthenticated, (newVal, oldVal) => {
      if (newVal || oldVal) {
        if (isEmpty(route.query)) {
          return router.push({ name: 'home' })
        }
        const path = {
          name: route.query.pathName,
          query: {
            cameraMapId: route.query.cameraMapId
          }
        }
        router.push(path)
      }
    },
    { deep: true }
  )
</script>

<template>
  <AppLayout />
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  background-color: var(--surface-b);
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
}
</style>
