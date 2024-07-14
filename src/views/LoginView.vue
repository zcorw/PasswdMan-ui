<template>
  <div class="form-container">
    <LoginBox
      v-if="type === 'login'"
      :username="username"
      :enableRegister="enableRegister"
      @register="register"
    />
    <RegisterBox v-else @login="login" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginBox from '@/components/LoginBox.vue'
import RegisterBox from '@/components/RegisterBox.vue'
import { getAuthConfig } from '@/utils/api'

const type = ref('login')
const username = ref('')
const enableRegister = ref(false)
const register = () => {
  type.value = 'register'
  username.value = ''
}
const login = (name: string) => {
  type.value = 'login'
  username.value = name
}
onMounted(() => {
  getAuthConfig().then((res) => {
    enableRegister.value = res.enableRegister
  })
})
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
  position: relative;

  .form-title {
    text-align: center;
    font-size: var(--el-font-size-extra-large);
    margin-bottom: 2rem;
  }
}

.form-submit {
  width: 100%;
}
.form-line {
  display: flex;
  justify-content: space-between;
}
</style>
