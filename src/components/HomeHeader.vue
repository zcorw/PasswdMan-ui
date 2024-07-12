<template>
  <div class="home-header">
    <el-button size="small" class="sign-out">注销</el-button>
  </div>
</template>

<script setup lang="ts"></script>

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
