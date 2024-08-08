<template>
  <div class="home-header">
    <el-button size="small" class="sign-out" @click="signOutHandle">注销</el-button>
  </div>
</template>

<script setup lang="ts">
import { signOut } from '@/utils/api'
import { useRouter } from 'vue-router'
const router = useRouter()
const signOutHandle = () => {
  signOut()
  router.push({ name: 'login' })
}
</script>

<style lang="scss" scoped>
.home-header {
  padding: 8px 16px;
  background-color: var(--el-color-primary-light-3);
  overflow: hidden;
}

.sign-out {
  float: right;
}
</style>
