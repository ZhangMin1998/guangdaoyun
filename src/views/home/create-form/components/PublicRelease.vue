<template>
  <div class="PublicRelease">
    <el-tabs v-model="activeName" class="demo_tabs_right" @tab-click="handleClick">
      <el-tab-pane label="表单填写链接" name="formWrite">
        <div class="open_url_box">
          <div class="text">开启后生成链接，获得链接的所有人都可以填写表单。</div>
          <div class="is_open_url">
            <el-switch v-model="isOpenUrl" active-text="打开" inactive-text="关闭" @change="openUrlEvent" />
            <div class="show_url_box" v-if="isOpenUrl">
              <CopyAndOpenUrl v-model:url="openUrl"></CopyAndOpenUrl>
              <OpenWithPassword v-model:passwordSwitchStatus="passwordSwitchStatus" v-model:password="password"
                                v-model:id="writeQrCodeId">
              </OpenWithPassword>
            </div>
          </div>
        </div>

        <div class="is_add_person">
          <el-divider />
          <div class="add_person_text" @click="addCollectorEvent">
            <i class="iconfont icon-icon_tianjia"></i>
            <span>添加采集人</span>
          </div>
          <div class="person_list">
            <div class="each_person_item" v-for="(item, index) in collectorList" :key="index">
              <div class="add_person_name_first">
                <div class="person_name"><span class="add_perpson">采集人:</span><span>{{ item.gatherUserName }}</span></div>
                <i class="iconfont icon-icon_qingkong" @click="delAddPerson(item)"></i>
              </div>
              <div class="add_person_url_second">
                <CopyAndOpenUrl :url="generateUrl(item.linkUrl)"></CopyAndOpenUrl>
              </div>
              <div class="add_person_password_third">
                <OpenWithPassword v-model:passwordSwitchStatus="item.passwordSwitch" v-model:password="item.password"
                                  v-model:id="item.id">
                </OpenWithPassword>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公开查询链接" name="formSearch">
        <OpenSearch></OpenSearch>
      </el-tab-pane>
      <el-tab-pane label="单条数据分享链接" name="saveData">
        <!-- 单条数据分享链接 -->
        <div class="open_url_box">
          <div class="text">当设置开关按钮为开，该表单即可单条数据分享，外部人员拿到链接二维码可查看数据内容。</div>
          <div class="is_open_url">
            <el-switch v-model="isOpenSingleUrl" active-text="打开" inactive-text="关闭" @change="openSingleUrlEvent" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <Dialog :dialogConfig="dialogConfig" @closeEvent="closeEvent">
      <div class="main_form">
        <div class="text">采集人:</div>
        <el-tree-select v-model="chooseHuman" placeholder="请选择" ref="roleTreeRef" :props="treeNameReset"
                        @change="treeValueChange"
                        :data="humanTreeData" :render-after-expand="false" node-key="id" show-checkbox />
        <div class="error_tip" v-if="showError">请先选择采集人</div>
      </div>
      <div class="bottom_btns">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="confirmEvent">确定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, type TabsPaneContext } from 'element-plus'
import CopyAndOpenUrl from './CopyAndOpenUrl.vue'
import OpenWithPassword from './OpenWithPassword.vue'
import OpenSearch from './OpenSearch.vue'
import Dialog from '@/components/Dialog/index.vue'
import { getUserTreeList, getInfo, switchStatus, addCollector, deleteCollector, getSingleShareInfo,setSingleShareSwitchStatus } from '@/api/home'
import { useRoute } from 'vue-router'
const currentRouter = useRoute()
const activeName = ref('formWrite')
const isOpenUrl = ref(false)
const isOpenSingleUrl = ref(false)
const passwordSwitchStatus = ref(false)
const password = ref('')
// const shareOpenUrl = ref('')
const openUrl = ref('')
const collectorList: any = ref([])
const chooseHuman = ref('')
const humanTreeData: any = ref([])
const writeQrCodeId = ref()
const showError = ref(false)
const treeNameReset = {
  // value:'treeName',
  label: 'treeName',
  children: 'children'
}
// 添加采集人
interface Config {
  show: boolean,
  title: string,
  width: string,
  top: string,
  isShowBtn: boolean
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '添加采集人',
  width: '417px',
  top: '',
  isShowBtn: true
})
onMounted(() => {
  getInfo(currentRouter.query.formId, 'write_all').then((res) => {
    // openUrl.value = window.location.origin + res[0].linkUrl
    openUrl.value = 'http://202.105.96.110:21185' + res[0].linkUrl
    isOpenUrl.value = res[0].state
    passwordSwitchStatus.value = res[0].passwordSwitch
    password.value = res[0].password || ''
    writeQrCodeId.value = res[0].id
  })
  getSingleShareInfo({ formId: currentRouter.query.formId }).then((res:any) => {
    isOpenSingleUrl.value = res.singleReadAuth
  })
  searchHumanList()
  searchCollectorList()
})

