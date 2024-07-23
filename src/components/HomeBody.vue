<template>
  <div class="home-body">
    <el-scrollbar>
      <ul v-infinite-scroll="queryList" :infinite-scroll-disabled="disabledQuery" :infinite-scroll-immediate="false"
        class="infinite-list">
        <li v-for="item in list" :key="item.id">
          <div class="password-item">
            <div class="info-block">
              <span class="main-line">{{ item.name }}</span>
              <span class="secondary-line">{{ item.username }}</span>
            </div>
            <div class="action-block">
              <el-button @click="copyContent(item.username)">用户名</el-button>
              <el-button @click="copyContent(item.password)">密码</el-button>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Password } from '@/types/main'
import type { PasswordParams } from '@/types/api'
import { getList } from '@/utils/api'
const props = defineProps<{
  groupID: string
}>()
const list = ref<Password[]>([])
const disabledQuery = ref(false)
const queryText = ref('')
watch(
  () => props.groupID,
  () => {
    list.value = []
    queryList()
  },
)
function queryList() {
  let params: PasswordParams = {
    text: queryText.value,
  }
  if (list.value.length > 0) {
    params.id = list.value[list.value.length - 1].id
  }
  if (props.groupID) {
    params.groupId = props.groupID
  }
  getList(params).then((res) => {
    list.value = list.value.concat(
      res.data.map((item) => {
        return {
          id: item.pId,
          name: item.name,
          username: item.username,
          password: item.password,
          uri: item.uri?.split(','),
          fields: item.fields,
          createdAt: item.createTime,
          updatedAt: item.createTime,
          groupId: '',
        }
      }),
    )
    if (list.value.length >= res.total) {
      disabledQuery.value = true
    }
  })
}
async function copyContent(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
function setSearchText(text: string) {
  queryText.value = text
  list.value = []
  queryList()
}
function reload() {
  setSearchText('')
}
onMounted(() => {
  queryList()
})
defineExpose({ setSearchText, reload })
</script>

<style lang="scss" scoped>
.home-body {
  flex: 1;
  padding: 16px 0;
  box-sizing: border-box;
  min-height: 0;
}

.infinite-list {
  padding: 0;
  margin: 0;

  ::v-deep ul {
    list-style: none;
    height: 100%;
    padding-left: 0;
  }
}

.password-item {
  border-bottom: var(--el-border-color) 1px solid;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;

  .info-block {
    display: flex;
    flex-direction: column;

    .main-line {
      font-size: var(--el-font-size-large);
    }

    .secondary-line {
      color: var(--el-text-color-placeholder);
    }
  }

  .action-block {
    display: flex;
    align-items: center;
  }
}
</style>
