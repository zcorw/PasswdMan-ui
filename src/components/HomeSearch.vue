<template>
  <div class="home-search">
    <el-input class="search-input" v-model="queryText" :prefix-icon="Search" :placeholder="placeholderText" size="small"
      @keyup.enter="queryList" />
    <el-button size="small" type="primary" @click="queryList">搜索</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  type: number
}>()
const emits = defineEmits(['search'])
const queryText = ref('')
const placeholderText = computed(() => {
  return props.type === 1 ? '搜索密码' : '搜索笔记'
})
const queryList = () => {
  emits('search', queryText.value)
}
const clear = () => {
  queryText.value = ''
}
defineExpose({ clear })
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