const generateUrl = (url)=>{
  return  'http://202.105.96.110:21185' + url
  // return  window.location.origin + url
}

const searchHumanList = () => {
  getUserTreeList().then((res) => {
    console.log(res)
    forMatData(res)
    humanTreeData.value = res
  })
}
const forMatData = (arr) => {
  arr.forEach((item) => {
    if (item.treeType === 'org') {
      item.disabled = true
    }
    if (item.children && item.children.length) {
      forMatData(item.children)
    }
  })
}
const treeValueChange = (data)=>{
  if(data.length !== 0){
    showError.value = false
  } 
}
const searchCollectorList = () => {
  getInfo(currentRouter.query.formId, 'write_gather').then((res) => {
    console.log('1111',res)
    collectorList.value = res
  })
}
const openUrlEvent = (value) => {
  console.log(value)
  switchStatus(currentRouter.query.formId, isOpenUrl.value, writeQrCodeId.value).then((res) => {
    console.log(res)
  })
}
const openSingleUrlEvent = (value) => {
  setSingleShareSwitchStatus(currentRouter.query.formId,value).then(()=>{
  })
}
const resetData = ()=>{
  showError.value = false
  chooseHuman.value = ''
}
const closeEvent = () => {
  resetData()
}

const cancelEvent = () => {
  dialogConfig.show = false
}
const confirmEvent = () => {
  if (chooseHuman.value) {
    addCollector({
      formId: currentRouter.query.formId,
      gatherUserId: chooseHuman.value,
      passwordSwitch: false
    }).then(() => {
      ElMessage.success('添加成功')
      dialogConfig.show = false
      searchCollectorList()
    })
  } else {
    showError.value = true
  }
}

const delAddPerson = (data) => {
  // 删除采集人 
  console.log(data)
  deleteCollector(data.formId, data.id).then((res) => {
    if (res) {
      ElMessage.success('删除成功')
      searchCollectorList()
    }
  })
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const addCollectorEvent = () => {
  resetData()
  dialogConfig.show = true
}
</script>

<style lang="less" scoped>
.PublicRelease {
  height: calc(100vh - 300px);

  .open_url_box {
    padding-top: 16px;

    .text {
      margin-bottom: 20px;
      color: @base-text-color-3;
    }

    .is_open_url {
      .show_url_box {
        margin-top: 20px;

        .password_line {
          margin-top: 20px;
          display: flex;
          align-items: center;

          .text_password {
            margin-right: 8px;
            color: @base-text-color-3;
          }

          .password_input {
            width: 203px;
            margin-left: 16px;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .is_add_person {
    margin-top: 20px;
    width: 824px;

    .add_person_text {
      width: 150px;
      color: #0051D9;
      margin: 22px 0 24px 0;
      cursor: pointer;

      .icon-icon_tianjia {
        margin-right: 9px;
      }
    }

    .person_list {
      padding-left: 24px;
      .each_person_item {
        padding-top: 20px;

        .add_person_name_first {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .add_perpson{
            margin-right: 10px;
            color: @base-text-color-3;
          }

          .icon-icon_qingkong {
            cursor: pointer;
          }
        }

        .add_person_url_second {
          margin-top: 20px;
        }

        .add_person_password_third {
          margin-top: 20px;

          .password_line {
            // margin-top: 20px;
            display: flex;
            align-items: center;

            .text_password {
              margin-right: 8px;
              color: @base-text-color-3;
            }

            .password_input {
              width: 203px;
              margin-left: 16px;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }

  .main_form {
    display: flex;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 40px;
    position: relative;

    .text {
      margin-right: 16px;
    }
    .error_tip{
      position: absolute;
      top: 54px;
      left: 60px;
      font-size: 14px;
      color:red
    }
  }
  .bottom_btns{
    display: flex;
    justify-content: flex-end;
  }

  :deep(.demo_tabs_right) {
    height: 100%;

    .el-tabs__content {
      // height: 100%;
      // overflow-y: auto;
      // font-size: 16px;
      padding-left: 0px !important;
      // padding-right: 30px;
    }

    .el-tabs__item {
      font-size: 16px;
      color: #495770;
    }

    .el-tabs__active-bar {
      background-color: @active-color;
    }

    .el-tabs__item.is-active {
      color: @active-color;
      background: none !important;
      font-weight: bold;
    }
  }
}
</style>