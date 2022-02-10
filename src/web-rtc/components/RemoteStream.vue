<script setup>
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { SOCKET, PEER_CONNECTION_CONFIG } from '@/config/index'
  import { RTW } from '@/rtw'
  import { useAuthStore } from '@/hive/store'
  import { useBroadcastAppStore } from '@/web-rtc/broadcast-app/store'

  const route = useRoute()

  const authStore = useAuthStore()

  const broadcastAppStore = useBroadcastAppStore()
  const isRemoteStream = computed(() => broadcastAppStore.state.isRemoteStream)

  const serviceParams = computed(() => {
    return {
      serviceUrl: 'https://demo.cioty.com/video',
      token: authStore.state.token,
      ghostId: 1
    }
  })

  const cameraMapId = ref(parseInt(route.query.cameraMapId))

  const serviceAgent = new RTW(serviceParams.value)

  serviceAgent.receive(({ RTW }) => {
    if (typeof RTW === 'undefined') return
    cameraMapId.value = RTW.CAMERA_MAP_ID
  })
  
  serviceAgent.send({
    event: 'STREAMREQUEST',
    socket_id: SOCKET.id,
    camera_map_id: cameraMapId.value
  })

  watch(() =>
    cameraMapId.value, (newVal, oldVal) => {
      if (newVal === oldVal) return
      console.log('switch to', cameraMapId.value)
      serviceAgent.send({
        event: 'STREAMREQUEST',
        socket_id: SOCKET.id,
        camera_map_id: cameraMapId.value
      })
    }
  )

  const remoteStream = ref()
  const peerConnection = ref()

  SOCKET.on('offer', async (id, description) => {
    peerConnection.value = new RTCPeerConnection(PEER_CONNECTION_CONFIG)

    peerConnection.value.ontrack = ({ streams }) => {
      remoteStream.value = streams[0]
      broadcastAppStore.setIsRemoteStream(true)
    }

    try {
      await peerConnection.value.setRemoteDescription(description)
      const sessionDescription = await peerConnection.value.createAnswer()
      await peerConnection.value.setLocalDescription(sessionDescription)
      SOCKET.emit('answer', id, peerConnection.value.localDescription)
    } catch (e) {
      console.error(e)
    }

    peerConnection.value.onicecandidate = ({ candidate }) => {
      if (!candidate) return
      SOCKET.emit('candidate', id, candidate)
    }
  })

  const remoteStreamStop = () => {
    if (!isRemoteStream.value) return
    remoteStream.value.getTracks().forEach(track => {
      track.stop()
    })
    broadcastAppStore.setIsRemoteStream(false)
  }

  SOCKET.on('candidate', candidate => {
    peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate))
  })

  const router = useRouter()

  router.beforeEach((_to, from) => {
    // Stop stream on leaving the route
    if (from) {
      remoteStreamStop()
    }
  })

  window.onunload = window.onbeforeunload = () => {
    SOCKET.close()
  }
</script>

<template>
  <video v-if="isRemoteStream" :srcObject.prop="remoteStream" autoplay muted></video>
</template>