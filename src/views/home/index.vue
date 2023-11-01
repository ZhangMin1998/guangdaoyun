<template>
  <div class="home">
    <div class="container">
      <div class="header">
        <span class="title">我的应用</span>
        <el-button class="blue" type="primary" @click="createNewApp">新建应用</el-button>
      </div>
      <div class="content_app_list">
        <div class="each_app_box" v-for="(item, index) in appList" :key="item.id" @mouseenter="mouseenter(index)"
             @mouseleave="mouseleave">
          <div class="app_item" @click="enterApp(item)">
            <i class="iconfont" :class="item.icon"></i>
            <div class="app_name" :title="item.name">{{ item.name }}</div>
            <i class="iconfont icon-shezhi" @click.stop="showSet"
               :style="{ display: currentIndex === index ? 'block' : 'none' }"></i>
            <div class="set_app" :style="{ display: currentIndex === index && showCurrentSet ? 'block' : 'none' }">
              <ul>
                <li class="active" @click.stop="editName(item)">修改名称/图标</li>
                <!-- <li @click.stop="copyApp(item)">复制</li> -->
                <li @click.stop="deleteApp(item)">删除</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
        <div class="each_app_box no_height"></div>
      </div>
    </div>
    <Dialog :dialogConfig="dialogConfig">
      <div class='fill_item'>
        <div class='label label_line'>应用名称：</div>
        <el-input v-model.trim="fillInfo.name" placeholder="请输入应用名称" class='app_name' maxlength='30'
                  @input='appNameInput'></el-input>
        <div v-if='haveError && !fillInfo.name' class='error_tip'>应用名称不可为空</div>
      </div>
      <div class='fill_item'>
        <div class='label'>应用图标：</div>
        <div class='app_icon_grid'>
          <div class='app_icon'>
            <div class='icon_box' v-for='item in iconInfo' :key='item'
                 :class='{ "icon_box": true, "active_icon": item === fillInfo.icon }' @click='handleAppIcon(item)'>
              <i :class='["iconfont", item]'></i>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_btns">
        <el-button class="blank" @click="cancelEvent" plain>取消</el-button>
        <el-button class="blue" type="primary" @click="confirmEvent">确定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import Dialog from '@/components/Dialog/index.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { onMounted } from 'vue'
import { ICON_INFO } from './config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { appAdd, addForm, searchAppList, deleteSingleApp, updateSingleApp } from '@/api/home'
interface FillInfo {
  name: string,
  icon: string,
  id: number | string
}
const fillInfo = reactive<FillInfo>({
  name: '',
  icon: 'icon-daohang',
  id: ''
})

const appList = ref<any>([])
const currentIndex = ref(-1)
const showCurrentSet = ref(false)
onMounted(() => {
  searchList()

})
const haveError = ref(false)
const iconInfo = ICON_INFO
const appNameInput = (value: string) => {
  fillInfo.name = value.replace(/[^a-zA-Z\d\u4E00-\u9FA5]/g, '')
  haveError.value = !fillInfo.name
}

const searchList = () => {
  searchAppList().then((res) => {
    appList.value = res
  })
}

const mouseenter = (index) => {
  currentIndex.value = index
}
const mouseleave = () => {
  showCurrentSet.value = false
  currentIndex.value = -1
}

const enterApp = (data) => {
  router.push({ path: '/home/detail', query: { data: data.id, appName: data.name } })
}
const showSet = () => {
  showCurrentSet.value = !showCurrentSet.value
}
// 选择应用图标
const handleAppIcon = (value: string) => {
  fillInfo.icon = value
}

const editName = (data) => {
  fillInfo.name = data.name
  fillInfo.icon = data.icon
  fillInfo.id = data.id
  dialogConfig.title = '修改应用'
  dialogConfig.show = true
}
// const copyApp = (data) => {
//   console.log(data)
// }
const deleteApp = (data) => {
  ElMessageBox.confirm(
    '请确认是否删除',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteSingleApp(data.id).then((res) => {
      if (!res) return
      ElMessage.success('删除成功')
      searchList()
    })
  }).catch(() => {
  })

}
// 新建应用
interface Config {
  show: boolean,
  title: string,
  width: string,
  top: string,
  isShowBtn: boolean
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '新建应用',
  width: '560px',
  top: '',
  isShowBtn: true
})
const createNewApp = () => {
  fillInfo.id = ''
  fillInfo.icon = 'icon-daohang'
  fillInfo.name = ''
  dialogConfig.title = '新建应用'
  dialogConfig.show = true
}

