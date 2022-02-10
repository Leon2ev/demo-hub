<script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '@/hive/auth/store'

  const authStore = useAuthStore()

  const userCreadentials = reactive({
    username: null,
    password: null
  })

  const login = async () => {
    authStore.login(userCreadentials)
  }
</script>

<template>
  <form @submit.prevent="login">
    <div class="formgroup-inline">
      <div class="field">
        <label for="email" class="p-sr-only">Email</label>
        <InputText v-model="userCreadentials.username" id="email" type="text" placeholder="Email" />
      </div>
      <div class="field">
        <label for="password" class="p-sr-only">Password</label>
        <Password v-model="userCreadentials.password" id="password" type="password" placeholder="Password" :feedback="false" />
      </div>
      <Button type="submit" value="Submit">Login</Button>
    </div>
  </form>
</template>