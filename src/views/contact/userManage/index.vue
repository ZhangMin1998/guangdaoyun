<template>
  <div class="user_manage">
    <div class="left">
      <el-input
        id="el_input"
        class="input_filter"
        placeholder="请输入部门名称"
        maxlength="30"
        v-model="filterText"
      >
        <template #suffix>
          <i 
            class="iconfont icon-icon_sousuo"
            style="font-size:14px;color:#495770"
          />
        </template>
      </el-input>
      <div class="el_tree_box">
        <el-tree
          class="filter-tree"
          v-loading="treeLoading"
          element-loading-text="数据正在加载中"
          :data="userTreeData"
          :props="defaultProps"
          @node-click="nodeClick"
          default-expand-all
          highlight-current
          node-key="orgId"
          :filter-node-method="filterNode"
          ref="tree"
          empty-text="暂无数据"
          :expand-on-click-node="false"
        >
          <template v-slot="{ node }">
            <span class="custom-tree-node">
              <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <div class="table_main">
        <div class="table_main_search">
          <div class="search_box">
            <div class="search_input">
              <el-input
                id="el_input"
                style="width:400px;height: 40px;font-size:16px;"
                v-model="table.params.searchKey"
                placeholder="请输入用户账号/姓名"
                @keyup.enter="searchEvent"
              >
                <template #suffix>
                  <i 
                    class="iconfont icon-icon_sousuo"
                    style="font-size:14px;color:#495770"
                    v-debounce="searchEvent"
                  />
                </template>
              </el-input>
            </div>
            <div class="addRoleBtn">
              <div
                class="blank_button"
                @click="changeDepartment"
              >
                转部门
              </div>
              <div class="submit_btn" @click="addUser">新建</div>
            </div>
          </div>
        </div>
        <div class="table_box">
          <Table
            type="data"
            :isLoading="table.isLoading"
            v-model:pageNum="table.pageData.curPage"
            :table-data="table.tableData"
            :table-columns="table.columns"
            :page-total="table.pageData.total"
            :page-size="table.pageData.pageSize"
            :multiple="true"
            :btnRender="btnRender"
            :indexColWidth="70"
            @refreshData="refreshData"
            @select="handleSelectionChange"
            @select-all="handleSelectionChange"
          >
            <template v-slot:status="slotProps">
              <div class="switch_box">
                <span class="switch_tip" v-if="slotProps.row.status === 'enable'">{{ slotProps.row.activeText || '启用' }}</span>
                <span class="switch_tip" v-else-if="slotProps.row.status === 'disable'">{{ slotProps.row.inactiveText || '禁用' }}</span>
                <el-switch
                  class="aside-switch"
                  size="small"
                  v-model="slotProps.row.status"
                  :active-value="'enable'"
                  :inactive-value="'disable'"
                  active-color="#3366ff"
                  inactive-color="#f1f2f5"
                  @change="switchChange(slotProps.row)"
                ></el-switch>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <Dialog :dialogConfig="popTipsData" @closeEvent="closeTipsDailog">
      <div class="dialog_box">
        <div class="tips" v-if="popTipsData.text">
          <i class="iconfont icon-icon_yulan"></i>
          <div class="warning_txt">{{ popTipsData.text }}</div>
        </div>
        <div class="main_info" style="height: 100px;" v-if="popTipsData.key === 'add'">
          <template v-for="(colItem, colIndex) in infoTable.columns" :key="colIndex">
            <div class="main_info_item">
              <div class='label_color'>{{ colItem.label }}：</div>
              <div class='tip_color'>
                {{infoTable.data[colItem.prop] ? infoTable.data[colItem.prop] : '--'}}
              </div>
            </div>
          </template>
        </div>
        
        <div class="btn" v-if="popTipsData.key !== 'add'">
          <div class="blank_button" @click="cancleSubmit">取消</div>
          <div class="submit_btn" @click="confirm">确定</div>
        </div>
      </div>
    </Dialog>
    <!-- 新建/编辑/转部门 -->
    <Dialog :dialogConfig="popData" ref="popRef" @closeEvent="closeEvent">
      <BuildNewPop
        ref="buildRef"
        :popTyle="popData.title"
        :editData="currentRow"
        :popTreeData="popTreeData"
        :checkedList="checkedList"
        :departmentData="currentNodeData"
        @cancleSubmit="closeEvent"
        @confirm="confirmBuild"
      ></BuildNewPop>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { contactStore } from '@/stores/contact'
