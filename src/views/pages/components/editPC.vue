<template>
  <div class="editform">
    <div class="card">
      <div class="header">
        <div class="title">{{ formInfo.appName }} / {{ formInfo.formName }}</div>
        <el-popover placement="bottom-start" trigger="click" popper-class="qrcode_popover" :offset="20">
          <template #reference>
            <i class="iconfont icon-icon_erweima"></i>
          </template>
          <template #default>
            <div class="qrcode">
              <span class="text">扫描二维码，分享此链接</span>
              <qr-code class="code_img" :value="shareOpenUrl" :size="150" id="canvasDom"></qr-code>
              <el-button class="blank" plain @click="downLoadQRcode">下载</el-button>
            </div>
          </template>
        </el-popover>
      </div>
      <div class="divider"></div>
      <div class="main" v-if="isShow">
        <div class="form_box">
          <FormCreate  :rule="rule"  v-model="form" :option="option"  @submit="onSubmit"></FormCreate>
        </div>
      </div>
    </div>
    <PasswordDialog :dialogConfig="dialogConfig">
      <div class="dialog_box">
        <div class="tips">
          <i class="iconfont icon-icon_yulan"></i>
          <div class="warning_txt">{{ dialogConfig.text }}</div>
        </div>
      </div>
    </PasswordDialog>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router' // useRouter
import { getQrcodeModule, writeFormData } from '@/api/pages'
import { ElMessage } from 'element-plus'
import qrCode from '@/components/Qrcode/index.vue'
import PasswordDialog from '@/views/pages/components/PasswordDialog.vue'
import formCreate from '@form-create/element-ui'

const FormCreate = formCreate.$form()

// const router = useRouter()
const currentRouter = useRoute()

const props = defineProps({
  formInfo: {
    type: Object
  }
})

const shareOpenUrl = ref('')
shareOpenUrl.value = window.location.href

const dialogConfig = ref({
  show: false,
  title: '访问限制', // 访问限制
  text: '',
  width: '494px',
  top: ''
})

const form = ref({})
const rule = ref([])
const option = ref({})
const isShow = ref(false)

const downLoadQRcode = (): void => {
  const canvas = document.getElementById('canvasDom') as HTMLCanvasElement
  const url = canvas.toDataURL('image/png') // 通过 toDataURL 返回一个包含图片展示的 data URI 
  const aDom = document.createElement('a')
  aDom.download = '二维码' // 设置下载的文件名
  aDom.href = url
  document.body.appendChild(aDom)
  aDom.click()
  aDom.remove()
}

const formatJson = (json) => {
  const parsedArray = JSON.parse(json)
  const parsedObjects = parsedArray.map(item => JSON.parse(item))
  return JSON.stringify(parsedObjects)
}
const queryModule = async () => {
  const res = await getQrcodeModule({ formId: props.formInfo.formId })
  // console.log('组件', res)

  rule.value = formCreate.parseJson(formatJson(res.moduleJson))
  option.value = formCreate.parseJson(JSON.stringify(JSON.parse(res.formJson)))

  // console.log('rule', rule.value)
  // console.log('option', option.value)
  isShow.value = true
}

const onSubmit = (formData) => {
  // console.log(formData)
  const mData = {
    codeUuid: currentRouter.query.uuid,
    formId: props.formInfo.formId,
    jsonObject: formData
  }
  writeFormData(mData).then(res => {
    console.log(res)
    dialogConfig.value.title = '提示'
    dialogConfig.value.text = '提交成功'
    dialogConfig.value.show = true
    ElMessage.success('提交成功')
  }).catch(err => {
    console.log(err)
  })
}
onMounted(() => {
  queryModule()
})
</script>

<style lang="less" scoped>
.editform{
  // height: calc(100vh - 64px);
  // background: #f5f7fa;
  // padding: 32px;
  .card{
    height: calc(100vh - 128px);
    // height: 100%;
    background: #FFFFFF;
    margin: 32px 32px 0 32px;
    .header{
      height: 72px;
      padding: 24px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title{
        color: #0D162A;
      }
    }
    .divider{
      height: 2px;
      margin: 0 24px;
      background: #f5f7fa;
    }
    .main{
      margin-top: 24px;
      height: calc(100vh - 250px);
      .form_box{
        padding:  0 24px;
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
.qrcode {
  height: 256px;
  width: 190px !important;
  margin-left: -18px;
  background-color: #fff;
  user-select: none;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 1px rgba(0, 82, 217, 0.08);
  border: 1px solid #DDDDDD;
  padding: 16px;

  .text {
    font-size: 14px;
  }
  .el-button{
    background-color: #f2f6fd;
  }

  .code_img {
    margin: 12px 0;
  }
}
.dialog_box {
  box-sizing: border-box;
  padding: 0px 12px 0 4px; // 34
  .content_box {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .input_box {
      flex: 1;
      :deep(.el-input) {
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
        }
      }
    }
    .txt {
      display: inline-block;
      width: 90px;
      color: #0D162A;
      font-size: 14px;
    }

    @media only screen and (min-width: 900px) and (max-width: 1280px) {
      .txt {
        width: 100px;
      }
    }
  }
  .tips {
    display: flex;
    align-items: center;
    .iconfont {
      display: inline-block;
      color: #3366ff;
      font-size: 64px;
    }
    .warning_txt {
      font-size: 16px;
      line-height: 22px;
      padding-left: 20px;
      color: #0D162A;
    }
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    //padding: 8px 0 24px 0;
    box-sizing: border-box;
    margin-top: 54px;
    .submit_btn {
      margin-left: 20px;
      padding: 6px 20px;
      line-height: 14px;
      font-size: 14px;
      color: #fff;
      background-color: #0052D9 !important;
      cursor: pointer;

      &:hover {
        background-color: #1890ff !important;
      }
    }
  }
}
</style>
<style lang="less">
.qrcode_popover {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;

  .el-popper__arrow::before {
    display: none;
  }
}
</style>