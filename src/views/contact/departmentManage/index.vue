<template>
  <div class="department_manage">
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
          :data="data"
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
          <template v-slot="{ node, data }">
            <span class="custom-tree-node">
              <!-- <span class="em-tree-text" :title="node.label">{{ node.label }}</span> -->
              <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
              <!-- <span
                class="operation"
                v-if="!data.readOnly"
                @click.stop="operationClick(node, data, $event)"
              >···
              </span> -->
              <span
                class="operation"
                v-if="!data.readOnly"
                @click.stop="operationClick(node, data, $event)"
              >···
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div
        class="operation_box"
        v-if="operationInfo.show"
        :style="{ left: operationInfo.clientX, top: operationInfo.clientY }"
      >
        <ul>
          <li v-if="nodeLevel < 9" @click="buildTree(currentNodeData)">新增</li>
          <li @click="changDepartmentName(currentNodeData)">重命名</li>
          <li @click="delDepartment(currentNodeData)">删除</li>
        </ul>
      </div>
      <div class="new_build" v-if="isAdmin">
        <el-button type="primary" @click="buildTree">新建</el-button>
      </div>
    </div>
    <div class="right">
      <div class="table_main" v-if="componentStatus === 'list'">
        <div class="search_box">
          <div class="search_input">
            <el-input
              id="el_input"
              style="width:400px;height: 40px;font-size:16px;"
              v-model="table.params.searchKey"
              placeholder="请输入角色名称"
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
            <el-button type="primary" v-if="!readOnly" @click="addRole">新建</el-button>
          </div>
        </div>
        <div class="table_box">
          <Table
            type="data"
            :isLoading="table.isLoading"
            v-model:pageNum="table.pageData.curPage"
            :table-columns="table.columns"
            :table-data="table.tableData"
            :page-total="table.pageData.total"
            :page-size="table.pageData.pageSize"
            :btnRender="btnRender"
            :indexColWidth="70"
            @refresh-data="refreshData"
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
      <div class="build_new_role" v-if="componentStatus === 'role_detail'">
        <RoleDetail :roleDetailData="roleDetailData" @closeDetail="closeDetail"></RoleDetail>
      </div>
      <div class="build_new_role" v-if="componentStatus === 'build_new'">
        <BuildNew
          @back="closeDetail"
          @refresh="backToOriginTreeStatus"
          :editData="editData"
          :allRoleList="table.tableData"
          :currentDepartmentData="currentNodeData"
          ref="build_new"
        ></BuildNew>
      </div>
    </div>
    <Dialog :dialogConfig="popData">
      <div class="bulid_department">
        <div class="tips" v-if="popData.text">
          <i class="iconfont icon-icon_tishi_xiangqing"></i>
          <div class="warning_txt">{{ popData.text }}</div>
        </div>
        <div v-else>
          <div class="wirte_content" v-if="orgInfo.parentName">
            <span class="txt">上级部门：</span>
            <span class="departmentName">{{ orgInfo.parentName }}</span>
          </div>
          <div class="wirte_content">
            <span class="txt">部门名称：</span>
            <div class="input_department_name">
              <el-input placeholder="请输入" maxlength="30" v-model="orgInfo.orgName"></el-input>
            </div>
          </div>
        </div>
        <div class="btn">
          <div class="blank_button" @click="cancleSubmit">取消</div>
          <div class="submit_btn" @click="confirm">确定</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
// import { getCurrentInstance  } from 'vue'
import { contactStore } from '@/stores/contact'
import { userStore } from '@/stores/login'
import { authOrgCreate, queryRoleByOrgId, queryUserByOrgId } from '@/api/contact'
import { authOrgListWithTree } from '@/api/home'
import { ElMessage } from 'element-plus'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import Table from '@/components/Table/index.vue'
import RoleDetail from './components/roleDetail.vue'
import BuildNew from './components/buildNew.vue'

