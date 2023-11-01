<template>
  <div class="dialog">
    <el-dialog
      v-model="config.show"
      :title="config.title"
      :width="config.width"
      :top="config.top"
      :show-close="false"
      :close-on-click-modal="false"
      align-center
    >
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue'
const props = defineProps({
  dialogConfig: {
    type: Object,
    default: () => {}
  }
})
const config = toRef(props, 'dialogConfig')
</script>

<style lang="less" scoped>
.dialog{
  :deep(.el-dialog__header) {
    margin: 0 24px;
    padding: 24px 0 16px 0;
    border-bottom: 1px solid #DDDDDD;
    .el-dialog__title{
      color: #0D162A;
    }
    .el-dialog__close {
      font-size: 24px;
      color: #0D162A;
    }
  }
  :deep(.el-dialog__body){
    padding: 22px 24px 24px 24px;
  }
}
</style>