<script setup lang="ts">
import { ref } from 'vue'
import HomeHeader from '@/components/HomeHeader.vue'
import HomeBody from '@/components/HomeBody.vue'
import HomeSearch from '@/components/HomeSearch.vue'
import GroupBox from '@/components/GroupBox.vue'

const bodyRef = ref()
const groupId = ref('')
const searchHandle = (queryText: string) => {
  bodyRef.value.setSearchText(queryText)
}
const reload = () => {
  bodyRef.value.reload()
}
</script>

<template>
  <main>
    <HomeHeader />
    <div class="home-box">
      <GroupBox v-model:checked-id="groupId" @import="reload" />
      <div class="main-box">
        <HomeSearch @search="searchHandle" />
        <HomeBody ref="bodyRef" :groupID="groupId" />
      </div>
    </div>
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
@media (min-width: 1000px) {
  main {
    max-width: 1000px;
  }
}

.home-box {
  display: flex;
  flex: 1;
  min-height: 0;
}
.main-box {
  flex: 2;
  display: flex;
  flex-direction: column;
}
</style>
