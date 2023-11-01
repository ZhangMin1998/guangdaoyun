<template>
  <div class="fill_form_wrap">
    <div class="header_wrap">{{ formTitle }}</div>
    <form-create v-model:api="fApi" :rule="rule" :option="options" />
    <el-button type="primary" @click='submit'>提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

/* props */

/* 声明状态 */
const formTitle = ref('电动车违规调研')
const fApi = reactive({})
const options = reactive({
  submitBtn: false
})
const rule = ref([
  {
    type: 'input',
    field: 'input1',
    title: 'input1',
    value: 'default'
  },
  {
    type: 'input',
    field: 'input2',
    title: 'input1',
    link: ['input1'],
    value: '',
    update(val, rule) {
      rule.value = `${ Date.now() }`
    }
  }
])

/* 计算属性 */

/* 声明函数 */
function submit():void {

}

</script>

<style lang="less" scoped>
.fill_form_wrap {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  .header_wrap {
    display: flex;
    justify-content: center;
    background: #FFFFFF;
    padding: 28px 0;
    border-bottom: 1px solid #EEEEEE;
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: #0D162A;
  }
  ::v-deep(.form-create) {
    padding: 30px;
    height: calc(100% - 202px);
    overflow-y: auto;
    .el-form-item {
      flex-direction: column;
      font-size: 28px;
      margin-bottom: 30px;
      .el-form-item__label {
        justify-content: flex-start;
        font-size: 28px;
        line-height: 36px;
        color: #0D162A;
        margin-bottom: 20px;
        width: auto !important;
      }
      .el-input__wrapper {
        box-shadow: none;
        border: 1px solid #D6DBE3;
        border-radius: 4px;
        padding: 0 24px;
      }
      .el-input__inner {
        height: 60px;
        line-height: 60px;
      }
    }
  }
}
</style>