const store = contactStore()
const user = userStore()
const isAdmin = user.isAdmin
const filterText = ref('')
const defaultProps = {
  children: 'children',
  label: 'orgName'
}
const popData = ref({
  show: false,
  title: '新建',
  width: '494px',
  text: '',
  key: ''
})
const operationInfo = ref({
  show: false,
  clientX: '',
  clientY: ''
})
let orgInfo = ref({
  orgId: 0,
  orgName: '',
  parentId: 0,
  status: true,
  parentName: ''
})
const nodeLevel = ref(0)
const data = ref([])
const tree = ref(null)
const currentNodeData = ref(null)
const componentStatus = ref('list')
const currentRow = ref(null)
const roleInfo = ref({
  id: 0,
  status: ''
})
const readOnly = ref(true)
const table = ref({
  tableData: [],
  columns: [],
  pageData: {
    curPage: 1,
    pageSize: 10,
    total: 0,
    btnRenderWidth: '12%'
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
const roleDetailData = ref({})
const editData = ref({})

const btnRender = computed(() => {
  let btnRender = [
    {
      label: '查看',
      icon: 'icon-icon_xiangqing',
      btnEvent: viewRole,
      alt: '查看',
      title: '查看',
      key: 'department_management:role_edit'
    },
    {
      label: '编辑',
      icon: 'icon-icon_bianji',
      btnEvent: editRole,
      alt: '编辑',
      title: '编辑',
      key: 'department_management:role_edit'
    },
    {
      label: '删除',
      icon: 'icon-a-zu6211',
      btnEvent: deleteRole,
      alt: '删除',
      title: '删除',
      key: 'department_management:role_edit'
    }
  ]
  if (readOnly.value) {
    btnRender = [{
      label: '查看',
      icon: 'icon-icon_xiangqing',
      btnEvent: viewRole,
      alt: '查看',
      title: '查看',
      key: 'department_management:role_edit'
    }]
  }
  return btnRender
})
const treeLoading = ref(true)

watch(filterText, newVal => {
  tree.value.filter(newVal)
})
watch(readOnly, newVal => {
  if (!newVal) {
    table.value.columns = [
      { label: '角色名称', prop: 'roleName', minWidth: '13%', type: 'nor' },
      { label: '创建人', prop: 'createBy', minWidth: '13%', type: 'nor' },
      { label: '创建时间', prop: 'createTime', minWidth: '16%', type: 'nor' },
      { label: '用户数量', prop: 'userNum', minWidth: '8%', type: 'nor' },
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
    table.value.columns =[
      { label: '角色名称', prop: 'roleName', minWidth: '13%', type: 'nor' },
      { label: '创建人', prop: 'createBy', minWidth: '13%', type: 'nor' },
      { label: '创建时间', prop: 'createTime', minWidth: '20%', type: 'nor' },
      { label: '用户数量', prop: 'userNum', minWidth: '8%', type: 'nor' }
    ]
  }
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.orgName.indexOf(value) !== -1
}
const nodeClick = (info, node, cur, type) => {
  console.log(info)
  
  componentStatus.value = 'list'
  currentNodeData.value = info
  table.value.isLoading = true
  table.value.params.searchKey = ''
  table.value.params.orgId = info.orgId
  readOnly.value = false // info.readOnly  false
  if (!type) {
    table.value.params.pageNum = 1
  }
  operationInfo.value.show = false
  queryRoleByOrgId(table.value.params, {}).then((res:any) => {
    // console.log(res)
    table.value.isLoading = false
    table.value.tableData = res.content
    table.value.pageData.curPage = res.pageNum
    table.value.pageData.total = res.totalSize
  })
}
// 点击'''
const operationClick = (node, data, e) => {
  componentStatus.value = 'list'
  currentNodeData.value = data
  nodeLevel.value = node.level
  const rect = e.target.getBoundingClientRect()
  operationInfo.value.clientX = rect.x - 20 + 'px'
  if (e.clientY + 96 <= document.body.clientHeight) {
    operationInfo.value.clientY = rect.y + 15 + 'px'
  } else {
    operationInfo.value.clientY = rect.y - 100 + 'px'
  }
  operationInfo.value.show = true
}
const handlerData = (res, backCurrent) => {
  treeLoading.value = false
  data.value = res
  if (res.length > 0) {
    nextTick().then(() => {
      if (backCurrent) {
        // 回到更改状态前的选中
        tree.value.setCurrentKey(currentNodeData.value !== '' ? currentNodeData.value.orgId : data.value[0].orgId)
        setTimeout(() => {
          const a:any = document.querySelector('.is-current')
          a.firstChild.click()
        }, 200)
      } else {
        // 默认选中第一个
        // setTimeout(() => {
        //   const firstNode = document.querySelector('.el-tree-node')
        //   if (firstNode) {      
        //     firstNode.click()
        //   }
        // }, 0)
        const firstNode:any = document.querySelector('.el-tree-node')
        if (firstNode) firstNode.click()
      }
      if (filterText.value) {
        tree.value.filter(filterText.value)
      }
    })
  }
}
const queryDepartmentTree = (backCurrent?) => {
  treeLoading.value = true
  authOrgListWithTree().then((res:any) => {
    if (res.length) {
      res.forEach((item, index, arr) => {
        if (item.orgName === '未分配分组' || item.createBy == 'unknow') {
          arr.splice(index, 1)
          arr.push(item)
        }
      })
    }
    store.set_organizationalTreeList(res)
    handlerData(res, backCurrent)
  })
}
const arrageParams = (status) => {
  roleInfo.value.id = currentRow.value.id
  roleInfo.value.status = status
}
const backToOriginTreeStatus = () => {
  tree.value.setCurrentKey(currentNodeData.value !== '' ? currentNodeData.value.orgId : data.value[0].orgId)
  nextTick(() => {
    const currentElement = document.querySelector('.is-current').firstChild as HTMLElement
    if (currentElement) {
      currentElement.click()
    }
  })
}
// 新增 新建
const buildTree = (curNodeData) => {
  if (curNodeData.orgName) {
    operationInfo.value.show = false
    orgInfo.value.parentName = curNodeData.orgName
    orgInfo.value.parentId = curNodeData.orgId
    orgInfo.value.orgName = ''
  } else {
    delete orgInfo.value.orgId
    delete orgInfo.value.status
  }
  popData.value.title = '新建'
  popData.value.show = true
}
// 重命名
const changDepartmentName = (curNodeData) => {
  operationInfo.value.show = false
  orgInfo.value.orgName = curNodeData.orgName
  orgInfo.value.orgId = curNodeData.orgId
  orgInfo.value.parentId = curNodeData.parentId
  orgInfo.value.parentName = curNodeData.parentName
  orgInfo.value.status = true
  popData.value.title = '重命名'
  popData.value.show = true
}
// 删除
const delDepartment = (curNodeData) => {
  operationInfo.value.show = false
  orgInfo.value.orgName = curNodeData.orgName
  orgInfo.value.orgId = curNodeData.orgId
  orgInfo.value.parentId = curNodeData.parentId
  orgInfo.value.status = false

  if (curNodeData.children && curNodeData.children.length) {
    popData.value.show = true
    popData.value.title = '提示'
    popData.value.key = '删除父子部门'
    popData.value.text = '你想删除的部门有子集部门，请先将部门下的子集部门转移或删除后，再进行此操作。'
  }
  queryUserByOrgId({ orgId: curNodeData.orgId }).then((res:any) => {
    if (res.content.length) {
      popData.value.show = true
      popData.value.title = '提示'
      popData.value.key = '删除有留存人员'
      popData.value.text = '你想删除的部门有留存人员，请先将部门下的人员转移或删除后，再进行此操作。'
      return
    } else {
      popData.value.show = true
      popData.value.title = '提示'
      popData.value.key = '删除该部门'
      popData.value.text = '此操作将删除该部门, 是否继续?'
    }
  })
}
const bodyClick = (e:any):void => {
  const cusFilterDiv = document.querySelector('.operation_box')
  if (cusFilterDiv && !cusFilterDiv.contains(e.target)) {
    operationInfo.value.show = false
  }
}
const resetpopData = () => {
  orgInfo = ref({
    orgId: 0,
    orgName: '',
    parentId: 0,
    status: true,
    parentName: ''
  })
}
const closeDailog = () => {
  popData.value.show = false
  popData.value.text = ''
  popData.value.key = ''
  setTimeout(() => {
    resetpopData()
  }, 0)
}

// 点击取消
const cancleSubmit = () => {
  closeDailog()
}
// 点击弹框确定
const confirm = () => {
  if (!orgInfo.value.orgName && !popData.value.key) {
    ElMessage.info('请输入部门名称')
    return
  }
  if (popData.value.title === '新建') {
    authOrgCreate(orgInfo.value).then(() => {
      // console.log(res);
      popData.value.show = false
      resetpopData()
      queryDepartmentTree()
    })
  } else if (popData.value.title === '重命名') {
    // console.log(orgInfo)
    authOrgUpdate(orgInfo.value).then(() => {
      popData.value.show = false
      resetpopData()
      queryDepartmentTree('backCurrent')
    })
  } else if (popData.value.title === '提示' && popData.value.key === '停用') {
    arrageParams('disable')
    roleUpdateByRoleId(roleInfo.value.id, roleInfo.value).then(() => {
      closeDailog()
      backToOriginTreeStatus()
      ElMessage.success('该角色禁用成功')
    })
  } else if (popData.value.title === '提示' && popData.value.key === '删除角色') {
    arrageParams('delete')
    roleUpdateByRoleId(roleInfo.value.id, roleInfo.value).then(() => {
      closeDailog()
      backToOriginTreeStatus()
      ElMessage.success('该角色信息删除成功')
    })
  } else if (popData.value.title === '提示' && popData.value.key === '删除父子部门') {
    closeDailog()
  } else if (popData.value.title === '提示' && popData.value.key === '删除有留存人员') {
    closeDailog()
  } else if (popData.value.title === '提示' && popData.value.key === '删除该部门') {
    authOrgUpdate(orgInfo.value).then(() => {
      closeDailog()
      resetpopData()
      queryDepartmentTree()
      ElMessage.success('删除成功!')
    })
  }
}
// 点击右上角新建
const addRole = () => {
  editData.value = {}
  componentStatus.value = 'build_new'
}
// 搜索
const searchEvent = () => {
  table.value.isLoading = true
  queryRoleByOrgId(table.value.params, { loading: true, loadingDom: '.right_template_table' }).then((res:any) => {
    table.value.isLoading = false
    table.value.tableData = res.content
    table.value.pageData.curPage = res.pageNum
    table.value.pageData.total = res.totalSize
  })
}
// 分页查询
const refreshData = (e) => {
  table.value.params.pageNum = e
  nodeClick(currentNodeData.value, '', '', 'pageNumChange')
}
// 改变某行状态
const switchChange = (row) => {
  console.log(row)
  if (!row.roleName) return
  row.status = row.status === 'disable' ? 'enable' : 'disable'
  currentRow.value = row
  if (row.status === 'enable') {
    // 停用时提示
    popData.value.show = true
    popData.value.title = '提示'
    popData.value.key = '停用'
    popData.value.text = '停用后，该角色的权限将不能使用，但数据仍保留,您确定要禁用该角色吗？'
  } else {
    // 启用时直接调接口启用
    arrageParams('enable')
    roleUpdateByRoleId(roleInfo.value.id, roleInfo.value).then(() => {
      closeDailog()
      backToOriginTreeStatus()
      ElMessage.success('该角色启用成功')
    })
  }
}
// 查看角色
const viewRole = (row) => {
  roleDetailData.value = row
  componentStatus.value = 'role_detail'
}
// 编辑角色
const editRole = (row) => {
  // console.log(row)
  editData.value = row
  componentStatus.value = 'build_new'
}
// 删除角色
const deleteRole = (row) => {
  currentRow.value = row
  popData.value.show = true
  popData.value.title = '提示'
  popData.value.key = '删除角色'
  popData.value.text = '删除后此角色信息将被清除，您确定要删除该角色信息吗？'
}

const closeDetail = () => {
  componentStatus.value = 'list'
}
onMounted(() => {
  document.addEventListener('click', (e:any) => {
    bodyClick(e)
    // const cusFilterDiv = document.querySelector('.operation_box')
    // if (cusFilterDiv && !cusFilterDiv.contains(e.target)) {
    //   operationInfo.value.show = false
    // }
  })
  queryDepartmentTree()
})
onUnmounted(() => {

})
</script>

<style lang="less" scoped>
.department_manage{
  height: 100%;
  width: 100%;
  // background: pink;
  display: flex;
  .left{
    position: relative;
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
      max-height: 560px;
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
        .operation {
          color: #0D162A;
          cursor: pointer;
          float: right;
          font-size: 18px;
        }
      }
    }
    .operation_box{
      position: fixed;
      border: 1px solid #D6DBE3;
      z-index: 888888888888888;
      ul {
        background-color: #F1F2F5;
        box-shadow: 0px -1px 16px 1px #F1F2F5;
        text-align: center;
        li {
          width: 85px;
          height: 32px;
          line-height: 32px;
          color: #0D162A;
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          // padding-left: 38px;
          box-sizing: border-box;
        }
        li:hover {
          // background-color: var(--datapicker-in-range-bg-color);
          color: #3366FF;
        }
      }
    }
    .new_build{
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 20px;
      .el-button {
        width: 100%;
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
      // justify-content: space-between;
      .search_box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        // .search_input{}
        .addRoleBtn{
          .el-button{
            background-color: #0052D9;
            width: 96px;
            height: 40px;
            font-size: 16px;
            border-radius: 0;
            border: 0;
            &:hover {
              background-color: #1890ff !important;
              border: 1px solid #1890ff;
            }
          }
        }
      }
      .table_box{
        width: 100%;
        overflow-x: hidden;
        overflow-y:auto;
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
  .bulid_department {
    box-sizing: border-box;
    padding: 0px 12px 0 4px; // 34
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
    .wirte_content {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .input_department_name {
        :deep(.el-input) {
          .el-input__inner {
            height: 32px !important;
            line-height: 32px !important;
            // border-radius: 0 !important;
          }
        }
      }
      .txt {
        display: inline-block;
        width: 90px;
        color: #0D162A;
        font-size: 14px;
      }
      @media only screen and (min-width: 900px) and (max-width: 1280px) {
        .txt {
          width: 100px;
        }
      }
      .input_department_name {
        flex: 1;
      }
      .departmentName {
        color: #0D162A;
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
  :deep(.el-tree-node__content){
    height: 32px !important;
  }
  :deep(.pagination_wrap){
    margin-top: 20px;
  }
}
// :deep(.table_pagination_wrap .table_wrap){
//   // height: 580px;
//   height: calc(100vh - 370px);
// }
</style>