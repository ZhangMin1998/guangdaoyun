<template>
  <div class="passManage">
    <el-tabs class="custom-tabs" stretch v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="待审批" name="待审批"></el-tab-pane>
      <el-tab-pane label="已重置" name="已重置"></el-tab-pane>
      <el-tab-pane label="全部" name="全部"></el-tab-pane>
    </el-tabs>

    <div class="input_box">
      <el-input
        id="el_input"
        style="width:321px;height: 40px;font-size:16px;"
        v-model="searchParam"
        placeholder="请输入用户账号/姓名"
        @keyup.enter="search"
      >
        <template #suffix>
          <i 
            class="iconfont icon-icon_sousuo"
            style="font-size:14px;color:#495770"
            v-debounce="search"
          />
        </template>
      </el-input>
    </div>

    <KeepAlive>
      <div class="table_content">
        <Table
          type='data'
          v-loading="isLoading"
          v-model:pageNum='pageNum'
          :tableColumns='tableColumns'
          :tableData='tableData'
          :pageTotal='total'
          :pageSize='10'
          :btnRender2='btnRender'
          @refreshData='refreshData'
        >
          <template v-slot:status="slotProps">
            <el-tooltip v-if="slotProps.row.status === '已失效'" effect="light" content="该用户已被删除" placement="top">
              <div class="status_box_grey">
                {{ slotProps.row.status }}
              </div>
            </el-tooltip>
            <div v-else-if="slotProps.row.status === '待审批'" class="status_box_blue">
              {{ slotProps.row.status }}
            </div>
            <div v-else-if="slotProps.row.status === '已重置'" class="status_box_green">
              {{ slotProps.row.status }}
            </div>
          </template>
        </Table>
      </div>
    </KeepAlive>

    <Dialog :dialogConfig="dialogConfig">
      <div v-if="dialogConfig.title === '重置密码'">
        <div class="main_info" style="height: 100px;">
          <template v-for="(colItem, colIndex) in resetData.columns" :key="colIndex">
            <div class="main_info_item">
              <div class='label_color'>{{ colItem.label }}：</div>
              <div v-if="colItem.prop === 'newPassword' && !dialogConfig.isReset">
                <span style="color: #3366FF;cursor: pointer;" @click.prevent="clickReset(resetData.data)">重置</span>
              </div>
              <div class='tip_color' v-else>
                {{resetData.data[colItem.prop] ? resetData.data[colItem.prop] : '--'}}
              </div>
            </div>
          </template>
        </div>
        <div style="display:flex; align-items: center;">
          <div v-if="dialogConfig.isReset" style="display:flex; align-items: center;justify-content: flex-start;">
            <i class="iconfont icon-icon_yulan" style="color: #3366FF;font-size: 28px;"></i>
            <div class='tip_color' style="margin-left:16px;" >
              <div>成功重置密码，请保存好用户信息以防无法登陆。</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dialogConfig.title === '详情'">
        <div class="main_info">
          <template v-for="(colItem, colIndex) in detailData.columns" :key="colIndex">
            <div class="main_info_item">
              <div class='label_color'>{{ colItem.label }}：</div>
              <div v-if="colItem.prop === 'status' && detailData.data[colItem.prop] === '已重置'" style="color:#3AB293">
                {{detailData.data[colItem.prop] === '已重置' ? detailData.data[colItem.prop] : '--'}}
              </div>
              <div class='tip_color' v-else>
                {{detailData.data[colItem.prop] ? detailData.data[colItem.prop] : '--'}}
              </div>
            </div>
          </template>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { listApplyByPage, clickApplication, getPassWord } from '@/api/contact'
import Table from '@/components/Table/index.vue'
import Dialog from '@/components/Dialog/index.vue'

const currentTab = ref('待审批')
const searchParam = ref('')
const tableData = ref([])
const pageNum = ref(1)
const total = ref(0)
const isLoading = ref(false)

const detailData = reactive({
  columns: [
    { 'label': '用户账号', 'prop': 'userName' },
    { 'label': '密码', 'prop': 'newPassword' },
    { 'label': '部门名称', 'prop': 'departmentName' },
    { 'label': '申请总次数', 'prop': 'applicationNumber' },
    { 'label': '申请时间', 'prop': 'createTimes' },
    { 'label': '姓名', 'prop': 'realName' },
    { 'label': '警员编号', 'prop': 'jobNumber' },
    { 'label': '申请事项', 'prop': 'applicationType' },
    { 'label': '状态', 'prop': 'status' },
    { 'label': '审批时间', 'prop': 'approvalTimes' }
  ],
  data: {}
})
const resetData = reactive({
  columns: [
    { 'label': '用户账号', 'prop': 'userName' },
    { 'label': '密码', 'prop': 'newPassword' },
    { 'label': '姓名', 'prop': 'realName' },
    { 'label': '警员编号', 'prop': 'jobNumber' }
  ],
  data: {}
})

