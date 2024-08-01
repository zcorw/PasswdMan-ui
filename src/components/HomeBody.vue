<template>
  <div class="home-body">
    <el-scrollbar>
      <ul v-infinite-scroll="queryList" :infinite-scroll-disabled="disabledQuery" :infinite-scroll-immediate="false"
        class="infinite-list">
        <li v-for="item in list" :key="item.id">
          <div v-if="updateId !== item.id" class="password-item" @click="updateStart(item.id)">
            <div class="info-block">
              <span class="main-line">{{ item.name }}</span>
              <span class="secondary-line">{{ item.username }}</span>
            </div>
            <div class="action-block">
              <el-button @click.stop="copyUsername(item.username)">用户名</el-button>
              <el-button @click.stop="copyPassword(item.id)">密码</el-button>
            </div>
          </div>
          <div v-else class="password-item-update">
            <div class="input-block">
              <div class="input-box">
                <el-input v-model="updateForm.name" placeholder="名称" size="small" />
              </div>
              <div class="input-box">
                <el-input v-model="updateForm.username" placeholder="用户名" size="small" />
              </div>
            </div>
            <div class="input-block">
              <div class="input-box">
                <el-input v-model="updateForm.password" placeholder="密码" size="small" show-password
                  autocomplete="new-password" />
              </div>
              <div class="input-box">
                <el-button v-loading="loading" type="primary" size="small" @click="updateHandle">更新</el-button>
                <el-button v-loading="loading" size="small" @click="cancelUpdate">取消</el-button>
                <el-button v-loading="loading" type="danger" size="small" @click="deleteHandle">删除</el-button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Password } from '@/types/main'
import type { PasswordParams } from '@/types/api'
import { getList, getPasswdText, updatePassword, deletePassword } from '@/utils/api'
const props = defineProps<{
  groupID: string
}>()
const list = ref<Password[]>([])
const disabledQuery = ref(false)
const queryText = ref('')
const updateId = ref('0')
const updateForm = reactive<Password>({
  name: '',
  username: '',
  password: '',
  uri: [],
  fields: '',
  createdAt: '',
  updatedAt: '',
  groupId: '',
  id: ''
})
const loading = ref(false)
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
function copyUsername(text: string) {
  copyContent(text)
}
async function copyPassword(id: string) {
  const text = await getPasswdText(id)
  copyContent(text)
}
function setSearchText(text: string) {
  queryText.value = text
  list.value = []
  queryList()
}
function reload() {
  setSearchText('')
}
async function updateStart(id: string) {
  updateId.value = id
  const data = list.value.find((item) => item.id === id)
  if (data) {
    const password = await getPasswdText(id)
    updateForm.name = data.name
    updateForm.username = data.username
    updateForm.password = password
  }
}
async function updateHandle() {
  loading.value = true
  try {
    await updatePassword(updateId.value, updateForm)
    updateId.value = '0'
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
function cancelUpdate() {
  updateId.value = '0'
}
async function deleteHandle() {
  loading.value = true
  try {
    await deletePassword(updateId.value)
    list.value = list.value.filter((item) => item.id !== updateId.value)
    updateId.value = '0'
  } catch (e) {
    console.error(e)
  }
  loading.value = false
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

.password-item-update {
  display: flex;
  padding: 8px 0;

  .input-block {
    flex: 1;
    padding: 0 8px;

    .input-box {
      margin-bottom: 8px;
    }
  }
}
</style>
