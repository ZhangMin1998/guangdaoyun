<template>
  <div class="open_with_password">
    <div class="password_line">
      <div class="text_password">凭密码打开: </div>
      <el-switch v-model="passwordSwitch" @change="switchChange" active-text="打开" inactive-text="关闭" />
      <div class="password_input_box" v-if="passwordSwitch">
        <el-input class="password_input" :type="inputType" @change="passwordChange" v-model="subPassword"
                  placeholder="请输入密码"></el-input>
        <i class="iconfont icon-yincang" v-if="inputType !== 'password'" title="隐藏" @click="changeInputType"></i>
        <i class="iconfont icon-icon_yincang" v-else @click="changeInputType"  title="显示"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const inputType = ref('password')
const passwordSwitch = ref(false)
const subPassword = ref('')
import { useRoute } from 'vue-router'
const currentRouter = useRoute()
import { ElMessage } from 'element-plus'
import { setPassword,setReadPassword } from '@/api/home'
const props = defineProps({
  passwordSwitchStatus: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  id: {
    type: Number
  },
  isSetReadPassword:{
    type: Boolean,
    default: false
  },
  formId:{
    type: Number
  }
})

const emit = defineEmits([
  'switchChange',
  'inputChange',
  'update:password',
  'update:passwordSwitchStatus'
])

watch(() => props.passwordSwitchStatus, (newval) => {
  passwordSwitch.value = newval
}, { immediate: true })
watch(() => props.password, (newval) => {
  subPassword.value = newval
}, { immediate: true })

const changeInputType = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const switchChange = (value) => {
  emit('update:passwordSwitchStatus', value)
  // emit('switchChange')
  // emit('inputChange',value)
  inputChange(value)
}

const passwordChange = (value) => {
  emit('update:password', value)
  // emit('inputChange')
  inputChange('')
}
const inputChange = (data) => {
  console.log(props.id)
  if (data && !subPassword.value) { return }
  const API = props.isSetReadPassword ? setReadPassword : setPassword 
  API({
    formId: props.formId || currentRouter.query.formId,
    password: subPassword.value,
    passwordSwitch: passwordSwitch.value,
    qrCodeId: props.id
  }).then((res) => {
    if (res) {
      ElMessage.success(passwordSwitch.value ? '密码设置成功' : '已关闭密码')
    }
  })
}

</script>

<style lang="less" scoped>
.open_with_password {
  .password_line {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .text_password {
      margin-right: 8px;
      color: @base-text-color-3;
    }

    .password_input_box {
      display: flex;
      align-items: center;
    }

    .password_input {
      width: 203px;
      margin-left: 16px;
      margin-right: 8px;
    }
    i{
      cursor: pointer;
      color: #4b5972;
    }
    .icon-yincang {
      
    }
  }
}
</style>