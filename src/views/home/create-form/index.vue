<template>
  <div class="create_form">
    <!-- 步骤条 -->
    <div class="step_box">
      <Step v-model:active="activeStep" :stepData="stepData" @change="stepChange"></Step>
    </div>
    <div class="main_content">
      <!-- 表单设计器 -->
      <div class="design_form" v-if="activeStep === 1">
        <!-- <div class="mb20"> -->
        <MyFcDesigner ref="designer" />
        <!-- <FcDesigner ref="designer"/> -->
        <!-- </div> -->
      </div>

      <!-- 表单发布 -->
      <div class="release_form" v-if="activeStep === 2">
        <div class="release_form_box">
          <el-tabs :tab-position="tabPosition" class="demo-tabs">
            <el-tab-pane label="对成员发布">
              <div class="to_member">
                <div class="add_human" @click="addMember">
                  <i class="iconfont icon-icon_tianjia"></i>
                  <span class="text">
                    添加成员和权限
                  </span>
                </div>
                <div class="permission_box">
                  <div v-for="(item, index) in permissionArray" :key="index" class="permission_item">
                    <div class="common member">
                      <div class="member_name">
                        <span class="left_title">成员:</span>
                        <span v-for="(item2, index2) in item.memberList" :key="index2">
                          {{ item2.treeName }}{{ index2 === item.memberList.length - 1 ? '' : '、' }}
                        </span>
                      </div>
                      <div class="edit_member">
                        <i class="iconfont icon-icon_bianji" @click="editPermission(item)"></i>
                        <i class="iconfont icon-icon_qingkong" @click="deletePermission(item)"></i>
                      </div>
                    </div>
                    <div class="common">
                      <span class="left_title">权限:</span>
                      {{ item.authDesc }}</div>
                    <div class="common status">
                      <span class="left_title">状态:</span>
                      <el-switch v-model="item.status" active-text="打开" @change="switchChange(item)" inactive-text="关闭" />
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="公开发布">
              <PublicRelease />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="next_step">
        <div v-if="activeStep === 1">
          <el-button class="bule" type="primary" @click="nextStep">下一步</el-button>
        </div>
        <div v-if="activeStep === 2">
          <el-button class="blank" @click="preStep" plain>上一步</el-button>
          <el-button type="primary" class="bule" @click="finishedCreate">完成</el-button>
        </div>
      </div>
    </div>
    <Dialog :dialogConfig="dialogConfig" @closeEvent="closeEvent">
      <div class="dialog_content">
        <div class="top_row">
          <div class="left_text">成员:</div>
          <div class="mb-2 flex items-center text-sm radio_box">
            <el-radio-group v-model="chooseMemberType" class="ml-4">
              <el-radio label="role" size="large">岗位</el-radio>
              <el-radio label="org" size="large">部门</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="ele_select_box second_row">
          <el-tree-select v-model="chooseRole" placeholder="请选择" ref="roleTreeRef" v-if="chooseMemberType === 'role'"
                          class="el-tree-addordel"
                          :props="treeNameReset" :data="roleTreeData" multiple :render-after-expand="false"
                          @change="treeValueChange(chooseRole)"
                          node-key="treeId"
                          key="roleTree"
                          show-checkbox />
          <el-tree-select v-model="chooseDepartment" placeholder="请选择" ref="departmentTreeRef" v-else
                          check-on-click-node class="el-tree-addordel"
                          :props="treeNameReset2" :data="OrgTreeData" multiple check-strictly
                          :render-after-expand="false"
                          @change="treeValueChange(chooseDepartment)"
                          node-key="orgId"
                          key="OrgTree"
                          show-checkbox />
          <div class="error_tip" v-if="showError">请先选择成员</div>
        </div>
       
        <div class="third_row">
          <div class="left_text">权限:</div>
          <el-select v-model="choosePermission" placeholder="请选择">
            <el-option v-for="item in permissionList" :key="item.value" :label="item.label" :value="item.value"
                       :disabled="item.disabled" />
          </el-select>
        </div>
      </div>
      <div class="bottom_btns">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="confirmEvent">确定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import MyFcDesigner from '@/components/@form-create/designer/src/index.js'
// import FcDesigner from '@form-create/designer'

import { ref, onMounted, watch, nextTick } from 'vue'
import Step from '@/components/Step/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PublicRelease from './components/PublicRelease.vue'
import { useRoute, useRouter } from 'vue-router'
import { authOrgListWithTree, listTreeWithAllRole, searchMemberList, deleteMemberList, editMemberList, switchStatusMemberList, saveFormJson, getFormJson } from '@/api/home'
const currentRouter = useRoute()
const router = useRouter()
// 新建应用
interface Config {
  show: boolean,
  title: string,
  width: string,
  top: string,
  isShowBtn: boolean,
  status: string
}
const dialogConfig = reactive<Config>({
  show: false,
  title: '添加成员与权限',
  width: '417px',
  top: '',
  isShowBtn: true,
  status: 'add'
})
const tabPosition = ref('left')
const stepData = [
  {
    title: '表单设计'
  },
  {
    title: '表单发布'
  }
]
const activeStep = ref(1)
const chooseRole = ref([])
const chooseDepartment = ref([])
const chooseMemberType = ref('role')
const roleTreeRef = ref(null)
const departmentTreeRef = ref(null)
const choosePermission = ref('add_and_manage_personal_data')
const permissionArray: any = ref([])
const FcDesignerRule = ref([])
const FcDesignerOptions = ref('')
const designer = ref(null)
const showError = ref(false)

