<script setup>
  import AppTopBar from './AppTopBar.vue'
  import AppBreadcrumbs from './AppBreadcrumbs.vue'
</script>

<template>
  <AppTopBar />
  <AppBreadcrumbs />
  <div class="p-4">
    <slot></slot>
  </div>
</template>
