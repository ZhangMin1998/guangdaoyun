<template>
  <div class="dialog" v-if="config.show">
    <el-dialog
      v-model="config.show"
      :title="config.title"
      :width="config.width"
      :top="config.top"
      :close-on-click-modal="false"
      align-center
      @close="closeEvent"
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
const emit = defineEmits([
  'closeEvent'
])
const config = toRef(props, 'dialogConfig')

const closeEvent = ()=>{
  emit('closeEvent')
}
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