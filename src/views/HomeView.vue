<script setup lang="ts">
import { ref } from 'vue'
import HomeHeader from '@/components/HomeHeader.vue'
import HomeBody from '@/components/HomeBody.vue'
import HomeSearch from '@/components/HomeSearch.vue'
import GroupBox from '@/components/GroupBox.vue'
import NoteBody from '@/components/NoteBody.vue'

const bodyRef = ref()
const noteRef = ref()
const groupId = ref('')
const tabRef = ref(1)
const searchHandle = (queryText: string) => {
  bodyRef.value.setSearchText(queryText)
}
const reload = () => {
  bodyRef.value.reload()
}
// 标签页切换
const tabChange = (type: number) => {
  tabRef.value = type
}
</script>

<template>
  <main>
    <HomeHeader />
    <div class="home-box">
      <GroupBox v-model:checked-id="groupId" @import="reload" />
      <div class="main-box">
        <HomeSearch @search="searchHandle" />
        <div class="tabs-container">
          <div class="tab-item" @click="tabChange(1)">
            密码
          </div>
          <div class="tab-item" @click="tabChange(2)">
            笔记
          </div>
        </div>
        <HomeBody ref="bodyRef" v-if="tabRef === 1" :groupID="groupId" />
        <NoteBody ref="noteRef" v-else :groupID="groupId" />
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

.tabs-container {
  display: flex;

  .tab-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
  }
}
</style>