const roleTreeData:any = ref(null)
const OrgTreeData: any = ref(null)
let editId
// const choosePermission = ref('')
onMounted(() => {
  // 恢复表单设计器中的内容
  rebackFrom()
  listTreeWithAllRole().then((res) => {
    forMatData(res)
    roleTreeData.value = res
    searchData()
  })
  authOrgListWithTree().then(res => {
    OrgTreeData.value = res
  })

})
const rebackFrom = () => {
  getFormJson(currentRouter.query.formId).then((res: any) => {
    FcDesignerRule.value = JSON.parse(res.moduleJson) || []
    FcDesignerOptions.value = JSON.parse(res.formJson) || ''
    FcDesignerRule.value = FcDesignerRule.value.map((item) => {
      return JSON.parse(item)
    })
    designer.value.setRule(FcDesignerRule.value)
    designer.value.setOption(FcDesignerOptions.value)
  })
}
watch(activeStep, (newval) => {
  if (newval === 1) {
    if (FcDesignerRule.value && FcDesignerRule.value.length && FcDesignerOptions.value) {
      nextTick(() => {
        designer.value.setRule(FcDesignerRule.value)
        designer.value.setOption(FcDesignerOptions.value)
      })
    }
  }
})
const resetData = () => {
  chooseRole.value = []
  chooseDepartment.value = []
  choosePermission.value = 'add_and_manage_personal_data'
  chooseMemberType.value = 'role'
  showError.value = false
}
const closeEvent = () => {
  resetData()
}
const filterData = (ele, list) => {
  list.forEach((a) => {
    if (a.treeId == ele.memberType + '-' + ele.memberId) {
      ele.treeName = a.treeName
    }
    if (a.children && a.children.length) {
      filterData(ele, a.children)
    }
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

const deletePermission = (data) => {
  ElMessageBox.confirm(
    '请确认是否删除',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(() => {
    deleteMemberList(data.id, data.formId).then(() => {
      searchData()
    })
    ElMessage({
      type: 'success',
      message: '已成功删除'
    })

  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })

}
const switchChange = (data) => {
  switchStatusMemberList(data.id, data.formId, data.status).then(() => {
    searchData()
  })
}
const editPermission = (data) => {
  dialogConfig.status = 'edit'
  dialogConfig.show = true
  editId = data.id
  chooseMemberType.value = data.memberList[0].memberType
  if (chooseMemberType.value === 'role') {
    const treeData = []
    data.memberList.forEach((item) => {
      treeData.push(item.memberType + '-' + item.memberId)
    })
    chooseRole.value = treeData
  } else {
    const treeData = []
    data.memberList.forEach((item) => {
      treeData.push(item.memberId)
    })
    chooseDepartment.value = treeData
  }

  choosePermission.value = data.authLevel
}
const searchData = () => {
  searchMemberList({ formId: currentRouter.query.formId }).then((res: any) => {
    res.forEach((item) => {
      item.memberList && item.memberList.forEach((ele) => {
        ele.treeId = ele.memberType + '-' + ele.memberId
        filterData(ele, roleTreeData.value)
      })
    })
    permissionArray.value = res
  })
}

const permissionList = [
  {
    value: 'add_data_only',
    label: '仅添加数据'
  }, {
    value: 'add_and_manage_personal_data',
    label: '添加并管理本人数据'
  }, {
    value: 'add_and_read_all_data',
    label: '添加并查看全部数据'
  }, {
    value: 'manage_all_data',
    label: '管理全部数据'
  }, {
    value: 'read_all_data',
    label: '查看全部数据'
  }
]
const treeNameReset = {
  // value:'treeName',
  label: 'treeName',
  children: 'children'
}
const treeNameReset2 = {
  // value:'orgName',
  label: 'orgName',
  children: 'children'
}
const stepChange = (index) => {
  if (index === 2) {
    nextStep()
  }
}
const nextStep = () => {
  FcDesignerRule.value = designer.value.getRule()
  FcDesignerOptions.value = designer.value.getOption()
  if (FcDesignerRule.value.length < 1) {
    activeStep.value = 1
    ElMessage.warning('请先拖拽组件进行设计')
    return
  }
  saveFormJson({
    formId: currentRouter.query.formId,
    formJson: JSON.stringify(FcDesignerOptions.value),
    moduleJson: JSON.stringify(FcDesignerRule.value)
  }).then(() => {
    ElMessage.success('保存成功')
    activeStep.value = 2
  })

}
const preStep = () => {
  activeStep.value = 1
}
const finishedCreate = () => {
  // if (currentRouter.query.source === 'homedetail') {
  router.push({ path: '/home/detail', query: { data: currentRouter.query.appId, appName: currentRouter.query.appName } })
  // } else {
  //   router.push({ path: '/home', query: { data: currentRouter.query.appId, appName: currentRouter.query.appName } })
  // }

}

const addMember = () => {
  resetData()
  dialogConfig.status = 'add'
  dialogConfig.show = true
}
const cancelEvent = () => {
  dialogConfig.show = false
}
const confirmEvent = () => {
  // 这里需要先校验一下
  const editOrAdd = dialogConfig.status === 'edit' ? editMemberList : pushToMember
  // editMemberList
  if (chooseMemberType.value === 'role') {
    const checkList = roleTreeRef.value.getCheckedNodes()
    const checkRoleList = checkList.filter((item) => {
      item.memberId = item.id
      item.memberType = item.treeType
      // delete item.id
      return item.treeType === 'role'
    })
    if(checkRoleList.length === 0 ){ 
      showError.value = true
      return
    }
    editOrAdd({
      'authLevel': choosePermission.value,
      'formId': currentRouter.query.formId,
      'id': dialogConfig.status === 'edit' ? editId : '',
      'memberList': checkRoleList
    }).then(() => {
      ElMessage.success(dialogConfig.status === 'edit' ? '修改成功' : '新增成功')
      searchData()
    })
  } else {
    const checkList = departmentTreeRef.value.getCheckedNodes()
    checkList.forEach((item) => {
      item.memberId = item.orgId
      item.memberType = 'org'
    })
    if(checkList.length === 0 ){ 
      showError.value = true
      return
    }
    editOrAdd({
      'authLevel': choosePermission.value,
      'formId': currentRouter.query.formId,
      'memberList': checkList,
      'id': dialogConfig.status === 'edit' ? editId : ''
    }).then(() => {
      ElMessage.success(dialogConfig.status === 'edit' ? '修改成功' : '新增成功')
      searchData()
    })
  }

  dialogConfig.show = false
}

</script>

<style lang="less" scoped>
.create_form {
  padding: 0 24px 0 24px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .step_box {
    padding-top: 26px;
    padding-bottom: 21px;
    display: flex;
    justify-content: center;
  }

  .main_content {
    // height: 100%;
    // overflow: auto;
    height: calc(100vh - 200px);
    flex: 1;
    position: relative;

    .design_form {
      width: 100%;
      height: calc(100% - 84px);
      border: 1px solid #DADDE2;
      box-shadow: 8px 8px 20px 1px rgba(55, 99, 170, 0.11);
    }

    .release_form {
      height: 100%;
      padding: 30px 0px 0 25%;

      .release_form_box {
        height: 100%;

        .to_member {
          width: 800px;

          .add_human {
            width: 160px;
            height: 40px;
            line-height: 40px;
            margin-bottom: 20px;
            cursor: pointer;

            i {
              color: @active-color;
            }

            .text {
              color: #0051D9;
            }
          }

          .permission_box {
            .permission_item {
              flex: 1;
              height: 144px;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;

              .member {
                display: flex;
                justify-content: space-between;
              }

              .edit_member {
                display: flex;
                align-items: center;

                i {
                  cursor: pointer;
                }

                .icon-icon_bianji {
                  font-size: 24px;
                  margin-right: 8px;
                }
              }

              .common {
                height: 30px;
                display: flex;
                align-items: center;
              }

              .left_title {
                margin-right: 9px;
                color: @base-text-color-3;
              }
            }
          }

        }

        :deep(.demo-tabs) {
          height: 100%;

          .el-tabs__content {
            height: 100%;
            overflow-y: auto;
            font-size: 16px;
            padding-left: 24px;
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
            background: linear-gradient(90deg, rgba(0, 82, 217, 0) 0%, rgba(0, 82, 217, 0.08) 100%);
            font-weight: bold;
          }
        }
      }
    }

    .next_step {
      position: absolute;
      right: 10px;
      bottom: 24px;

      .el-button {
        border-radius: 0;
      }

      .el-button--primary {
        background-color: @active-color;
      }
    }

  }

  .dialog_content {
    padding-bottom: 106px;

    .top_row,
    .third_row {
      display: flex;
      align-items: center;

      .left_text {
        // margin-right: 8px;
        width: 41px;
      }

      .el-select {
        flex: 1;
      }
    }

    .second_row {
      padding-left: 41px;
      margin: 16px 0 16px 0;
      position: relative;
      .el-select {
        width: 100%;
      }
      .error_tip{
        position: absolute;
      color: red;
    }
    }
    
  }

  .bottom_btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style lang="less">
.el-select__popper {
  .el-select-dropdown__wrap {
    min-height: 180px;
  }

  .el-select-dropdown__item {
    overflow: visible;
  }

  .el-select-dropdown__item.hover {
    background-color: #fff;
  }

  .el-tree-node__content {
    .el-checkbox.is-disabled {
      display: none;
    }
  }

  .el-select-dropdown__item.is-disabled {
    cursor: auto;
    color: #606266;
  }
  .el-select-dropdown__item.is-disabled.selected{
    font-weight:normal;
    color: #606266;
  }
}
</style>
