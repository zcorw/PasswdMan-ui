<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue'
import HomeBody from '@/components/HomeBody.vue'
import { importPasswd, getList } from '@/utils/api'
const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  console.log(file)
  if (file) importPasswd(file)
}
</script>

<template>
  <main>
    <HomeHeader />
    <HomeBody />
  </main>
</template>

<style lang="scss">
main {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
