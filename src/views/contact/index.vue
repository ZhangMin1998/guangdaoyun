<template>
  <div class="contact">
    <div class="card">
      <div class="header">
        <div class="title">通讯录</div>
        <div class="btn" @click="gotoHome">返回</div>
      </div>
      <div class="divider"></div>
      <div class="main">
        <div class="left">
          <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane name="departmentManage">
              <template #label>
                <span class="custom-tabs-label">
                  <i class='iconfont icon-icon_bumenguanli'></i>
                  <span>部门管理</span>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="userManage">
              <template #label>
                <span class="custom-tabs-label">
                  <i class='iconfont icon-icon_yonghuguanli'></i>
                  <span>用户管理</span>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="passwordManage">
              <template #label>
                <span class="custom-tabs-label">
                  <i class='iconfont icon-a-zu5591'></i>
                  <span>密码管理</span>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tabPosition = ref('left')
const activeTab = ref('')

watch(() => route.name, (newVal) => {
  activeTab.value = newVal.toString()
})

const gotoHome = () => {
  router.push({ path: '/home' })
}
const tabClick = (tab) => {
  if (tab.paneName) {
    router.push({ path: `/contact/${ tab.paneName }` })
  }
}
onMounted(() => {
  activeTab.value = route.name.toString()
})
</script>

<style lang="less" scoped>
.contact{
  height: calc(100vh - 64px);
  background: #f5f7fa;
  padding: 32px;
  .card{
    height: 100%;
    // background: #FFFFFF;
    background: #f5f7fa;
    .header{
      height: 72px;
      padding: 24px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
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
      display: flex;
      .left{
        background: #FFFFFF;
        :deep(.demo-tabs) {
          width: 120px;
          height: 100%;
          .el-tabs__content {
            font-size: 16px;
            padding-left: 24px;
          }
          .el-tabs__nav{
            margin-top: 32px !important;
          }

          .el-tabs__item {
            padding: 0 16px;
            font-size: 16px;
            color: #495770;
            height: 48px;
          }
          .el-tabs__active-bar{
            background-color: @active-color;
          }

          .el-tabs__item{
            &.is-active {
              color: @active-color;
              background: linear-gradient(90deg, rgba(0, 82, 217, 0) 0%, rgba(0, 82, 217, 0.08) 100%);
              font-weight: bold;
            }
            &:hover{
              color: @active-color;
            }
          }
        }
        .custom-tabs-label{
          span{
            margin-left: 8px;
          }
        }
      }
      .right{
        width: 100%;
      }
    }
  }
}
</style>