<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SOCKET, PEER_CONNECTION_CONFIG } from '@/config/index'
import { RTW } from '@/rtw'
import { useAuthStore } from '@/hive/store'

const route = useRoute()

const cameraMapId = ref(parseInt(route.query.cameraMapId))

const authStore = useAuthStore()

const serviceParams = computed(() => {
  return {
    serviceUrl: 'https://demo.cioty.com/video',
    token: authStore.state.token,
    ghostId: 1
  }
})

const serviceAgent = new RTW(serviceParams.value)

serviceAgent.receive(({ RTW }) => {
  if (typeof RTW === 'undefined') return
  cameraMapId.value = RTW.CAMERA_MAP_ID
})

const sendStreamRequest = () => {
  serviceAgent.send({
    event: 'STREAMREQUEST',
    socket_id: SOCKET.id,
    camera_map_id: cameraMapId.value
  })
}

const sendDisconnected = () => {
  serviceAgent.send({
    event: 'DISCONNECTED',
    socket_id: SOCKET.id,
    camera_map_id: cameraMapId.value
  })
}

watch(() =>
  cameraMapId.value, (newVal, oldVal) => {
    if (newVal === oldVal) return
    console.log('switch to', cameraMapId.value)
    sendStreamRequest()
  }
)

const remoteStream = ref()
const peerConnection = ref()

SOCKET.on('offer', async (id, description) => {
  peerConnection.value = new RTCPeerConnection(PEER_CONNECTION_CONFIG)

  peerConnection.value.ontrack = ({ streams }) => {
    remoteStream.value = streams[0]
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

SOCKET.on('candidate', (id, candidate) => {
  peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate))
})

window.onbeforeunload = () => {
  sendDisconnected()
  SOCKET.close()
  peerConnection.value.close()
}

const router = useRouter()
router.beforeEach((_to, from) => {
  if (from.name === 'viewer') localStreamStop()
})

sendStreamRequest()
</script>

<template>
  <video :srcObject.prop="remoteStream" autoplay muted></video>
</template>