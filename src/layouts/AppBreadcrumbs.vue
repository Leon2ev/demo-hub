<script setup>
  import { reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  const home = reactive({
    icon: 'pi pi-home',
    to: {
      name: 'home'
    }
  })
  const route = useRoute()
  const items = computed(() => route.meta.breadcrumb ? [...route.meta.breadcrumb] : [])
</script>

<template>
  <Breadcrumb class="mx-4" :home="home" :model="items" />
</template>