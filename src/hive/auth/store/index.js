import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { SYNX_HIVE_API } from '@/config'

export const useAuthStore = defineStore('user-auth', () => {
  const initialState = reactive({
    username: null,
    token: null
  })

  const state = reactive({ ...initialState })

  const isAuthenticated = computed(() => state.token ? true : false)

  const setUsername = value => {
    state.username = value
    sessionStorage.setItem('username', value)
  }

  const setToken = value => {
    state.token = value
    sessionStorage.setItem('token', value)
  }

  const resetState = () => {
    state.value = Object.assign(state, initialState)
  }

  const login = async ({ username, password }) => {
    try {
      const res = await fetch(`${SYNX_HIVE_API}/api/synxpass/get-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const { token } = await res.json()

      if (typeof token === 'undefined') return
      
      setUsername(username)
      setToken(token)
    } catch (e) {
      console.error(e)
    }
  }

  const logout = () => {
    resetState()
    sessionStorage.clear()
  }

  return {
    state,
    isAuthenticated,
    setUsername,
    setToken,
    login,
    logout
  }
})