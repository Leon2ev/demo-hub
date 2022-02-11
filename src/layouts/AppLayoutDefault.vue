<script setup>
  import AppTopBar from '@/components/AppTopBar.vue'
  import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue'
</script>

<template>
  <AppTopBar />
  <AppBreadcrumbs />
  <div class="p-4">
    <slot></slot>
  </div>
</template>
