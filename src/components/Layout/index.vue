<template>
  <div class="layout">
    <div class="header">
      <div :class="{logo_box: true, pointer: !preventClick}" @click="gotoHome">
        <img src="@/assets/img/logo.png" alt="">
        <span class="title">广道云</span>
      </div>
      <div class="btn_box">
        <div>
          <i class="iconfont icon-icon_tongxunlu" :class="{'isActive': routePath.includes('contact'), pointer: !preventClick}" title="通讯录" @click="routerPush('/contact/departmentManage')"></i>
        </div>
        <div>
          <el-dropdown trigger="click" :disabled="preventClick">
            <span class="el-dropdown-link">
              <i class="iconfont icon-icon_yonghu" :class="{'isActive': routePath === '/profile', pointer: !preventClick}" title="个人中心"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="routerPush('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { logout } from '@/api/login'
const router = useRouter()
const route = useRoute()

const routePath = ref('')
const preventClick = ref(false) // 打开链接页面不能点击layout
watch(() => route.path, (newVal) => {
  
  routePath.value = newVal
})

const gotoHome = () => {
  if (preventClick.value) return
  router.push({ path: '/home' })
}

const routerPush = (e) => {
  if (preventClick.value) return
  router.push({ path: e })
}
const logOut = () => {
  logout({ type: 'web' }).then((res:any) => {
    console.log(res)
    sessionStorage.clear()
    localStorage.removeItem('token')
    router.push({ path: '/login' })
  })
}

onMounted(() => {
  routePath.value = route.path
  if (routePath.value === '/editform' || routePath.value === '/share') {
    preventClick.value = true
  }
})

</script>

<style lang="less" scoped>
.layout{
  background: #F5F7FA;
  overflow-x: hidden;
  .header{
    width: 100%;
    height: 64px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pointer{
      cursor: pointer;
    }
    .logo_box{
      margin-left: 32px;
      display: flex;
      align-items: center;
      // cursor: pointer;
      img{
        width: 32px;
        height: 32px;
      }
      .title{
        font-size: 26px;
        font-weight: bold;
        color: #0D162A;
        margin-left: 20px;
      }
    }
    .btn_box{
      margin-right: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont{
        color: #495770;
        margin-left: 24px;
        font-size: 24px;
        // cursor: pointer;
      }
      .isActive{
        color: #0052D9;
      }
    }
  }
}
</style>