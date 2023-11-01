<template>
  <div class="login_page">
    <div class="logo_box" @click="refreshPage">
      <img src="@/assets/img/logo.png" alt="">
      <span class="title">广道云</span>
    </div>
    <div class="page_left">
      <div class="img"></div>
    </div>
    <div class="page_right">
      <login @change-password="changeForm" v-if="type === 1"></login>
      <reset-form @cancel="changeForm" v-if="type === 2"></reset-form>
      <first-form @cancel="changeForm" v-if="type === 3"></first-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import login from '@/views/login/components/login-form.vue'
import resetForm from '@/views/login/components/reset-form.vue'
import firstForm from '@/views/login/components/first-form.vue'

const type = ref(1)
const changeForm = (val:number) => {
  type.value = val
}
const refreshPage = () => {
  window.location.reload()
}
</script>

<style lang="less" scoped>
.login_page{
  position: relative;
  width:100%;
  height: 100%;
  overflow-y: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display:flex;
  align-items: center;
  justify-content: center;
  .logo_box{
    position: absolute;
    left: 32px;
    top: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img{
      width: 32px;
      height: 32px;
    }
    .title{
      font-size: 26px;
      font-weight: bold;
      color: #0D162A;
      margin-left: 8px;
    }
  }
  .page_left{
    flex: 0.57;
    .img{
      height: 100vh;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
      // background-size: 100% 100%;
      // background-image: url("https://g.jdycdn.com/app/pc/d71ce0a1864e.jpg");
      // background-image: url("@/assets/img/login_bg.png");
      background-image: url("@/assets/img/login_bg.gif");
    }
  }
  .page_right{
    flex: 0.43;
    height: 100vh;
    padding: 64px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media screen and (max-width: 768px){
  .page_left{
    display: none;
  }
}
</style>