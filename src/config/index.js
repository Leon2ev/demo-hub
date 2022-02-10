import { io } from "socket.io-client"

export const SYNX_HIVE_API = import.meta.env.VITE_SYNX_HIVE_API

export const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'http://localhost:4000'

export const SOCKET = io(SIGNALING_SERVER_URL)

export const PEER_CONNECTION_CONFIG = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
}