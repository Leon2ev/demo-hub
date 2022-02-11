<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import AppLayoutDefault from './AppLayoutDefault.vue'

  const route = useRoute()
  const layout = computed(() => route.meta.layout || AppLayoutDefault)
</script>

<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>
