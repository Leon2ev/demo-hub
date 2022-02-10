<script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { SOCKET, PEER_CONNECTION_CONFIG } from '@/config/index'
  import { RTW } from '@/rtw'
  import { useBroadcastAppStore } from '@/web-rtc/broadcast-app/store'

  const props = defineProps({
    serviceParams: Object
  })

  const broadcastAppStore = useBroadcastAppStore()
  const isLocalStream = computed(() => broadcastAppStore.state.isLocalStream)

  const serviceAgentInit = () => {
    const serviceAgent = new RTW(props.serviceParams)

    serviceAgent.receive(({ RTW }) => {
      if (typeof RTW === 'undefined') return
      const { EVENT, SOCKET_ID } = RTW
      switch (EVENT) {
        case 'localStreamInit':
          localStreamInit()
          break
        case 'localStreamStop':
          localStreamStop()
          break
        case 'STREAMREQUEST':
          handleStreamRequest(SOCKET_ID)
      }
    })

    serviceAgent.send({
      event: 'localStreamInit'
    })
  }

  serviceAgentInit()

  const router = useRouter()

  const localStream = ref()
  const peerConnection = ref()

  const localStreamInit = async () => {
    const constraints = {
      video: true,
      audion: true
    }
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia(constraints)
      broadcastAppStore.setIsLocalStream(true)
    } catch (e) {
      console.error(e)
    }
  }

  const localStreamStop = () => {
    if (!isLocalStream.value) return
    localStream.value.getTracks().forEach(track => {
      track.stop();
    })
    broadcastAppStore.setIsLocalStream(false)
  }

  const handleStreamRequest = async id => {
    peerConnection.value = new RTCPeerConnection(PEER_CONNECTION_CONFIG)

    localStream.value.getTracks().forEach(track => {
      peerConnection.value.addTrack(track, localStream.value)
    })

    peerConnection.value.onicecandidate = ({ candidate }) => {
      if (!candidate) return
      SOCKET.emit('candidate', id, candidate)
    }

    try {
      const sessionDescription = await peerConnection.value.createOffer()
      await peerConnection.value.setLocalDescription(sessionDescription)
      SOCKET.emit('offer', id, peerConnection.value.localDescription)
    } catch (e) {
      console.error(e)
    }
  }

  SOCKET.on("answer", description => {
    peerConnection.value.setRemoteDescription(description)
  })

  SOCKET.on("candidate", candidate => {
    peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate))
  })

  router.beforeEach((_to, from) => {
    // Stop stream on leaving the route
    if (from) {
      localStreamStop()
    }
  })

  window.onunload = window.onbeforeunload = () => {
    SOCKET.close()
  }
</script>

<template>
  <video v-if="isLocalStream" :srcObject.prop="localStream" autoplay></video>
</template>