<template>
  <div class="profile">
    <div class="card">
      <div class="header">
        <div class="title">个人中心</div>
        <div class="btn" @click="gotoHome">返回</div>
      </div>
      <div class="divider"></div>
      <div class="main">
        <div class="content_box">
          <div class="user_header">
            <div @click="selectStatus = 0">
              <el-avatar
                :size="64"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
            </div>
            <div :class="selectStatus === 1 ? 'isActive' : ''" @click="selectStatus = 1">
              <i class="iconfont icon-icon_bianji"></i>
              <span>修改账号</span>
            </div>
            <div :class="selectStatus === 2 ? 'isActive' : ''" @click="selectStatus = 2">
              <i class="iconfont icon-icon_bianji"></i>
              <span>修改密码</span>
            </div>
          </div>
          <div class="user_info">
            <template v-if="selectStatus === 0">
              <div class="info_item" v-for="(item, index) in labelList" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="value">{{ userForm[item.prop] || '--' }}</div>
              </div>
            </template>
            <template v-if="selectStatus === 1">
              <el-form
                ref="userFormRef"
                :model="userForm"
                :rules="rules"
                class="custom_input"
                label-width="120px"
              >
                <el-form-item label="用户账号：">
                  <div>{{ userForm['username'] }}</div>
                </el-form-item>
                <el-form-item label="系统角色：">
                  <div>{{ userForm['roleStr'] ? userForm['roleStr'].trim() : '--' }}</div>
                </el-form-item>
                <el-form-item
                  :label="item.label"
                  :prop="item.prop"
                  v-for="(item, index) in inputList"
                  :key="index"
                >
                  <el-input
                    v-model="userForm[item.prop]"
                    :placeholder="`请输入${item.label.substring(0, item.label.length - 1)}`"
                  ></el-input>
                </el-form-item>
                
              </el-form>
              <div class="login_btn">
                <div class="empty_btn" @click="cancel(1)">取消</div>
                <div class="submit_btn" @click="submitForm(userFormRef, 1)">确定</div>
              </div>
            </template>
            <template v-if="selectStatus === 2">
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                class="custom_input"
                label-width="120px"
              >
                <el-form-item prop="oldPassword" label="原密码:">
                  <el-input v-model="passwordForm.oldPassword" name="oldPassword" placeholder="原密码"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="新密码:">
                  <el-input v-model="passwordForm.newPassword" name="newPassword" placeholder="新密码"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword" label="确认密码:">
                  <el-input v-model="passwordForm.confirmPassword" name="confirmPassword" placeholder="确认密码"></el-input>
                </el-form-item>
              </el-form>
              <div class="login_btn">
                <div class="empty_btn" @click="cancel(2)">取消</div>
                <div class="submit_btn" @click="submitForm(passwordFormRef, 2)">确定</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/login'
import md5 from 'js-md5'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { authorityById, upCurrentUser, alter_password } from '@/api/login'

const router = useRouter()
const store = userStore()
const selectStatus = ref(0)
const userFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const userForm = ref({})
interface PassForm {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}
const passwordForm = reactive<PassForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const labelList = [
  { label: '用户账号：', prop: 'username' },
  { label: '系统角色：', prop: 'roleStr' },
  { label: '警员编号：', prop: 'jobNumber' },
  { label: '真实姓名：', prop: 'realName' },
  { label: '岗位名称：', prop: 'positionName' }
]
const inputList = [
  { label: '警员编号：', prop: 'jobNumber' },
  { label: '真实姓名：', prop: 'realName' },
  { label: '岗位名称：', prop: 'positionName' }
]
const rules = {
  jobNumber: [{ required: true, message: '请输入警员编号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
}
watch(selectStatus, () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
})
const validatePass2 = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('与新密码不一致!'))
  } else {
    callback()
  }
}
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      required: true,
      pattern: /^[^\u4e00-\u9fa5 ]{8,16}$/,
      message: '请输入8-16位的数字、字母或字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
}

const cancel = (e) => {
  e === 1 ? userFormRef.value.resetFields() : passwordFormRef.value.resetFields()
  selectStatus.value = 0
}

const CalcuMD5 = (pwd) => {
  pwd = md5(pwd)
  return pwd
}
const submitForm = async (formName:FormInstance | undefined, e:number) => {
  if (!formName) return
  
  let requestUrl
  let obj:any = {}
  if (e === 1) {
    requestUrl = upCurrentUser
    obj = { ...userForm.value }
    obj.userId = (store as any).userInfo.id
  } else if (e === 2) {
    requestUrl = alter_password
    obj.password = CalcuMD5(passwordForm.newPassword)
    obj.oldPassword = CalcuMD5(passwordForm.oldPassword)
  }
  await formName.validate(async (valid) => {
    if (valid) {
      requestUrl(obj).then(() => {
        ElMessage.success('修改成功')
        init()
        cancel(e)
      })
    }
  })
}

const gotoHome = () => {
  router.go(-1)
}
const init = () => {
  authorityById((store as any).userInfo.id).then((res:any) => {
    if (res.id == '1') {
      res.roleStr = '超级管理员'
    } else {
      const arr = res.userRoleList.map(item => {
        return item.roleName
      })
      res.roleStr = arr.join('；')
    }
    userForm.value = res
  })
}
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.profile{
  height: calc(100vh - 64px);
  background: #f5f7fa;
  padding: 32px;
  .card{
    height: 100%;
    background: #FFFFFF;
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
      .btn{
        color: #98A3B7;
        cursor: pointer;
        &:hover{
          color: #0052D9;
        }
      }
    }
    .divider{
      height: 2px;
      margin: 0 24px;
      background: #f5f7fa;
    }
    .main{
      height: calc(100% - 74px);
      letter-spacing: 2px;
      // background-color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      .content_box{
        // min-width: 400px;
        // width: 100%;
        // background-color: pink;
        .user_header{
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          div{
            letter-spacing: 2px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 50px;
            i {
              font-size: 24px;
              margin-right: 4px;
            }
            &:hover{
              color: #0052D9;
            }
            &.isActive{
              color: #0052D9;
            }
          }
        }
        .user_info{
          .info_item{
            font-size: 14px;
            line-height: 32px;
            display: flex;
            margin-bottom: 18px;
            margin-left: 28px;
            .label{
              min-width: 92px;
            }
            .value{
              min-width: 200px;
            }
          }
          .login_btn{
            margin-top: 40px;
            display: flex;
            justify-content: flex-end;
            .empty_btn {
              padding: 6px 20px;
              line-height: 14px;
              font-size: 14px;
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
          :deep(.el-form-item__label){
            color: #000;
          }
          :deep(.el-input .el-input__inner) {
            color: #000;
          }
        }
      }
    }
  }
}
</style>