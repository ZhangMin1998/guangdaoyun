<template>
  <div class="login_container">
    <div class="title">
      <div class="main_title">申请重置密码</div>
      <div class="sub_title">
        <i class="iconfont icon-icon_tishi"></i>
        <span>1周内只能提交3次申请，请注意提交次数</span>
      </div>
    </div>
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
      <el-form-item prop="realName">
        <el-input v-model="loginForm.realName" name="realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item prop="jobNumber">
        <el-input v-model="loginForm.jobNumber" name="jobNumber" placeholder="警员编号"></el-input>
      </el-form-item>
      
    </el-form>
    <div class="login_btn">
      <div class="empty_btn" @click="cancel">取消</div>
      <div class="submit_btn" @click="sunmit(loginFormRef)">确定</div>
    </div>
    <Dialog :dialogConfig="dialogConfig">
      <div class="dialog">
        <div class="dialog_content">
          <i class="iconfont icon-icon_tishi_xiangqing"></i>
          <span>{{ dialogConfig.content }}</span>
        </div>
        <div class="dialog_btn" v-if="dialogConfig.isShowBtn">
          <div class="empty_btn" @click="dialogConfig.show = false">否</div>
          <div class="submit_btn" @click="yes">是</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import Dialog from '@/components/Dialog/index.vue'

interface LoginForm {
  username: string,
  realName: string,
  jobNumber: string
}
const loginForm = reactive<LoginForm>({
  username: '',
  realName: '',
  jobNumber: ''
})
const loginFormRef = ref<FormInstance>()
const rules = reactive<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户账号', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  jobNumber: [
    { required: true, message: '请输入警员编号', trigger: 'blur' }
  ]
})

const emit = defineEmits(['cancel'])

const cancel = () => {
  emit('cancel', 1)
}
const sunmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      dialogConfig.content = '请确认是否提交申请重置密码?'
      dialogConfig.isShowBtn = true
      dialogConfig.show = true
    }
  })
}

interface Config {
  show: boolean,
  title: string,
  content: string,
  width: string,
  top: string,
  isShowBtn: boolean
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '提示',
  content: '请确认是否提交申请重置密码?',
  width: '560px',
  top: '',
  isShowBtn: true
})
const yes = () => {
  dialogConfig.show = false
  resetPassword(loginForm).then((res:any) => {
    // console.log(res)
    
    if (res.code === 1 && res.msg === 'success') {
      loginFormRef.value.resetFields()
      dialogConfig.show = true
      dialogConfig.isShowBtn = false
      dialogConfig.content = res.data.message
    } else {
      ElMessage.error(res.msg)
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
  .dialog{
    .dialog_content{
      display: flex;
      align-items: center;
      margin-bottom: 70px;
      .iconfont{
        font-size: 43px;
        color: #3366FF;
      }
      span{
        font-size: 16px;
        line-height: 22px;
        color: #0D162A;
        margin-left: 22px;
      }
    }
    .dialog_btn{
      height: 40px;
      display: flex;
      justify-content: flex-end;
      .empty_btn {
        margin-left: 20px;
        padding: 12px 38px;
        font-size: 16px;
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
        padding: 12px 38px;
        font-size: 16px;
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
