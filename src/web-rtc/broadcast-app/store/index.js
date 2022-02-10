import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useBroadcastAppStore = defineStore('broadcast-app', () => {
  const initialState = reactive({
    isLocalStream: null,
    isRemoteStream: null
  })

  const state = reactive({ ...initialState })

  const setIsLocalStream = value => {
    state.isLocalStream = value
  }

  const setIsRemoteStream = value => {
    state.isRemoteStream = value
  }

  const resetState = () => {
    state.value = Object.assign(state, initialState)
  }

  return {
    state,
    setIsLocalStream,
    setIsRemoteStream,
    resetState
  }
})