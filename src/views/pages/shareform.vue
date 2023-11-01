<template>
  <div class="shareform">
    <SharePC :formInfo="formInfo" v-if="!_isMobile && isShow"/>
    <!-- <ShareMb :formId="formId" v-if="_isMobile && isShow" /> -->
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
      <div class="dialog_box" v-else-if="dialogConfig.title === '提示'">
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
import { isMobile } from '@/utils'
import { getQrCodeReadInfo, getCheckReadPassword } from '@/api/pages'
import { ElMessage } from 'element-plus'
import PasswordDialog from '@/views/pages/components/PasswordDialog.vue'
import SharePC from '@/views/pages/components/sharePC.vue'
// import ShareMb from '@/views/pages/components/shareMb.vue'
// import formCreate from '@form-create/element-ui'
// const FormCreate = formCreate.$form()

const router = useRouter()
const currentRouter = useRoute()

const _isMobile = ref(null)
const password = ref('')
const formId = ref('')
const dialogConfig = ref({
  show: false,
  title: '',
  text: '',
  width: '494px',
  top: ''
})
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
    getCheckReadPassword(obj).then(res => {
      if (res) {
        ElMessage.success('访问密码正确')
        dialogConfig.value.show = false
        isShow.value = true
        // queryModule()
        if (_isMobile.value) {
          router.push({ path: 'mobileshare' ,query:{ uuid: currentRouter.query.uuid ,formId: formInfo.value.formId } })
        }
      }
    })
  }
}

onMounted(async () => {
  // 判断是什么设备访问的
  _isMobile.value = isMobile()

  const res = await getQrCodeReadInfo({ codeUuid: currentRouter.query.uuid })
  // console.log(res)
  formInfo.value = res
  formId.value = res.formId
  if (!res.state) {
    dialogConfig.value.show = true
    dialogConfig.value.title = '提示'
    return
  }
  if (res.state && res.passwordSwitch) {
    dialogConfig.value.show = true
    dialogConfig.value.title = '访问限制'
  } else {
    isShow.value = true
    if (_isMobile.value) {
      router.push({ path: 'mobileshare' ,query:{ uuid: currentRouter.query.uuid ,formId: formInfo.value.formId } })
    }
  }
})
</script>

<style lang="less" scoped>
.shareform{
  // padding-bottom: 32px;
  min-height: calc(100vh - 96px);
  background: #f5f7fa;
  // background: pink;
  // padding: 32px;
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