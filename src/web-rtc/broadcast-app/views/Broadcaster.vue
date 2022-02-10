<script setup>
  import { computed, ref } from 'vue'
  import { useAuthStore, useGhostsStore } from '@/hive/store'
  import LocalStream from '@/web-rtc/components/LocalStream.vue'

  const authStore = useAuthStore()
  const ghostsStore = useGhostsStore()

  const token = computed(() => authStore.state.token)
  const ghosts = computed(() => ghostsStore.state.ghosts)

  const selectedGhost = ref()
  const startStreamClicked = ref(false)
  const cameraServiceGhosts = computed(() => {
    return ghosts.value.filter(ghost => ghost.service === 'camera')
  })

  selectedGhost.value = cameraServiceGhosts.value[0]

  const serviceUrl = computed(() => {
    return `https://${selectedGhost.value.domain}.cioty.com/${selectedGhost.value.service}`
  })

  const streamUrl = computed(() => {
    return `${window.origin}/#?pathName=viewer&cameraMapId=${selectedGhost.value.ghostID}`
  })

  const serviceParams = computed(() => {
    return {
      serviceUrl: serviceUrl.value,
      token: token.value,
      ghostId: selectedGhost.value.ghostID
    }
  })

  const startStream = () => {
    startStreamClicked.value = true
  }
</script>

<template>
  <div v-if="startStreamClicked">
    <div class="flex align-items-center justify-content-center mb-4">
      <InputText v-model="streamUrl" class="w-4" />
    </div>
    <div class="flex align-items-center justify-content-center">
      <LocalStream :service-params="serviceParams" />
    </div>
  </div>
  <div v-else>
    <h5>Select Ghost</h5>
    <Dropdown v-model="selectedGhost" :options="cameraServiceGhosts" optionLabel="ghostID"  placeholder="Select a Ghost" />
    <Button @click="startStream">Start stream</Button>
  </div>
</template>