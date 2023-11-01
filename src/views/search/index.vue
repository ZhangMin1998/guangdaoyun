<template>
  <div class="main_page">
    <!-- pc和移动端展示不同的内容 -->
    <!-- PC端页面 -->
    <PcPage :formInfo="formInfo" v-if="!_isMobile && isShow" />
    <!-- 移动端页面 -->
    <!-- <mobilePage :formInfo="formInfo" v-if="_isMobile && isShow" /> -->
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
          <!-- <i class="iconfont icon-icon_yulan"></i> -->
          <!-- <div class="warning_txt">{{ dialogConfig.text }}</div> -->
          <div>该链接已失效!</div>
        </div>
        <div class="btn">
          <div class="submit_btn" @click="urlUseless">确定</div>
        </div>
      </div>
    </PasswordDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { isMobile } from '@/utils'
import { useRoute, useRouter } from 'vue-router' // useRouter
import { ElMessage } from 'element-plus'
import { checkReadPassword } from '@/api/search'
import { getQrCodeReadInfo } from '@/api/pages'
import PcPage from './components/pc-page/index.vue'
// import mobilePage from './components/mobile-page'
import PasswordDialog from '@/views/pages/components/PasswordDialog.vue'
const currentRouter = useRoute()
const router = useRouter()
const isShow = ref(false)
const _isMobile = ref(null)
const password = ref('')
const dialogConfig = ref({
  show: false,
  title: '访问限制', // 访问限制
  text: '',
  width: '494px',
  top: ''
})
const formInfo: any = ref({})

onMounted(async () => {
  queryBaseInfo()
})

function queryBaseInfo() {
  getQrCodeReadInfo({ codeUuid: currentRouter.query.uuid }).then((res: any) => {
    formInfo.value = res
    if (!res.state) {
      dialogConfig.value.show = true
      dialogConfig.value.title = '提示'
      return
    }
    if (res.passwordSwitch && res.state) {
      dialogConfig.value.show = true
      dialogConfig.value.title = '访问限制'
      return
    }

    // 判断是什么设备访问的
    _isMobile.value = isMobile()
    if (res.state && !res.passwordSwitch && _isMobile.value) {
      router.push({ path: 'mobilesrarch', query: { uuid: currentRouter.query.uuid, formId: formInfo.value.formId } })
    }else{
      isShow.value = true
    }
  })
}
const urlUseless = () => {
  dialogConfig.value.show = false
  window.close()
}

const confirmPassword = () => {
  console.log('chufale')
  if (password.value === '') {
    ElMessage.info('请输入访问密码')
  } else {
    const obj = {
      codeUuid: currentRouter.query.uuid,
      password: password.value
    }
    checkReadPassword(obj).then(res => {
      // console.log(9999, res)
      if (res) {
        ElMessage.success('访问密码正确')
        isShow.value = true
        dialogConfig.value.show = false
        // 判断是什么设备访问的
        _isMobile.value = isMobile()
        if (_isMobile.value) {
          router.push({ path: 'mobilesrarch', query: { uuid: currentRouter.query.uuid, formId: formInfo.value.formId } })
        }
      }
    })
  }
}

</script>

<style lang="less" scoped>
.main_page {
  min-height: calc(100vh - 64px);

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
}
</style>