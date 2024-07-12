<template>
  <div class="form-container">
    <div class="login-box">
      <div class="form-title">登录</div>
      <el-form class="form-main" :model="form">
        <el-form-item prop="username">
          <el-input :prefix-icon="User" v-model="form.username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" v-model="form.password" show-password />
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="form-submit" type="primary" @click="loginHandle">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, onMounted } from 'vue'
import { login, register } from '@/utils/api'
const form = reactive({
  username: '',
  password: '',
  remember: true,
})

onMounted(() => {
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
  })
  // register(form.username, form.password)
}
</script>

<style>
.form-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  display: flex;
  flex-direction: column;

  .form-title {
    text-align: center;
    font-size: var(--el-font-size-extra-large);
    margin-bottom: 2rem;
  }
}

.form-submit {
  width: 100%;
}
</style>
