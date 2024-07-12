<template>
  <div class="home-body">
    <ul class="infinite-list" style="overflow: auto">
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Password } from '@/types/main'
import { getList } from '@/utils/api'
const list = ref<Password[]>([])
function queryList() {
  let promise = null
  if (list.value.length > 0) {
    promise = getList(list.value[list.value.length - 1].id)
  } else {
    promise = getList()
  }
  promise.then((res) => {
    list.value = list.value.concat(
      res.data.map((item) => {
        return {
          id: item.pId,
          name: item.name,
          username: item.username,
          password: item.password,
          uri: item.uri.split(','),
          fields: item.fields,
          createdAt: item.createTime,
          updatedAt: item.createTime,
          groupId: '',
        }
      }),
    )
  })
}
onMounted(() => {
  queryList()
})
</script>

<style lang="scss" scoped>
.home-body {
  flex: 1;
  padding: 16px 0;
  box-sizing: border-box;

  ul {
    height: 100%;
  }

  li {}
}

.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
