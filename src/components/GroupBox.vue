<template>
  <div class="group-box">
    <el-button @click="handleChange">导入密码</el-button>
    <div class="group-title">
      <el-icon><Folder /></el-icon>
      分组
    </div>
    <el-scrollbar class="group-list">
      <ul>
        <li v-for="item in groupList" :key="item.id" :class="{ checked: item.checked }">
          <el-icon v-if="item.checked" class="checked-icon"><Check /></el-icon>
          <a @click="selectGroup(item.id)">
            {{ item.title }}
          </a>
          <el-icon v-if="item.checked" class="close-icon" @click="close"><Close /></el-icon>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { importPasswd, getGroups } from '@/utils/api'
import { ElMessage } from 'element-plus'
import { Folder, Close, Check } from '@element-plus/icons-vue'
import type { Group } from '@/types/main'
const props = defineProps<{
  checkedId: string
}>()
const emits = defineEmits(['import', 'update:checkedId'])
const groupData = ref<Pick<Group, 'id' | 'title'>[]>([])
const groupList = computed<Group[]>(() => {
  return groupData.value.map((item) => ({
    ...item,
    checked: item.id === props.checkedId,
  }))
})
const handleChange = () => {
  const element = document.createElement('input')
  element.type = 'file'
  element.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file)
      importPasswd(file).then(() => {
        setTimeout(() => {
          emits('import')
        }, 1000)
        ElMessage.success('导入成功')
      })
  })
  element.click()
}
const selectGroup = (id: string) => {
  emits('update:checkedId', id)
}
const close = () => {
  emits('update:checkedId', '')
}
onMounted(() => {
  getGroups().then((data) => {
    groupData.value = data.map((item) => ({
      id: item.id,
      title: item.title,
    }))
  })
})
</script>

<style lang="scss" scoped>
.group-box {
  flex: 1;
  background-color: #f0f2f5;
  margin-right: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.group-title {
  margin-top: 20px;
  font-size: var(--el-font-size-large);
}
.group-list {
  margin-top: 10px;
  flex: 1;
  min-height: 0;
  ul {
    list-style: none;
    height: 100%;
    padding-left: 0;
    li {
      line-height: 30px;
      position: relative;
      &.checked {
        border-bottom: var(--vt-c-divider-light-1) 1px solid;
        padding-left: 18px;
      }
      .checked-icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .close-icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
    a {
      cursor: pointer;
    }
  }
}
</style>
