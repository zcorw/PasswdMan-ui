<template>
  <div class="login-box">
    <div class="form-title">登录</div>
    <el-form ref="formRef" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="username">
        <el-input :prefix-icon="User" v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input :prefix-icon="Lock" v-model="form.password" show-password @keyup.enter="loginHandle" />
      </el-form-item>
      <div class="form-line">
        <el-form-item prop="remember">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
        </el-form-item>
        <el-button v-if="props.enableRegister" type="text" @click="register">注册</el-button>
      </div>
      <el-form-item>
        <el-button class="form-submit" type="primary" @click="loginHandle">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/utils/api'
import router from '@/router'

const props = defineProps({
  username: String,
  enableRegister: Boolean,
})
const emits = defineEmits(['register'])
const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
  remember: true,
})
const rules = reactive<FormRules<typeof form>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

onMounted(() => {
  if (props.username) {
    form.username = props.username
    return
  }
  const username = localStorage.getItem('username')
  if (username) {
    form.username = username
  }
})

const loginHandle = () => {
  login(form.username, form.password).then(() => {
    if (form.remember) {
      localStorage.setItem('username', form.username)
    }
    router.push({ name: 'home' })
  })
}
const register = () => {
  emits('register')
}
</script>
