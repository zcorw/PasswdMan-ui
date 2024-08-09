<template>
  <el-dialog v-model="dialogVisible" title="添加笔记">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="group">
            <el-select v-model="form.groupId" placeholder="分组">
              <el-option v-for="item in groupList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="fields">
        <el-input v-model="form.fields" placeholder="字段" />
      </el-form-item>
      <el-form-item prop="note">
        <el-input type="textarea" v-model="form.note" placeholder="笔记" :autosize="{ minRows: 2, maxRows: 10 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addHandle">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import type { Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { addNote, addPassword } from '@/utils/api'
import type { Group } from '@/types/main'

const emits = defineEmits(['submit'])
const dialogVisible = ref(false)
const groupList = inject('groupList') as Ref<Group[]>
const formRef = ref<FormInstance>()
const initForm = {
  name: '',
  groupId: '',
  fields: '',
  note: '',
}
const form = reactive(initForm)
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  groupId: [{ required: true, message: '请选择分组', trigger: 'blur' }],
  note: [{ required: true, message: '请输入笔记', trigger: 'blur' }],
})

watch(dialogVisible, (val) => {
  if (val) {
    formRef.value?.resetFields()
    form.groupId = groupList.value[0].id
  }
})
const addHandle = () => {
  formRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    addNote(form).then(() => {
      emits('submit')
      dialogVisible.value = false
    })
  })
}
const open = () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}
defineExpose({ open, close })
</script>