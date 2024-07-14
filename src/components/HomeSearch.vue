<template>
  <div class="home-search">
    <el-input
      class="search-input"
      v-model="queryText"
      :prefix-icon="Search"
      placeholder="搜索密码"
      size="small"
      @keyup.enter="queryList"
    />
    <el-button size="small" type="primary" @click="queryList">搜索</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emits = defineEmits(['search'])
const queryText = ref('')

const queryList = () => {
  emits('search', queryText.value)
}
</script>

<style lang="scss" scoped>
.home-search {
  display: flex;
  padding: 8px 0;
  .search-input {
    flex: 1;
    margin-right: 10px;
  }
}
</style>
