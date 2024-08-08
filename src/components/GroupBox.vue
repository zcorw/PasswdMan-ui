<template>
  <div class="group-box">
    <div class="button-row">
      <el-dropdown split-button @click="handleChange" @command="handleCommand(1, $event)">
        {{ importText }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in commandList" :key="item.value" :command="item.value">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown split-button @click="handleAdd" @command="handleCommand(2, $event)">
        {{ addText }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in commandList" :key="item.value" :command="item.value">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="group-title">
      <el-icon>
        <Folder />
      </el-icon>
      分组
    </div>
    <el-scrollbar class="group-list">
      <ul>
        <li v-for="item in groupList" :key="item.id" :class="{ checked: item.checked }">
          <el-icon v-if="item.checked" class="checked-icon">
            <Check />
          </el-icon>
          <a @click="selectGroup(item.id)">
            {{ item.title }}
          </a>
          <el-icon v-if="item.checked" class="close-icon" @click="close">
            <Close />
          </el-icon>
        </li>
      </ul>
    </el-scrollbar>
    <PasswdAddDialog ref="addDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, provide } from 'vue'
import { importPasswd, getGroups, importNote } from '@/utils/api'
import { ElMessage } from 'element-plus'
import { Folder, Close, Check } from '@element-plus/icons-vue'
import PasswdAddDialog from '@/components/PasswdAddDialog.vue';
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
const addDialogRef = ref<InstanceType<typeof PasswdAddDialog> | null>(null)
const commandList = [
  { label: '密码', value: 1 },
  { label: '笔记', value: 2 },
]
const importType = ref(1)
const addType = ref(1)
const importText = computed(() => {
  return importType.value === 1 ? '导入密码' : '导入笔记'
})
const addText = computed(() => {
  return addType.value === 1 ? '新增密码' : '新增笔记'
})
provide('groupList', groupList)
const handleChange = () => {
  const element = document.createElement('input')
  element.type = 'file'
  element.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    const request = importType.value === 1 ? importPasswd : importNote
    if (file)
      request(file).then(() => {
        setTimeout(() => {
          emits('import', importType.value)
        }, 1000)
        ElMessage.success('导入成功')
      })
  })
  element.click()
}
const handleAdd = () => {
  addDialogRef.value?.open()
}
const selectGroup = (id: string) => {
  emits('update:checkedId', id)
}
const close = () => {
  emits('update:checkedId', '')
}
const handleCommand = (type: number, command: number) => {
  if (type === 1) {
    importType.value = command
  } else {
    addType.value = command
  }
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

@media only screen and (max-width: 912px) {
  .group-box {
    display: none;
  }
}

.button-row {
  .el-dropdown {
    margin-right: 10px;
  }
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
