<script setup>
  import { useAuthStore, useGhostsStore } from '@/hive/store'

  const authStore = useAuthStore()
  const ghostsStore = useGhostsStore()

  ghostsStore.getGhosts(authStore.state.token)
</script>

<template>
  <h1>Hive App Market</h1>
  <router-link :to="{ name: 'broadcastApp' }">
    <Button>Broadcast App</Button>
  </router-link>
</template>