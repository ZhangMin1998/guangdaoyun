<template>
  <div v-if="permissionArray.length === 1 && permissionArray[0] === 'add_data_only'">
    <OnlyAddData :formId="formId" />
  </div>
  <div class="right_list" v-else-if="permissionArray.length">
    <div class="header_box">
      <div class="header_left">
        <el-input v-model="searchParams.search" placeholder="请输入" clearable @change="inputSearchEvent">
          <template #suffix>
            <i class="iconfont icon-icon_sousuo" @click="inputSearchEvent"></i>
          </template>
        </el-input>
      </div>
      <div class="header_right_btns">
        <el-button plain size="large" class="blank"
                   v-if="comparePermission(['add_and_manage_personal_data', 'manage_all_data'])"
                   @click="linkManage">链接管理</el-button>
        <el-button plain class="blank" size="large" @click="setFileds">字段设置</el-button>
        <el-button type="primary" size="large" @click="addData"
                   v-if="comparePermission(['add_data_only', 'add_and_manage_personal_data', 'add_and_read_all_data', 'manage_all_data'])">添加数据</el-button>
      </div>
    </div>
    <div class="main_list_box">
      <!-- 普通带序号，使用者自己table的data数据,带多选 -->
      <Table type='data' v-model:pageNum='tableData.pageNum' v-if="tableData.tableColumns.length"
             :tableColumns='tableData.tableColumns' :tableData='tableData.data' :multiple='true' btnRenderWidth="120px"
             :pageTotal='tableData.totalSize' :pageSize='tableData.pageSize' :btnRender='btnRender' @refreshData='refreshData'>
        <template #founder="{ row }">
          <div :title="row.founder && row.founder.realName || '--'">
            {{ row.founder && row.founder.realName || '--' }}
          </div>
        </template>
        <template #gather_user_id="{ row }">
          <div :title="row.gather_user_id && row.gather_user_id.realName || '--'">
            {{ row.gather_user_id && row.gather_user_id.realName || '--' }}
          </div>
        </template>
        <!-- <template v-for="(item,index) in tableData.tableColumns" :key="index" v-slot:item.prop="{ ...props }">
            <div> 22222222
            </div>
        </template> -->
        <!-- <template #btnRenderSlot="{ row }">
          <div class="btn_list">
            <i class='iconfont icon-icon_fenxiang' v-if="isSingleShare" @click="shareLink" title='分享链接'></i>
            <i class='iconfont icon-icon_bianji'  @click="editEvent" title='编辑'></i>
            <i class='iconfont icon-icon_qingkong' @click="delItemClick" title='删除'></i>
          </div>
        </template> -->
      </Table>
    </div>
  </div>
  <div class="no_permission" v-else-if="permissionArray.length === 0 && isShowPermission">
    <div class="EmptyData">
      <div class="no_permission_box">
        <img src="@/assets/img/no-permission.png" alt="" />
        <div>暂无权限</div>
      </div>
    </div>
  </div>
  <Dialog :dialogConfig="dialogConfig">
    <div class="dialog_box">
      <div class="link_manage" v-if="dialogConfig.title === '链接管理'">
        <LinkManage :formId="formId" :isSingleShare="isSingleShare" />
      </div>
      <div class="share" v-if="dialogConfig.title === '分享'">
        <CopyAndOpenUrl :hasText="true" :url="singleSharingUrl"></CopyAndOpenUrl>
        <OpenWithPassword v-model:passwordSwitchStatus="passwordSwitchStatus" v-model:password="password"
                          v-model:id="readId" :formId="formId" :isSetReadPassword="true">
        </OpenWithPassword>
      </div>
      <div class="field_setting" v-if="dialogConfig.title === '字段设置'">
        <el-checkbox-group v-model="checkIdList" min="1">
          <el-checkbox v-for="item in FieldList" :key="item.id" :label="item.id">
            {{ item.fieldCn }}
          </el-checkbox>
        </el-checkbox-group>

        <div class="btns">
          <el-button @click="cancelEvent">取消</el-button>
          <el-button type="primary" @click="confirmEvent">确定</el-button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch,onUnmounted } from 'vue'
import { setLocal, getLocal, removeLocal } from '@/utils'
import Table from '@/components/Table/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import CopyAndOpenUrl from '@/views/home/create-form/components/CopyAndOpenUrl.vue'
import OpenWithPassword from '@/views/home/create-form/components/OpenWithPassword.vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import LinkManage from './LinkManage.vue'
import OnlyAddData from './OnlyAddData.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFieldList, getFormList, singleDataSharing, deleteSingleData, getMemberMenu } from '@/api/homedetail'


