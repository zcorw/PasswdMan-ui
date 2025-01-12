<template>
  <div class="login-box">
    <div class="form-title">注册</div>
    <el-form ref="formRef" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="username">
        <el-input :prefix-icon="User" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          :prefix-icon="Lock"
          v-model="form.password"
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item prop="confirmPwd">
        <el-input
          type="password"
          :prefix-icon="Lock"
          v-model="form.confirmPwd"
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item>
        <div class="form-submit">
          <el-button type="primary" class="form-button" @click="registerHandle">注册</el-button>
          <el-button type="text" @click="emits('login')">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { register } from '@/utils/api'
const emits = defineEmits(['login'])
const props = defineProps<{ publicKey: string }>()
const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
  confirmPwd: '',
})
const checkConfirmPwd = (rule: any, value: any, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof form>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: checkConfirmPwd, trigger: 'blur' },
  ],
})
const registerHandle = () => {
  formRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    register(form.username, form.password, props.publicKey).then(() => {
      emits('login', form.username)
    })
  })
}
</script>

<style lang="scss" scoped>
.form-submit {
  display: flex;
}
.form-button {
  flex: 1;
}
.form-back {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
