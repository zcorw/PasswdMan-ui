<template>
  <div class="home-body">
    <el-scrollbar>
      <ul v-infinite-scroll="queryList" :infinite-scroll-disabled="disabledQuery" :infinite-scroll-immediate="false"
        class="infinite-list">
        <li v-for="item in list" :key="item.id">
          <div v-if="updateId !== item.id" class="password-item" @click="updateStart(item.id)">
            <div class="info-block">
              <span class="main-line">{{ item.name }}</span>
              <span class="secondary-line">{{ item.fields }}</span>
            </div>
            <div class="action-block">
              <el-button @click.stop="copyNote(item.id)">复制</el-button>
            </div>
          </div>
          <div v-else class="password-item-update">
            <div class="input-box">
              <el-input v-model="updateForm.name" placeholder="名称" size="small" />
            </div>
            <div class="input-box">
              <el-input v-model="updateForm.fields" placeholder="说明字段" size="small" />
            </div>
            <div class="input-box">
              <el-input type="textarea" v-model="updateForm.note" placeholder="内容" size="small"
                :autosize="{ minRows: 2, maxRows: 10 }" />
            </div>
            <div class="input-block">

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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Note } from '@/types/main'
import type { PasswordParams } from '@/types/api'
import { getNotes, getNoteText, deleteNote, updateNote } from '@/utils/api'
const props = defineProps<{
  groupID: string
}>()
const list = ref<Note[]>([])
const disabledQuery = ref(false)
const queryText = ref('')
const updateId = ref('0')
const updateForm = reactive<Note>({
  name: '',
  note: '',
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
  getNotes(params).then((res) => {
    list.value = list.value.concat(
      res.data.map((item) => {
        return {
          id: item.nId,
          name: item.name,
          note: item.note,
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

async function copyNote(id: string) {
  const text = await getNoteText(id)
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
    const text = await getNoteText(id)
    updateForm.name = data.name
    updateForm.note = text
    updateForm.fields = data.fields
  }
}
async function updateHandle() {
  loading.value = true
  try {
    await updateNote(updateId.value, updateForm)
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
  ElMessageBox.confirm('此操作将永久删除该笔记，是否继续？', '提示')
    .then(async () => {
      loading.value = true
      try {
        await deleteNote(updateId.value)
        list.value = list.value.filter((item) => item.id !== updateId.value)
        updateId.value = '0'
      } catch (e) {
        console.error(e)
      }
      loading.value = false
    })

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
    flex: 1;
    min-width: 0;
    margin-right: 50px;

    .main-line {
      font-size: var(--el-font-size-large);
    }

    .secondary-line {
      color: var(--el-text-color-placeholder);
      // 单行显示，多行用省略号
      display: block;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      min-height: 1.6em;
    }
  }

  .action-block {
    display: flex;
    align-items: center;
  }
}

.password-item-update {
  display: flex;
  flex-direction: column;
  padding: 8px 0;

  .input-box {
    margin-bottom: 8px;
  }

  .input-block {
    flex: 1;
    padding: 0 8px;

    .input-box {
      text-align: right;
    }
  }
}
</style>