const props = defineProps({
  formId: {
    type: Number
  },
  isSingleShare: {
    type: Boolean
  }
})
// formId
const router = useRouter()
const currentRoute = useRoute()
let btnRender = [

]
// 添加采集人
interface Config {
  show: boolean,
  title: string,
  width: string,
  isShowBtn: boolean
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '链接管理',
  width: '1324px',
  isShowBtn: false
})
const password = ref('')
const singleSharingUrl = ref('')
const passwordSwitchStatus = ref(false)
const readId = ref(null)
const checkIdList = ref([])
const subCheckIdList = ref([])
const FieldList: any = ref([])
const permissionArray: any = ref([])
const isShowPermission = ref(false)
const tableData = reactive({
  data: [],
  tableColumns: [],
  pageNum: 1,
  pageSize: 10,
  totalSize: 10
})
const searchParams = reactive({
  search: '',
  pageNum: 1,
  pageSize: 10
})

onMounted(() => {
  window.addEventListener('beforeunload', handlePageRefresh)
  // 获取权限数组
  getPermission()

  // 获取字段设置的全部字段
  getFieldListEvent()
})
onUnmounted(()=>{
  window.removeEventListener('beforeunload', handlePageRefresh)
})
onBeforeRouteLeave((to) => {//离开当前的组件时触发
  if (to.name !== 'adddata' && to.name !== 'createform') {
    removeLocal('showHeaderObj')
  }
})

watch(() => props.formId, (newVal) => {
  if (newVal) {
    // 获取权限数组
    getPermission()
    // 获取字段设置的全部字段
    getFieldListEvent()
  }
})

const handlePageRefresh= ()=>{
  removeLocal('showHeaderObj')
}
const getPermission = () => {
  getMemberMenu({ formId: props.formId }).then((res) => {
    permissionArray.value = res
    isShowPermission.value = true

    const isShowEdit = comparePermission(['add_and_manage_personal_data', 'manage_all_data'])
    if (isShowEdit) {
      btnRender = [
        !props.isSingleShare ? '' :
          {
            label: '分享链接',
            icon: 'icon-icon_fenxiang',
            btnEvent: shareLink,
            title: '分享链接',
            style: { 'font-size': '24px', color: '#495770', 'margin-right': '3px' }
          },
        {
          label: '编辑',
          icon: 'icon-icon_bianji',
          btnEvent: editEvent,
          title: '编辑',
          style: { 'font-size': '24px', color: '#495770', 'margin-right': '3px' }
        },
        {
          label: '删除',
          icon: 'icon-icon_qingkong',
          btnEvent: delItemClick,
          title: '删除',
          style: { 'font-size': '20px', color: '#495770' }
        }
      ]
    } else {
      btnRender = []
    }
    if (comparePermission(['add_and_manage_personal_data', 'add_and_read_all_data', 'manage_all_data', 'read_all_data'])) {
      // 获取列表
      dependFormIdGetList()
    } else {
      tableData.data = []
    }
  })
}

const dependFormIdGetList = () => {
  getFormList({ formId: props.formId, ...searchParams }).then((res: any) => {
    tableData.tableColumns = forMatTableHeader(res.fieldVOList)
    const showHeaderObj = JSON.parse(getLocal('showHeaderObj'))
    if (showHeaderObj && showHeaderObj[props.formId]) {
      tableData.tableColumns = showHeaderObj[props.formId]
    }
    tableData.data = res.page?.content || []
    tableData.totalSize = res.page?.totalSize
  })
}

const comparePermission = (data) => {
  // const add = ['add_data_only','add_and_manage_personal_data','add_and_read_all_data','manage_all_data','read_all_data']
  let key = false
  // const add = ['add_data_only','add_and_manage_personal_data','add_and_read_all_data','manage_all_data']
  permissionArray.value.forEach((item) => {
    if (data.includes(item)) {
      key = true
    }
  })
  return key
}

const inputSearchEvent = () => {
  dependFormIdGetList()
}

const forMatTableHeader = (data) => {
  data.forEach((item) => {
    item.label = item.fieldCn
    item.prop = item.fieldEn
    item.minWidth = '10%'
    // const haveSlotList = ['user', 'checkbox', 'el-transfer', 'tree', 'cascader', 'fc-editor']
    const haveSlotList = ['user']
    const showHtmlList = ['fc-editor']
    const showOnlyValueList = ['checkbox', 'el-transfer', 'tree', 'cascader']
    if (haveSlotList.includes(item.moduleType)) {
      item.haveSlot = true
    } else if (showHtmlList.includes(item.moduleType)) {
      item.showHtml = true
    } else if (showOnlyValueList.includes(item.moduleType)) {
      item.showOnlyValue = true
    }
  })
  return data
}

