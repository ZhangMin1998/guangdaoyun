<template>
  <div class="login_container">
    <div class="title">欢迎登录</div>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="custom_input"
      status-icon
    >
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" name="username" placeholder="用户账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          @keyup.enter="clickLogin(loginFormRef)"
          v-model="loginForm.password"
          :type="flagType"
          name="password"
          placeholder="密码">
          <template #suffix>
            <i 
              :class="[flag ? 'iconfont icon-icon_yincang' : 'iconfont icon-icon_xianshi']"
              style="font-size:14px;color:#495770"
              @click="showPassword">
            </i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="kaptchacode" v-if="isShowCode">
        <el-input class="codeInput" v-model="loginForm.kaptchacode" name="kaptchacode" placeholder="验证码"></el-input>
        <div class="img_box" @click="uploadImage">
          <img :src="origin + imageUrl" alt="验证码">
        </div>
      </el-form-item>
    </el-form>
    <div class="warning" v-if="redWarning">
      <i class="iconfont icon-icon_tishi"></i>
      <span>{{ redWarning }}</span>
    </div>
    <div class="forget_password" @click="forgetPassword">忘记密码?</div>
    <div class="login_btn">
      <el-button @click="clickLogin(loginFormRef)" type="primary" :loading="loadingBtn">
        {{ loadingBtn ? '登录中...' : '登录' }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormRules, FormInstance } from 'element-plus'
import md5 from 'js-md5'
// import { Hide } from '@element-plus/icons-vue'
import { loginsys } from '@/api/login'
import { userStore } from '@/stores/login'

const store = userStore()
const router = useRouter()

interface LoginForm {
  username: string,
  password: string,
  kaptchacode: string,
  imageUrl: string
}
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  kaptchacode: '',
  imageUrl: ''
})
const loginFormRef = ref<FormInstance>()
const rules = reactive<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  kaptchacode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})
const flag = ref(true)
const flagType = ref('password')
const loadingBtn = ref(false)
const redWarning = ref('')
const emit = defineEmits(['changePassword'])
const isShowCode = ref(false)
const imageUrl = ref('') // 验证码url
const origin = computed(() => {
  return window.location.origin + '/'
  // return 'http://192.168.1.182:21888/'
})

watch(() => store.passwordErrorTimes, (val) => {
  if (val > 3) {
    uploadImage()
    isShowCode.value = true
    redWarning.value = '账号或密码错误，请填写正确并输入验证码'
  }
})

const CalcuMD5 = (pwd) => {
  pwd = md5(pwd)
  return pwd
}

const showPassword = ():void => {
  flag.value = !flag.value
  flagType.value = flag.value ? 'password' : 'text'
}
// 忘记密码
const forgetPassword = () => {
  emit('changePassword', 2)
}
// 登录
const clickLogin = async (formEl:FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loadingBtn.value = true
      const tempPassword = CalcuMD5(loginForm.password)
      // loginForm.password = CalcuMD5(loginForm.password)
      // console.log(loginForm)
      const tempForm = {
        username: loginForm.username,
        password: tempPassword,
        type: 'web',
        kaptchaSessionKey: loginForm.kaptchacode,
        imageUrl: loginForm.imageUrl
      }
      loginsys(tempForm).then((res:any) => {
        // console.log(res)
        // 保存用户信息
        store.setUserInfo(res)
        localStorage.setItem('token', res.token)
        if (res.firstLogin) {
          emit('changePassword', 3)
          return
        }
        router.push({ path: '/home' })
      }).catch((err: any) => {
        // console.log(err)
        loadingBtn.value = false
        if (err.toString().split(':')[1].trim() === '账号或者密码错误' || err.toString().split(':')[1].trim() === '验证码有误！') {
          redWarning.value = err.toString().split(':')[1]
          return
        } else if (err.toString().split(':')[1].trim() === '您已提交密码重置申请，请等待管理员审批。') {
          redWarning.value = ''
          return
        }
        if (store.passwordErrorTimes > 3) {
          redWarning.value = '账号或密码错误，请填写正确并输入验证码'
        }
      })
    }
  })
}
// 获取验证码图片
const uploadImage = () => {
  getVerifyImage().then((res:any) => {
    imageUrl.value = res
    loginForm.imageUrl = res
  })
}
</script>

<style lang="less" scoped>
.login_container{
  box-sizing: border-box;
  // background: pink;
  .title{
    font-size: 26px;
    font-weight: bold;
    color: #0D162A;
    margin-bottom: 43px;
  }
  :deep(.el-input__wrapper){
    width: 400px;
    height: 48px;
    margin-top: 24px;
    border-radius: 0;
    border: 1px solid #D6DBE3;
    box-shadow: none;
  }
  :deep(.codeInput) {
    width: 279px;
    .el-input__wrapper{
      width: 279px !important;
      height: 48px;
      margin-top: 24px;
      border-radius: 0;
      border: 1px solid #D6DBE3;
      border-right: none;
      box-shadow: none;
    }
  }
  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }
  .img_box{
    margin-top: 23px;
    height: 48px;
    border: 1px solid #D6DBE3;
    border-left: none;
    img{
      width: 121px;
      height: 46px;
      object-fit: cover;
    }
  }
  .warning{
    margin-top: 22px;
    float: left;
    color: #F64047;
    font-size: 14px;
  }
  .forget_password{
    color: #0052D9;
    margin-top: 24px;
    float: right;
    cursor: pointer;
  }
  .login_btn{
    margin-top: 85px;
    .el-button {
      width: 100%;
      height: 48px;
      border: 0;
      // border-color: #0052D9;
      border-radius: 0;
      background: #0052D9 !important;
      padding: 0px 24px !important;
      font-size: 18px;
      line-height: 24px;

      &:hover {
        background-color: #1890ff !important;
      }
    }
  }
}
</style>