interface Config {
  show: boolean,
  title: string,
  content: string,
  width: string,
  top: string,
  isReset: boolean
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '详情',
  content: '',
  width: '600px',
  top: '',
  isReset: false
})

// 重置密码
const resetPass = (row) => {
  resetData.data = row
  dialogConfig.title = '重置密码'
  dialogConfig.show = true
  dialogConfig.isReset = false
}

// 点击重置
const clickReset = async (item) => {
  const params = {
    id: item.id
  }
  await clickApplication(params)
  const params2 = {
    password: item.applicationPassword
  }
  const res = await getPassWord(params2)
  item.newPassword = res
  resetData.data = {}
  resetData.data = item
  
  nextTick(() => {
    dialogConfig.isReset = true
  })
  search()
}
// 详情
const openDetail = (row) => {
  const params = {
    password: row.applicationPassword
  }
  getPassWord(params).then(res => {
    row.newPassword = res
    detailData.data = row
  }).finally(() => {
    dialogConfig.title = '详情'
    dialogConfig.show = true
  })
}
const tableColumns = [
  { label: '用户账号', prop: 'userName', minWidth: '10%' },
  { label: '姓名', prop: 'realName', minWidth: '10%' },
  { label: '部门名称', prop: 'departmentName', minWidth: '10%' },
  { label: '申请事项', prop: 'applicationType', minWidth: '10%' },
  { label: '状态', prop: 'status', minWidth: '10%', haveSlot: true },
  { label: '申请总次数', prop: 'applicationNumber', minWidth: '10%' },
  { label: '申请时间', prop: 'createTimes', minWidth: '10%' },
  { label: '审批时间', prop: 'approvalTimes', minWidth: '10%' }
]
const btnRender = [
  {
    label: '审批',
    icon: 'icon-a-zu5602',
    btnEvent: resetPass,
    title: '审批',
    status: '待审批'
  },
  {
    label: '详情',
    icon: 'icon-icon_xiangqing',
    btnEvent: openDetail,
    title: '详情',
    status: '已重置'
  }
]
const refreshData = (e) => {
  pageNum.value = e
  search()
}
// function debounce (fun, delay = 500) {
//   let timeId = null
//   return function(...args) {
//     clearTimeout(timeId)
//     timeId = setTimeout(function() {
//       fun.apply(this, args)
//       clearTimeout(timeId)
//       timeId = null
//     }, delay)
//   }
// }

const search = () => {
  isLoading.value = true
  const obj = {
    pageNum: pageNum.value,
    pageSize: 10,
    key: searchParam.value,
    status: currentTab.value === '全部' ? '' : currentTab.value
  }
  listApplyByPage(obj).then((res:any) => {
    isLoading.value = false
    tableData.value = res.content
    total.value = res.totalSize
  })
}
const handleClick = (tab) => {
  currentTab.value = tab.paneName
  search()
}

onMounted(() => {
  search()
})
</script>

<style lang="less" scoped>
.passManage{
  height: 100%;
  width: 100%;
  background: #FFFFFF;
  margin: 0;
  padding: 0 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .custom-tabs{
    width: 100%;
  }
  :deep(.el-tabs){
    // width: 378px;
    // width: 100%;
    .el-tabs__active-bar{
      // width: 126px !important;
      height: 1px !important;
      background-color: @active-color;
    }
    .el-tabs__nav{
      height: 74px;
    }
    .el-tabs__item{
      flex: 0 0 126px;
      padding: 0 !important;
      // padding: 0 20px !important;
      font-size: 18px !important;
      height: 74px !important;
      // width: 126px !important;
      &.is-active {
        color: @active-color;
        // font-weight: bold;
      }
      &:hover{
        color: @active-color;
      }
    }
    .el-tabs__nav-wrap::after{
      height: 1px;
    }
  }
  .input_box{
    position: absolute;
    right: 25px;
    top: 16px;
    z-index: 999;
  }
  .table_content{
    overflow-y: auto;
    flex: 1;
    padding-bottom: 24px;
  }
  .status_box_blue{
    width: 72px;
    height: 28px;
    color: #3366FF;
    border: 1px solid #3366FF;
    background: rgba(51,102,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .status_box_grey{
    width: 72px;
    height: 28px;
    color: #C0C4CC;
    border: 1px solid #C0C4CC;
    background: rgba(192,196,204,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .status_box_green{
    width: 72px;
    height: 28px;
    color: #00A870;
    border: 1px solid #00A870;
    background: rgba(0,168,112,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main_info{
    height: 200px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .main_info_item{
      line-height: 14px;
      margin-top: 20px;
      display: flex;
      .label_color{
        width: 100px;
      }
      @media screen and (min-width: 1024px) and (max-width: 1365px){
        .label_color{
          width: 115px;
        }
      }
    }
  }
  :deep(.pagination_wrap){
    margin-top: 20px;
  }
}
</style>