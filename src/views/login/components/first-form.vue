<template>
  <div class="login_container">
    <div class="title">
      <div class="main_title">设置密码</div>
      <div class="sub_title">
        <i class="iconfont icon-icon_tishi"></i>
        <span>首次登陆，请先设置密码</span>
      </div>
    </div>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="custom_input"
      status-icon
    >
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" name="password" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input v-model="loginForm.password2" name="password2" placeholder="确认密码"></el-input>
      </el-form-item>
      
    </el-form>
    <div class="login_btn">
      <div class="empty_btn" @click="cancel">取消</div>
      <div class="submit_btn" @click="sunmit(loginFormRef)">确定</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import md5 from 'js-md5'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { userStore } from '@/stores/login'
import { useRouter } from 'vue-router'

const store = userStore()
const router = useRouter()
interface LoginForm {
  password: string,
  password2: string
}
const loginForm = reactive<LoginForm>({
  password: '',
  password2: ''
})
const loginFormRef = ref<FormInstance>()

// const reg = /^[^\u4e00-\u9fa5 ]{8,16}$/
// const validatePass = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('请输入新密码'))
//   } else {
//     if (reg.test(value)) {
//       callback()
//     } else {
//       callback(new Error('请输入8-16位的数字、字母或字符'))
//     }

//   }
// }
const validatePass2 = (rule, value, callback) => {
  if (value !== loginForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<LoginForm>>({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 16,  message: '请输入8-16位的数字、字母或字符', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})

const emit = defineEmits(['cancel'])

// const userId = computed(() => ((store as any).userInfo.id))
const CalcuMD5 = (pwd) => {
  pwd = md5(pwd)
  return pwd
}

const cancel = () => {
  emit('cancel', 1)
}
const sunmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const params = {
        id: (store as any).userInfo.id,
        password: CalcuMD5(loginForm.password),
        oldPassword: CalcuMD5(loginForm.password2)
      }
      setFirstPassword(params).then((res:any) => {
        if (res.code === 1 && res.msg === 'success') {
          ElMessage.success('新密码设置成功')
          store.setUserInfo(res.data)
          localStorage.setItem('token', res.data.token)
          router.push({ path: '/home' })
        }
      })
    }
  })
}
</script>

<style lang="less" scoped>
.login_container{
  box-sizing: border-box;
  .title{
    margin-bottom: 20px;
    .main_title{
      font-size: 26px;
      font-weight: bold;
      color: #0D162A;
    }
    .sub_title{
      i{
        margin-right: 8px;
      }
      color: #495770;
      font-size: 16px;
      margin-top: 14px;
    }
  }
  :deep(.el-input__wrapper){
    width: 400px;
    height: 48px;
    margin-top: 24px;
    border-radius: 0;
    border: 1px solid #D6DBE3;
    box-shadow: none;
  }
  .login_btn{
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    .empty_btn {
      margin-left: 20px;
      padding: 14px 40px;
      font-size: 18px;
      color: #0052D9;
      border: 1px solid #0052D9;
      cursor: pointer;

      &:hover {
        color: #fff;
        background-color: #0052D9 !important;
      }
    }
    .submit_btn {
      margin-left: 20px;
      padding: 14px 40px;
      font-size: 18px;
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