const cancelEvent = () => {
  dialogConfig.show = false
}

const confirmEvent = () => {
  if (!fillInfo.name) { 
    haveError.value = true
    return
  }
  if (dialogConfig.title === '新建应用') {
    // 新建应用,同时新建一个未命名的表单进行跳转
    appAdd(fillInfo).then((res: any) => {
      addForm({ name: '未命名表单', appId: res.data, type: 'form' }).then((res2: any) => {
        if (res2.code === 1) {
          router.push({ path: '/home/createform', query: { appId: res.data, appName: fillInfo.name, formId: res2.data.id, formName: '未命名表单' } })
        }
      })
    })
  } else {
    updateSingleApp(fillInfo).then((res: any) => {
      if (res) {
        dialogConfig.show = false
        searchList()
      }
    })
  }

}
</script>

<style lang="less" scoped>
.home {
  min-height: calc(100vh - 64px);
  width: 100vw;
  padding: 32px 13%;

  .container {
    padding: 24px;
    // height: 100%;
    min-height: calc(100vh - 128px);
    width: 100%;
    background-color: #fff;

    // overflow: scroll;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 20px;
      }

      .el-button {
        width: 128px;
        height: 36px;
      }
    }

    .content_app_list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 25px;

      .each_app_box {
        // flex: 12.5%;
        width: 154px;
        // margin-right: 20px;
        cursor: pointer;

        &:hover {
          border-radius: 8px 8px 8px 8px;
          background: linear-gradient(90deg, rgba(55, 99, 170, 0.11) 0%, rgba(255, 255, 255, 0) 100%);
          box-shadow: rgba(55, 99, 170, 0.11) 7px 7px 20px;
        }

        .app_item {
          position: relative;
          height: 154px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          i {
            font-size: 64px;
            color: @active-color;
          }

          .app_name {
            width: 100%;
            padding-left: 5px;
            font-size: 16px;
            margin-top: 17px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .icon-shezhi {
            color: #495770;
            font-size: 16px;
            position: absolute;
            top: 12px;
            right: 12px;
          }

          .set_app {
            position: absolute;
            top: 40px;
            right: 0px;
            padding: 8px 0;
            width: 140px;
            height: 90px;
            border: 1px solid #DADDE2;
            background-color: #fff;
            user-select: none;

            ul {
              li {
                height: 36px;
                line-height: 36px;
                padding-left: 15px;

                &:hover {
                  background: #E2EDFD;
                }
              }
            }
          }
        }
      }

      .no_height {
        height: 0;
      }

      .each_app_box:nth-child(8n) {
        margin-right: 0;
      }
    }
  }

  .fill_item {
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 20px;

    .label {
      flex: none;
      font-size: 16px;
      line-height: 21px;
      color: @base-text-color-3;
      white-space: nowrap;
      margin-right: 12px;

      &.label_line {
        line-height: 32px;
      }
    }

    .app_name {
      width: 260px;
    }

    .app_icon_grid {
      width: 100%;
      height: 146px;
      border: 1px solid @border-color-1;
      border-radius: 2px;

      .app_icon {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        width: 100%;
        max-height: 146px;
        padding: 8px;
        overflow-y: auto;

        .icon_box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(100% / 8);
          height: 52px;

          i {
            font-size: 40px;
            color: #0556db;
          }

          &.active_icon {
            background-color: #c9dffd;
          }
        }
      }
    }

    .error_tip {
      position: absolute;
      bottom: -16px;
      left: 92px;
      font-size: 12px;
      line-height: 12px;
      color: red;
    }

    :deep(.el-input) {
      height: 40px;
      line-height: 40px;

      .el-input__inner {
        height: 40px;
        line-height: 40px;
        padding-left: 1px;
        border-color: @border-color-1;
        font-size: 14px;
      }
    }
  }

  .bottom_btns {
    display: flex;
    justify-content: flex-end;

    .el-button {
      width: 96px;
      height: 40px;
      font-size: 16px;
    }
  }
}
</style>