const getFieldListEvent = () => {
  getFieldList(props.formId).then((res: any) => {
    // 所有的字段
    FieldList.value = res
    // 已选的
    checkIdList.value = res.reduce((idList, item) => {
      if (item.display) {
        idList.push(item.id)
      }
      return idList
    }, [])
    const showHeaderObj = JSON.parse(getLocal('showHeaderObj'))
    if (showHeaderObj && showHeaderObj[props.formId]) {
      checkIdList.value = showHeaderObj[props.formId].reduce((idList, item) => {
        if (item.display) {
          idList.push(item.id)
        }
        return idList
      }, [])
    }
    subCheckIdList.value = checkIdList.value
  })
}

const cancelEvent = () => {
  checkIdList.value = subCheckIdList.value
  dialogConfig.show = false
}

const confirmEvent = () => {
  if (dialogConfig.title === '字段设置') {
    // 字段设置的确认按钮
    const showTableHeader = FieldList.value.filter((item) => {
      return checkIdList.value.includes(item.id)
    })
    // subCheckIdList.value = checkIdList.value
    tableData.tableColumns = forMatTableHeader(showTableHeader)
    // let showHeader = {}
    const showHeaderObj = JSON.parse(getLocal('showHeaderObj')) || {}
    showHeaderObj[props.formId] = tableData.tableColumns
    setLocal('showHeaderObj', JSON.stringify(showHeaderObj))
    dialogConfig.show = false
    // setFieldList({
    //   formId: props.formId,
    //   idList: checkIdList.value
    // }).then((res: any) => {
    //   if (res) {
    //     dialogConfig.show = false
    //     subCheckIdList.value = checkIdList.value
    //     // 获取列表
    //     dependFormIdGetList()
    //   }
    // })
  }
}
const toEditPage = (type, rowdata) => {
  const { data, appName } = currentRoute.query
  router.push({ path: '/adddata', query: { formId: props.formId, data, appName, type, rowdata: JSON.stringify(rowdata) } })
}

function refreshData(pageNum: number): void {
  searchParams.pageNum = pageNum
  dependFormIdGetList()
}
function editEvent(data) {
  toEditPage('edit', data)
}
function shareLink(row) {
  singleDataSharing({
    'formId': props.formId,
    'dataId': row.id
  }).then((res: any) => {
    readId.value = res.id
    // singleSharingUrl.value = window.location.origin + res.linkUrl
    singleSharingUrl.value = 'http://202.105.96.110:21185' + res.linkUrl
    dialogConfig.title = '分享'
    dialogConfig.width = '800px'
    dialogConfig.show = true
  })

}
function delItemClick(row) {
  ElMessageBox.confirm(
    '请确认是否删除',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteSingleData(props.formId, row.id).then((res) => {
      if (res) {
        ElMessage.success('删除成功')
        // 获取列表
        dependFormIdGetList()
      }
    })
  })

}
const linkManage = () => {
  dialogConfig.title = '链接管理'
  dialogConfig.width = '1324px'
  dialogConfig.show = true
}
const setFileds = () => {
  dialogConfig.title = '字段设置'
  dialogConfig.width = '1248px'
  dialogConfig.show = true
}
const addData = () => {
  toEditPage('add', '')
}
// const cancleSubmit = () => {

// }
// const confirm = () => {

// }

</script>

<style lang="less" scoped>
.right_list {
  height: 100%;
  width: 100%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  .header_box {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header_left {
      width: 320px;

      .el-input {
        height: 40px;
      }

      .icon-icon_sousuo {
        color: #495770;
        cursor: pointer;
      }
    }
  }

  .main_list_box {
    padding-bottom: 24px;
    flex: 1;
    width: 100%;

    // .btn_list {
    //   display: flex;
    //   align-items: center;

    //   i {
    //     cursor: pointer;
    //     color: #495770;
    //   }

    //   .icon-icon_fenxiang,
    //   .icon-icon_bianji {
    //     font-size: 24px;
    //     margin-right: 3px;
    //   }

    //   .icon-icon_qingkong {
    //     font-size: 20px;
    //   }
    // }

  }

}

.no_permission {
  height: 100%;

  .EmptyData {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .no_permission_box {
      text-align: center;
      color: @base-text-color-3;
    }
  }
}

.dialog_box {
  .field_setting {
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>