import { userStore } from '@/stores/login'
import { authOrgListWithTree, listTreeWithRole } from '@/api/home'
import { queryUserByOrgId, updateByUserId, getAllRoleByUserId } from '@/api/contact'
import { ElMessage } from 'element-plus'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import Table from '@/components/Table/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import BuildNewPop from './components/buildNewPop.vue'

const store = contactStore()
const uStore = userStore()
const filterText = ref('')
const defaultProps = {
  children: 'children',
  label: 'orgName'
}
const userTreeData = ref([])
const tree = ref(null)
watch(filterText, newVal => {
  tree.value.filter(newVal)
})
const readOnly = ref(true)
const table = ref({
  tableData: [],
  columns: [],
  pageData: {
    curPage: 1,
    pageSize: 10,
    total: 0,
    btnRenderWidth: '8%'
  },
  // 加载条
  isLoading: false,
  params: {
    pageNum: 1,
    pageSize: 10,
    orgId: '',
    searchKey: ''
  }
})
const infoTable = reactive({
  columns: [
    { 'label': '用户账号', 'prop': 'username' },
    { 'label': '密码', 'prop': 'passWord' },
    { 'label': '姓名', 'prop': 'realName' },
    { 'label': '警员编号', 'prop': 'jobNumber' }
  ],
  data: {}
})
const currentNodeData = ref(null)
const currentRow = ref({})
const userInfo = ref({
  id: 0,
  status: ''
})
const checkedList = ref([])
const treeLoading = ref(true)
const popTipsData = ref({
  show: false,
  title: '提示',
  width: '540px',
  text: '',
  key: ''
})

const popData = ref({
  show: false,
  title: '提示',
  width: '880px',
  text: '',
  key: ''
})

const popTreeData = ref([])

watch(readOnly, newVal => {
  if (!newVal) {
    table.value.columns = [
      { label: '用户账号', prop: 'username', minWidth: '8%' },
      { label: '姓名', prop: 'realName', minWidth: '11%' },
      { label: '警员编号', prop: 'jobNumber', minWidth: '8%' },
      { label: '角色名称', prop: 'roleName', minWidth: '10%' },
      { label: '部门名称', prop: 'orgName', minWidth: '10%' },
      { label: '手机', prop: 'mobile', minWidth: '11%' },
      { label: '创建人', prop: 'createBy', minWidth: '8%' },
      { label: '创建时间', prop: 'createTime', minWidth: '14%' },
      {
        label: '状态',
        prop: 'status',
        minWidth: '10%',
        haveSlot: true,
        type: 'aside-switch',
        activeText: '启用',
        inactiveText: '禁用',
        onValue: 'enable',
        offValue: 'disable'
      }
    ]
  } else {
    table.value.columns = [
      { label: '用户账号', prop: 'username', minWidth: '8%' },
      { label: '姓名', prop: 'realName', minWidth: '12%' },
      { label: '警员编号', prop: 'jobNumber', minWidth: '8%' },
      { label: '角色名称', prop: 'roleName', minWidth: '10%' },
      { label: '部门名称', prop: 'orgName', minWidth: '10%' },
      { label: '手机', prop: 'mobile', minWidth: '11%' },
      { label: '创建人', prop: 'createBy', minWidth: '8%' },
      { label: '创建时间', prop: 'createTime', minWidth: '14%' }
    ]
  }
})

const btnRender = computed(() => {
  let btnRender = [
    {
      label: '编辑',
      icon: 'icon-icon_bianji',
      btnEvent: editUser,
      alt: '编辑',
      title: '编辑',
      key: 'department_management:role_edit'
    },
    {
      label: '删除',
      icon: 'icon-a-zu6211',
      btnEvent: deleteUser,
      alt: '删除',
      title: '删除',
      key: 'department_management:role_edit'
    }
  ]
  if (readOnly.value) {
    btnRender = []
  }
  return btnRender
})

const closeEvent = () => {
  popData.value.show = false
}

