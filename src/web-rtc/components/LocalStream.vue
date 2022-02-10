<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SOCKET, PEER_CONNECTION_CONFIG } from '@/config/index'
import { RTW } from '@/rtw'

const props = defineProps({
  serviceParams: Object
})

const localStream = ref()
const peerConnections = ref({})

const serviceAgent = new RTW(props.serviceParams)

serviceAgent.receive(({ RTW }) => {
  if (typeof RTW === 'undefined') return
  const { EVENT, SOCKET_ID } = RTW
  console.log(EVENT)
  switch (EVENT) {
    case 'STREAMREQUEST':
      handleStreamRequest(SOCKET_ID)
      break
    case 'DISCONNECTED':
      console.log('disc')
      handleDisconnectedPeer(SOCKET_ID)
      break
  }
})

const handleStreamRequest = async id => {
  const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG)
  peerConnections.value[id] = peerConnection
  console.log(peerConnections.value)
  localStream.value.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream.value)
  })

  peerConnection.onicecandidate = ({ candidate }) => {
    if (!candidate) return
    SOCKET.emit('candidate', id, candidate)
  }

  try {
    const sessionDescription = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(sessionDescription)
    SOCKET.emit('offer', id, peerConnection.localDescription)
  } catch (e) {
    console.error(e)
  }
}

const handleDisconnectedPeer = id => {
  console.log(id)
  peerConnections.value[id].close()
  delete peerConnections.value[id]
  console.log(peerConnections.value)
}

const localStreamInit = async () => {
  const constraints = {
    video: true,
    audion: true
  }
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia(constraints)
  } catch (e) {
    console.error(e)
  }
}

const localStreamStop = () => {
  localStream.value.getTracks().forEach(track => {
    track.stop();
  })
}

SOCKET.on("answer", (id, description) => {
  peerConnections.value[id].setRemoteDescription(description)
})

SOCKET.on("candidate", (id, candidate) => {
  peerConnections.value[id].addIceCandidate(new RTCIceCandidate(candidate))
})

window.onbeforeunload = () => {
  SOCKET.close()
}

const router = useRouter()
router.beforeEach((_to, from) => {
  if (from.name === 'broadcaster') localStreamStop()
})

localStreamInit()
</script>

<template>
  <video :srcObject.prop="localStream" autoplay></video>
</template>