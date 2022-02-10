<script setup>
</script>

<template>
  <h1>Broadcast App</h1>
  <p>
    One-to-many audio/video streams using Web RTC. Synx Hive is 
    used as an authorization layer and is needed to initiate the 
    connection.
  </p>
  <p>
    
  </p>
  <router-link :to="{ name: 'broadcaster' }">
    <Button>Start Broadcast</Button>
  </router-link>
</template>