const nodeClick = (info, keepSearchParam) => {
  currentNodeData.value = info
  table.value.isLoading = true
  table.value.params.orgId = info.orgId
  table.value.params.pageNum = 1
  readOnly.value = info.readOnly
  if (keepSearchParam) {
    table.value.params.searchKey = ''
  }
  queryUserByOrgId(table.value.params).then((res:any) => {
    table.value.isLoading = false
    table.value.tableData = res.content
    table.value.pageData.curPage = res.pageNum
    table.value.pageData.total = res.totalSize
  })
}
const filterNode = (value, data) => {
  if (!value) return true
  return data.orgName.indexOf(value) !== -1
}
const handlerData = (res) => {
  treeLoading.value = false
  userTreeData.value = res
  
  if (res.length > 0) {
    //默认点击
    nextTick().then(() => {
      // 默认选中第一个
      const firstNode:any = document.querySelector('.el-tree-node')
      if (firstNode) firstNode.click()
    })
  }
}
// 查询部门树数据
const queryDepartmentTree = () => {
  treeLoading.value = true
  authOrgListWithTree().then((res:any) => {
    if (res.length) {
      res.forEach((item, index, arr) => {
        if (item.orgName === '未分配分组' || item.createBy == 'unknow') {
          readOnly.value = false
          arr.splice(index, 1)
          arr.push(item)
        }
      })
    }
    store.set_organizationalTreeList(res)
    handlerData(res)
  })
}
// 账号搜索
const searchEvent = () => {
  table.value.isLoading = true
  queryUserByOrgId(table.value.params).then((res:any) => {
    table.value.isLoading = false
    // console.log(res)
    table.value.tableData = res.content
    table.value.pageData.curPage = res.pageNum
    table.value.pageData.total = res.totalSize
  })
}
// 点击转部门
const changeDepartment = () => {
  if (checkedList.value.length) {
    popData.value.title = '转部门'
    popData.value.show = true
  } else {
    ElMessage.info('请先选择人员再进行转部门')
  }
}
// 新建
const addUser = () => {
  currentRow.value = {}
  popData.value.title = '新建'
  popData.value.width = '880px'
  popData.value.show = true
}

