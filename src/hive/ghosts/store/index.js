import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { SYNX_HIVE_API } from '@/config'

export const useGhostsStore = defineStore('ghosts', () => {
  const initialState = reactive({
    ghosts: []
  })

  const state = reactive({ ...initialState })

  const resetState = () => {
    state.value = Object.assign(state, initialState)
  }

  const getGhosts = async token => {
    const data = {
      url: "https://demo.cioty.com/",
      token
    }
    const res = await fetch(`${SYNX_HIVE_API}/api/ghosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    state.ghosts = await res.json()
  }

  return {
    state,
    resetState,
    getGhosts
  }
})