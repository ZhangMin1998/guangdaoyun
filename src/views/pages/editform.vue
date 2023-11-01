<template>
  <div class="editform">
    <EditPC :formInfo="formInfo" v-if="!_isMobile && isShow"/>
    <!-- <EditMb :formInfo="formInfo" v-if="_isMobile && isShow" /> -->
    <PasswordDialog :dialogConfig="dialogConfig">
      <div class="dialog_box" v-if="dialogConfig.title === '访问限制'">
        <div class="content_box">
          <span class="txt">访问密码：</span>
          <div class="input_box">
            <el-input placeholder="请输入" maxlength="30" v-model="password"></el-input>
          </div>
        </div>
        <div class="btn">
          <div class="submit_btn" @click="confirmPassword">确定</div>
        </div>
      </div>
      <div class="dialog_box" v-else-if="dialogConfig.title === '提示' && dialogConfig.state">
        <div class="tips">
          <i class="iconfont icon-icon_yulan"></i>
          <div class="warning_txt">{{ dialogConfig.text }}</div>
        </div>
      </div>
      <div class="dialog_box" v-else-if="dialogConfig.title === '提示'&& !dialogConfig.state">
        <div class="tips">
          <div>该链接已失效!</div>
        </div>
        <div class="btn">
          <div class="submit_btn" @click="urlUseless">确定</div>
        </div>
      </div>
    </PasswordDialog>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router' // useRouter
import { getQrCodeWriteInfo, getCheckPassword } from '@/api/pages'
import { ElMessage } from 'element-plus'
import { isMobile } from '@/utils'
import PasswordDialog from '@/views/pages/components/PasswordDialog.vue'
import EditPC from '@/views/pages/components/editPC.vue'
// import EditMb from '@/views/pages/components/editMb.vue'

const router = useRouter()
const currentRouter = useRoute()

// const shareOpenUrl = ref('')
// shareOpenUrl.value = window.location.href
const _isMobile = ref(null)
const password = ref('')
const formId = ref('')
const dialogConfig = ref({
  state: false,
  show: false,
  title: '', // 访问限制
  text: '',
  width: '494px',
  top: ''
})
// const rule = ref([])
// const option = ref({})
const isShow = ref(false)
const formInfo:any = ref({})

const urlUseless = ()=>{
  dialogConfig.value.show = false
  window.close()
}

const confirmPassword = () => {
  if (password.value === '') {
    ElMessage.info('请输入访问密码')
  } else {
    const obj = {
      codeUuid: currentRouter.query.uuid,
      password: password.value
    }
    getCheckPassword(obj).then(res => {
      // console.log(9999, res)
      if (res) {
        ElMessage.success('访问密码正确')
        dialogConfig.value.show = false
        dialogConfig.value.title = '提示'
        isShow.value = true
        if (_isMobile.value) {
          router.push({ path: 'mobileedit' ,query:{ uuid: currentRouter.query.uuid ,formId: formInfo.value.formId, formName: formInfo.value.formName } })
        }
      }
    })
  }
}
// const formatJson = (json) => {
//   const parsedArray = JSON.parse(json)
//   const parsedObjects = parsedArray.map(item => JSON.parse(item))
//   return JSON.stringify(parsedObjects)
// }
// const queryModule = async () => {
//   const res = await getQrcodeModule({ formId: formId.value })
//   // console.log('组件', res)

//   rule.value = formCreate.parseJson(formatJson(res.moduleJson))
//   option.value = formCreate.parseJson(JSON.stringify(JSON.parse(res.formJson)))

//   // console.log('rule', rule.value)
//   // console.log('option', option.value)
//   isShow.value = true
// }

onMounted(async () => {
  // 判断是什么设备访问的
  _isMobile.value = isMobile()
  const res = await getQrCodeWriteInfo({ codeUuid: currentRouter.query.uuid })
  // console.log(res)
  formInfo.value = res
  formId.value = res.formId
  if (!res.state) {
    dialogConfig.value.show = true
    dialogConfig.value.title = '提示'
    dialogConfig.value.state = false
    return
  }
  if (res.state && res.passwordSwitch) {
    dialogConfig.value.show = true
    dialogConfig.value.title = '访问限制'
  } else {
    // queryModule()
    isShow.value = true
    if (_isMobile.value) {
      router.push({ path: 'mobileedit' ,query:{ uuid: currentRouter.query.uuid ,formId: formInfo.value.formId, formName: formInfo.value.formName } })
    }
  }
})
</script>

<style lang="less" scoped>
.editform{
  min-height: calc(100vh - 96px);
  background: #f5f7fa;
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