// 分页查询
const refreshData = (e) => {
  table.value.params.pageNum = e
  searchEvent()
}
const arrageParams = (status) => {
  userInfo.value.id = currentRow.value.userId
  userInfo.value.status = status
}
const switchChange = (row) => {
  if (!row.roleName) return
  row.status = row.status === 'disable' ? 'enable' : 'disable'
  currentRow.value = row

  if (row.orgName === '未分配分组') {
    return
  }

  if (row.status === 'enable') {
    arrageParams('disable')
    updateByUserId(userInfo.value.id, userInfo.value).then((res:any) => {
      if (res.code === 1) {
        ElMessage.success('该用户禁用成功')
        nodeClick(currentNodeData.value, false)
      } else {
        ElMessage.error(res.msg)
      }
    })
  } else {
    // 启用时直接调接口启用
    arrageParams('enable')
    updateByUserId(userInfo.value.id, userInfo.value).then((res:any) => {
      if (res.code === 1) {
        ElMessage.success('该用户启用成功')
        nodeClick(currentNodeData.value, false)
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}

const handleSelectionChange = (selection) => {
  // console.log(selection)
  checkedList.value = selection
}

const editUser = (row) => {
  currentRow.value = {}
  currentRow.value = row
  getAllRoleByUserId({ userId: row.userId }).then((res:any) => {
    const tempArr = res.reduce((pre, cur) => {
      pre.push('role-' + cur.id)
      return pre
    }, [])
    currentRow.value.treeId = tempArr
    popData.value.title = '编辑'
    popData.value.show = true
  })
}
const deleteUser = (row) => {
  if ((uStore as any).userInfo.username === row.username) {
    ElMessage.error('抱歉，您无法对自己的账号进行删除操作')
    return
  }
  currentRow.value = row
  popTipsData.value.show = true
  popTipsData.value.text = '删除后，该用户将无法登陆，并对数据永久删除，您确定要删除该用户信息吗？'
  popTipsData.value.key = 'deleteRow'
}

const closeDailog = () => {
  popData.value.show = false
  popTipsData.value.show = false
  popTipsData.value.text = ''
  popTipsData.value.key = ''
  // setTimeout(() => {
  //   resetpopData()
  // }, 0)
}

// 点击取消
const cancleSubmit = () => {
  closeDailog()
}
const confirm = () => {
  if (popTipsData.value.key === 'deleteRow') {
    arrageParams('delete')
    updateByUserId(userInfo.value.id, userInfo.value).then(() => {
      ElMessage.success('删除成功')
      nodeClick(currentNodeData.value, false)
      popTipsData.value.show = false
    })
  }
}
const confirmBuild = (userInfo, type) => {
  popData.value.show = false
  
  if (type === 'add') {
    popTipsData.value.text = '成功新建用户，以下是用户信息，请保存以防无法登陆'
    popTipsData.value.key = 'add'
    infoTable.data = userInfo
    popTipsData.value.show = true
  } else {
    nodeClick(currentNodeData.value, false)
  }
  
}
const closeTipsDailog = () => {
  if (popTipsData.value.key === 'add') {
    popTipsData.value.show = false
    popTipsData.value.text = ''
    popTipsData.value.key = ''
    nodeClick(currentNodeData.value, false)
  }
}
const forMatData = (arr) => {
  arr.forEach((item) => {
    if (item.treeType === 'org') {
      item.disabled = true
    }
    if (item.children && item.children.length) {
      forMatData(item.children)
    }
    if (!item.children) item.children = []
  })
}
const getDepartmentTreeWithRole = () => {
  listTreeWithRole().then((res) => {
    if (res.length) forMatData(res)
    store.set_departmentTreeWithRoleList(res)
    popTreeData.value = res as any
  })
}

onMounted(() => {
  queryDepartmentTree()
  getDepartmentTreeWithRole()
})
</script>

<style lang="less" scoped>
.user_manage{
  height: 100%;
  width: 100%;
  // background: pink;
  display: flex;
  .left{
    height: 100%;
    width: 18%;
    background: #FFFFFF;
    padding: 50px 0 0 0;
    .input_filter {
      margin: 0 20px 27px;
      width: calc(100% - 40px);
    }
    :deep(.el-input__wrapper){
      box-shadow: 0 0 0 0 !important;
      border-radius: 0px;
      border-bottom: 1px solid #D6DBE3 !important;
      .el-input__inner{
        color: #0D162A;
        font-size: 16px;
      }
    }
    .el_tree_box{
      min-height: 300px;
      overflow-y: auto;
      .custom-tree-node {
        display: flex;
        flex: 1;
        width: 100%;
        // height: 100%;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
        padding-left: 2px;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        // :deep(.el-tree-node__content){
        //   height: 32px !important;
        // }
        .em-tree-text {
          display: inline-block; //block一样
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
          font-size: 16px !important;
          color: #0D162A;
        }
      }
      :deep(.el-tree-node__content){
        height: 32px !important;
      }
    }
  }
  .right{
    margin-left: 20px;
    flex: 1;
    background: #fff;
    height: 100%;
    width: 100%;
    overflow: hidden;;
    box-sizing: border-box;
    padding: 20px 20px 24px 20px;
    .table_main{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .table_main_search{
        .search_box{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          .addRoleBtn {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .blank_button{
              padding: 12px 23px;
              line-height: 14px;
              font-size: 16px;
              color: #0052D9;
              border: 1px solid #0052D9;
              cursor: pointer;

              &:hover {
                color: #fff;
                background-color: #0052D9 !important;
              }
            }
            .submit_btn{
              margin-left: 20px;
              padding: 12px 31px;
              line-height: 14px;
              font-size: 16px;
              color: #fff;
              border: 1px solid #0052D9;
              background-color: #0052D9 !important;
              cursor: pointer;

              &:hover {
                background-color: #1890ff !important;
                border: 1px solid #1890ff;
              }
            }
          }
        }
      }
      .table_box{
        overflow-y: auto;
        flex: 1;
      }
      .switch_box{
        display: flex;
        align-items: center;
        .switch_tip{
          color: #0D162A;
          margin-right: 8px
        }
      }
    }
  }
  .dialog_box{
    box-sizing: border-box;
    padding: 0px 12px 0 4px;
    .tips {
      display: flex;
      align-items: center;
      .iconfont {
        display: inline-block;
        color: #3366ff;
        font-size: 64px;
      }
      .warning_txt {
        font-size: 16px;
        line-height: 22px;
        padding-left: 20px;
        color: #0D162A;
      }
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
          color: #98A3B7;
          width: 100px;
        }
        .tip_color{
          color: #0D162A;
        }
      }
    }
    .btn {
      display: flex;
      justify-content: flex-end;
      //padding: 8px 0 24px 0;
      box-sizing: border-box;
      margin-top: 54px;
      .blank_button {
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
  }
  :deep(.pagination_wrap){
    margin-top: 20px;
  }
}
</style>