<template>
  <div class="buildNew">
    <div class="title" :style="{ opacity: showDom ? 1 : 0 }">
      <div class="tip">{{ editData.id ? '编辑' : '新建' }}</div>
    </div>
    <div class="main_content" :style="{ opacity: showDom ? 1 : 0 }">
      <div class="step_box">
        <div class="step">
          <Step v-model:active="active" :stepData="stepData" @change="stepChange"></Step>
          <!-- <el-steps :active="active">
            <el-step></el-step>
            <el-step></el-step>
          </el-steps> -->
        </div>
      </div>

      <div class="step_content_common step_content_1" v-if="active === 1">
        <div class="input_box">
          <div class="input_item">
            <div class="role_name">角色名称：</div>
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="submitObj.roleName"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="btn_list">
          <div class="right formBtn">
            <div class="blank_button" @click="cancleAdd">取消</div>
            <div class="submit_btn" @click="next">下一步</div>
            <!-- <el-button type="primary" class="submitButton" @click="next">下一步</el-button> -->
          </div>
        </div>
      </div>

      <div class="step_content_common step_content_2" v-if="active === 2">
        <div class="input_box">
          <div class="copy_limit">
            <div class="copy_limit_click" @click="copyPower">
              <i class="iconfont icon-icon_quanxianfuzhi"></i>
              <span>权限复制</span>
            </div>
          </div>
          <div class="feauter_module">
            <div class="feauter_header">
              <span>功能模块</span>
              <span>权限设置</span>
            </div>
            <div class="feauter_tree" v-if="active === 2">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="false"
                class="el-tree-addordel set_underline"
                node-key="id"
                ref="feauter_tree"
                default-expand-all
                key="1"
                empty-text="暂无数据"
              >
                <template v-slot="{ node, data }">
                  <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span class="operation">
                      <el-radio-group v-model="data.isPublic">
                        <el-radio
                          :disabled="data.disabled"
                          :label="true"
                          @click="radioClick(node, data, $event)"
                        >公开</el-radio
                        >
                        <el-radio :label="false" @click="radioClick(node, data, $event)"
                        >禁止</el-radio
                        >
                      </el-radio-group>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="btn_list">
          <div class="right formBtn">
            <div class="blank_button preStep" @click="preStep">上一步</div>
            <div class="submit_btn finish" @click="finished">完成</div>
            <!-- <div class="blank_button to_step" @click="preStep">上一步</div> -->
            <!-- <el-button type="primary" class="submitButton" @click="finished">完成</el-button> -->
          </div>
        </div>
      </div>
    </div>

    <Dialog
      :dialogConfig="popData"
      @closeEvent="closeDailog"
    >
      <div class="bulid_department_new">
        <div class="main_content_build">
          <div class="titps">请选择要复制的角色：</div>
          <div class="transfer_box">

            <div class="left_tree">
              <div class="left_tree_header">全部</div>
              <div class="tree_box">
                <el-input placeholder="输入关键字进行过滤" maxlength="30" v-model="searchText">
                  <!-- <i slot="suffix" class="iconfont icon-sousuo"></i> -->
                  <template #suffix>
                    <i 
                      class="iconfont icon-icon_sousuo"
                      style="font-size:14px;color:#495770"
                    />
                  </template>
                </el-input>
                <el-tree
                  class="filter-tree el-tree-addordel"
                  :data="popTreeData"
                  :check-on-click-node="true"
                  show-checkbox
                  node-key="treeId"
                  @node-click="handleNodeClick"
                  
                  default-expand-all
                  :filter-node-method="filterNode"
                  :props="defaultPopTreeProps"
                  ref="popTree"
                  key="2"
                >
                  <template v-slot="{ node }">
                    <span class="custom-tree-node">
                      <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
                    </span>
                  </template>
                </el-tree>
              </div>
            </div>

            <div class="center_btn">
              <div class="to_right" @click="toRight">
                <i class="iconfont icon-a-zu5481"></i>
              </div>
              <div class="to_right to_left" @click="toLeft">
                <i class="iconfont icon-icon_danjiantou"></i>
              </div>
            </div>

            <div class="left_tree right_transfer">
              <div class="left_tree_header right_transfer_header">已选</div>
              <div class="tree_box checkout_box">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    :label="item.treeName"
                    v-for="(item, index) in checkTreeList"
                    style="display: block"
                    :key="index"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="btn">
          <div class="blank_button" @click="cancleSubmit">取消</div>
          <div class="submit_btn" @click="confirm(ruleForm)">确定</div>
          <!-- <el-button type="primary" class="submitButton" @click="confirm">确定</el-button> -->
        </div>
      </div>
    </Dialog>

    <Dialog :dialogConfig="pop">
      <div class="bulid_department">
        <div class="tips" v-if="pop.text">
          <i class="iconfont icon-icon_tishi_xiangqing"></i>
          <div class="warning_txt">{{ pop.text }}</div>
        </div>
        <div class="btn">
          <div class="blank_button" @click="canclePop">取消</div>
          <div class="submit_btn" @click="confirmPop">确定</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { listWithTree, authRoleCreate, authRoleUpdate, listWithTreeByRoleId } from '@/api/contact'
import { listTreeWithRole } from '@/api/home'
import { ElMessage } from 'element-plus'
import Dialog from '@/components/Dialog/index.vue'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import Step from '@/components/Step/index.vue'

const props = defineProps({
  editData: {
    type: Object,
    default: () => {}
  },
  allRoleList: {
    type: Array,
    default: () => []
  },
  currentDepartmentData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits([
  'back',
  'refresh'
])

const feauter_tree = ref(null)
const showDom = ref(false)
const submitObj = ref({
  'describe': '',
  'id': 0,
  'moduleIds': [
    0
  ],
  'orgId': 0,
  'roleName': '',
  'status': ''
})
const treeData = ref([])
const active = ref(1)
const defaultProps = {
  children: 'children',
  label: 'moduleName'
}
const stepData = [
  {
    title: ''
  },
  {
    title: ''
  }
]

const pop = ref({
  show: false,
  title: '提示',
  width: '494px',
  text: '权限复制后将覆盖正在编辑的信息，您确定要进行权限复制吗？',
  key: ''
})
const popData = ref({ show: false, title: '权限复制', width: '784px', text: '', key: '' })
const searchText = ref('')
const popTreeData = ref([])
const defaultPopTreeProps = ref({
  children: 'children',
  label: 'treeName'
})
const checkList = ref([])
const checkTreeList = ref([])
const popTree = ref(null)
const editCheckId = ref('')
const tempTreeData = ref([])

watch(searchText, newVal => {
  popTree.value.filter(newVal)
})

const cancleAdd = () => {
  emit('back')
}
const stepChange = () => {
  active.value = 1 // 不让点击
}
// 下一步
const next = () => {
  if (!submitObj.value.roleName) {
    ElMessage.info('请先填写角色名称')
    return
  }
  let canNext
  if (props.editData.id) {
    let tempAllRoleList = JSON.parse(JSON.stringify(props.allRoleList))
    tempAllRoleList = tempAllRoleList.filter((item) => {
      return item.id !== props.editData.id
    })
    canNext = tempAllRoleList.every((item) => {
      return item.roleName !== submitObj.value.roleName
    })
  } else {
    canNext = props.allRoleList.every((item) => {
      return item.roleName !== submitObj.value.roleName
    })
  }
  if (canNext) {
    active.value++
  } else {
    ElMessage.info('角色名称不能重复')
  }
}

const check = (data, status, pStatus) => {
  data.isPublic = pStatus
  if (status) {
    data.disabled =!pStatus
  }
  if (data.children && data.children.length) {
    data.children.forEach((item) => {
      check(item, true, pStatus)
    })
  }
}

const radioClick = (node, data, el) => {
  if (el.target.tagName === 'SPAN') return
  if (el.target._value) {
    data.isPublic = true
  } else {
    data.isPublic = false
  }
  const curStatus = feauter_tree.value.getNode(data)
  if (curStatus.parent.data.isPublic === false || data.disabled) return
  const pStatus = data.isPublic
  data.disabled = false
  check(data, false, pStatus)
}

const getAllEnableMenuIdArr = (arr) => {
  let enableArr = []
  arr.forEach((item) => {
    if (item.isPublic) {
      enableArr.push(item.id)
      if (item.children.length) {
        enableArr = enableArr.concat(getAllEnableMenuIdArr(item.children))
      }
    }
  })
  return enableArr
}

const preStep = () => {
  active.value--
}

const finished = () => {
  // setDefaultSubmitInfo()
  submitObj.value.moduleIds = getAllEnableMenuIdArr(treeData.value)
  
  if (!props.editData.id) {
    // 新增
    authRoleCreate(submitObj.value).then(() => {
      ElMessage.success('新增成功')
      cancleAdd()
      emit('refresh')
    })
  } else {
    // 编辑接口
    authRoleUpdate(submitObj.value).then(() => {
      ElMessage.success('修改成功')
      cancleAdd()
      emit('refresh')
    })
  }
}

const formatResData = (data, parentStatus) => {
  data.forEach((item) => {
    if (parentStatus) {
      item.disabled = false
    } else {
      item.disabled = true
    }
    if (item.children.length) {
      formatResData(item.children, item.isPublic)
    }
  })
}

const searchRoleMenu =  () => {
  listWithTreeByRoleId({ roleId: props.editData.id }, { loading: true, loadingDom: '.right_template_table' }).then((res) => {
    showDom.value = true
    formatResData(res, true)
    treeData.value = res
  })
}

const setDefaultSubmitInfo = () => {
  submitObj.value.orgId = props.currentDepartmentData.orgId
  submitObj.value.status = props.currentDepartmentData.status
  delete submitObj.value.id
}
// 权限复制
const copyPower = () => {
  listTreeWithRole().then((res) => {
    forMatData(res)
    popTreeData.value = res as any
  })
  popData.value.show = true
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

const closeDailog = () => {
  searchText.value = ''
  popData.value.show = false
  resetPopData()
}

const handleNodeClick = (item) => {
  editCheckId.value = item.treeId
  popTree.value.setCheckedKeys([item.treeId])
}
// const checkChange = (item, node) => { // @check-change="checkChange"
//   if (node == true) {
//     editCheckId.value = item.treeId
//     popTree.value.setCheckedKeys([item.treeId])
//   } else {
//     if (editCheckId.value == item.treeId) {
//       popTree.value.setCheckedKeys([item.treeId])
//     }
//   }
// }
const filterNode = (value, data) => {
  if (!value) return true
  return data.treeName.indexOf(value) !== -1
}
const toRight = () => {
  const tempList = popTree.value.getCheckedNodes(true, true)
  if (!tempList.length) {
    ElMessage.info('请先选择角色')
  } else if (tempList.length !== 1) {
    ElMessage.info('只能选择一个角色')
  } else {
    checkTreeList.value = tempList
    checkList.value.push(tempList[0].treeName)
  }
}
const toLeft = () => {
  if (!checkList.value.length) {
    ElMessage.info('请先选择需要移除的角色')
  } else {
    checkList.value = []
    checkTreeList.value = []
    // popTree.value.setCheckedKeys([])
  }
}
const resetPopData = () => {
  searchText.value = ''
  checkTreeList.value = []
  checkList.value = []
  popData.value.show = false
  popTree.value.setCheckedKeys([])
}
const cancleSubmit = () => {
  popData.value.show = false
  resetPopData()
}
const confirm = () => {
  if (!checkList.value.length) {
    ElMessage.info('请先选择一个角色进行复制')
  } else {
    const roleId = checkTreeList.value[0].treeId.split('-')[1]
    listWithTreeByRoleId({ roleId }).then((res) => {
      tempTreeData.value = res
      pop.value.show = true
    }).catch(() => {
      resetPopData()
    })
  }
  // 这也是取消选中的方法
  // console.log(popTree.value.getNode(popTreeData.value[0].treeId))
  // const rootNode = popTree.value.getNode(popTreeData.value[0].treeId)
  // const travelNodes = (node) => {
  //   node.checked = false
  //   if (node.childNodes.length === 0) {
  //     return
  //   } else {
  //     const tmpChildNoes = node.childNodes
  //     for (let i = 0; i < tmpChildNoes.length; i++) {
  //       travelNodes(tmpChildNoes[i])
  //     }
  //   }
  // }
  // travelNodes(rootNode)

  // popTree.value.setCheckedKeys([])
}
const canclePop = () => {
  pop.value.show = false
  resetPopData()
}
const confirmPop = () => {
  treeData.value = tempTreeData.value
  ElMessage.success('权限复制成功,请点击完成来创建角色')
  pop.value.show = false
  resetPopData()
}

onMounted(() => {
  setDefaultSubmitInfo()
  if (props.editData.id) {
    submitObj.value.roleName = props.editData.roleName
    submitObj.value.id = props.editData.id
    submitObj.value.status = props.editData.status
    // 编辑时查询菜单表
    searchRoleMenu()
  } else {
    // submitObj.value.status = 'enable'
    // submitObj.value = {
    //   'describe': '',
    //   'id': 0,
    //   'moduleIds': [
    //     0
    //   ],
    //   'orgId': 0,
    //   'roleName': '',
    //   'status': ''
    // }
    // setDefaultSubmitInfo()
    listWithTree({ loading: true, loadingDom: '.right_template_table' }).then((res:any) => {
      showDom.value = true
      treeData.value = res
    })
  }
})
</script>

<style lang="less" scoped>
.buildNew{
  .title {
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 32px;
    color: #0D162A;
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .tip {
      font-weight: bold;
    }
  }
  .main_content{
    margin-top: 20px;
    .step_box {
      width: 100%;
      height: 64px;
      // background-color: red;
      border-top: 1px solid #DDDDDD;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2px;
      .step {
        width: 140px;
      }
      :deep(.el-step) {
        .el-step__head.is-finish {
          color: #0052D9;
          border-color: #0052D9;
        }
        .el-step__head.is-process {
          color: #C0C4CC;
          border-color: #C0C4CC;
        }
        .el-step__icon.is-text {
          border-width: 1px;
        }
        .el-step__line {
          background-color: #DDDDDD;
          left: 30px;
          right: 6px;
        }
        .el-step__icon {
          background: transparent !important;
        }
      }
    }
    .step_content_common{
      width: 100%;
      padding: 24px;
      box-sizing: border-box;
      // background-color: pink;
      height: calc(100vh - 360px);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .input_box {
        flex: 1;
      }
      .btn_list {
        .right {
          display: flex;
          justify-content: flex-end;
          padding: 8px 0 24px 0;
          box-sizing: border-box;
          &.formBtn {
            padding: 24px 0 0 24px;
            box-sizing: border-box;
          }
          .blank_button {
            padding: 12px 31px;
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
          .submit_btn {
            margin-left: 20px;
            padding: 12px 24px;
            line-height: 14px;
            font-size: 16px;
            color: #fff;
            background-color: #0052D9 !important;
            cursor: pointer;

            &:hover {
              background-color: #1890ff !important;
            }
          }
          .preStep{
            padding: 12px 23px;
          }
          .finish{
            padding: 12px 32px;
          }
          // .to_step {
          //   padding: 7px 12px;
          // }
          // :deep(.el-button) {
          //   width: 68px;
          //   padding: 0 !important;
          // }
        }
      }
    }
    .step_content_1 {
      .input_box {
        .input_item {
          width: 400px;
          display: flex;
          align-items: center;
          margin: 40px auto 0;
          .role_name {
            width: 100px;
            color: #0D162A;
            font-size: 16px;
          }
          @media only screen and (min-width: 900px) and (max-width: 1450px) {
            .role_name {
              width: 126px;
            }
          }
          :deep(.el-input) {
            width: 400px;
            height: 40px;
            .el-input__inner {
              padding: 0 12px;
              border-radius: 2px;
              border-color: #515C7C;
              &::placeholder {
                color: #98A3B7;
                font-size: 14px;
              }
            }
            .el-input__count-inner {
              color: #98A3B7;
              font-size: 14px;
            }
          }
        }
      }
    }
    .step_content_2{
      .input_box{
        .copy_limit{
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: #0052D9;
          line-height: 16px;
          margin-bottom: 16px;
          .copy_limit_click {
            display: flex;
            cursor: pointer;
            align-items: center;
            i {
              font-size: 22px;
              color: #0052D9;
            }
            span {
              font-size: 16px;
              margin-left: 8px;
              color: #0D162A;
            }
          }
        }
        .feauter_module {
          .feauter_header {
            height: 48px;
            line-height: 20px;
            width: 100%;
            background-color: #F1F2F5;
            display: flex;
            color: #495770;
            padding: 14px 0;
            box-sizing: border-box;
            span {
              display: inline-block;
              padding-left: 32px;
              box-sizing: border-box;
            }
            span:nth-child(1) {
              flex: 1;
              border-right: 1px solid #495770;
            }
            span:nth-child(2) {
              width: 481px;
            }
          }
          .feauter_tree {
            :deep(.el-tree-node__expand-icon) {
              // padding-left: 32px;
              margin-left:32px;
              padding-top: 8px;
            }
            :deep(.set_underline > div.el-tree-node) {
              border-bottom: 1px solid #f1f2f5;
              padding-top: 6px;
              padding-bottom: 8px;
            }
            height: calc(100vh - 500px);
            overflow: auto;
            .custom-tree-node {
              font-size: 16px;
              color: #0D162A;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding-right: 10px;
              position: relative;
            }
            .operation {
              float: right;
              margin-right: 270px;
              .el-radio__input.is-disabled + span.el-radio__label {
                color: #0D162A;
              }
              :deep(.el-radio) {
                margin-right: 24px;
                font-size: 16px;
                .el-radio__label {
                  font-size: 16px;
                  padding-left: 8px;
                  color: #0D162A !important;
                }
                .el-radio__inner {
                  width: 16px;
                  height: 16px;
                  border-color: #D6DBE3 !important;
                  &::after {
                    width: 8px;
                    height: 8px;
                    background: #0052D9 !important;
                  }
                }
                .el-radio__input.is-checked .el-radio__inner {
                  background: transparent;
                  border-color: #0052D9 !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .bulid_department_new{
    box-sizing: border-box;
    padding: 0 12px 0 20px;
    .main_content_build{
      height: calc(100vh - 400px);
      box-sizing: border-box;
      .titps {
        color: #0D162A;
        margin-bottom: 16px;
      }
      .transfer_box{
        height: calc(100% - 32px);
        display: flex;
        color: #0D162A;
        box-sizing: border-box;
        padding-right: 10px;
        .left_tree {
          flex: 1;
          height: 100%;
          overflow: hidden;
          border: 1px solid #D6DBE3;
          .left_tree_header {
            color: #495770;
            height: 39px;
            line-height: 40px;
            padding-left: 24px;
            border-bottom: 1px solid #D6DBE3;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tree_box {
            height: calc(100% - 40px);
            overflow: auto;
            padding: 24px 0;
            box-sizing: border-box;
            .icon-sousuo {
              position: relative;
              top: 4px;
              font-size: 16px;
              color: var(--base-text-color-to-999999);
              cursor: pointer;
            }
            .custom-tree-node {
              display: flex;
              flex: 1;
              width: 100%;
              align-items: center;
              justify-content: space-between;
              padding-right: 24px;
              position: relative;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              .em-tree-text {
                display: inline-block; //block一样
                overflow: hidden;
                white-space: nowrap;
                width: 100%;
                text-overflow: ellipsis;
              }
            }
            :deep(.el-tree-node__content){
              font-size: 16px;
              height: 32px !important;
            }
            :deep(.el-input) {
              margin: 0 16px 16px;
              width: calc(100% - 38px);
              .el-input__wrapper{
                box-shadow: 0 0 0 0 !important;
                border-radius: 0px;
                border-bottom: 1px solid #D6DBE3 !important;
              }
              .el-input__inner {
                border: 0 !important;
                // border-bottom: 1px solid var(--base-text-color-to-999999) !important;
                border-radius: 0;
                line-height: 27px !important;
                height: 27px !important;
                padding-left: 0;
                padding-right: 30px;
                &::placeholder {
                  color: #98A3B7;
                  font-size: 14px;
                }
              }
              .el-input__suffix {
                right: 0;
                top: -4px !important;
              }
            }
            // :deep(.el-tree-node__expand-icon) {
            //   padding: 8px 8px 6px 24px;
            //   color: #4e5769;
            // }
          }
        }
        .center_btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
          &.add {
            margin: 0 24px;
          }
          .to_right {
            font-size: 14px;
            height: 24px;
            width: 24px;
            text-align: center;
            border: 1px solid #495770;
            border-radius: 2px;
            cursor: pointer;
            box-sizing: border-box;
            i {
              line-height: 23px;
              font-weight: 600;
              color: #495770;
            }
          }
          .to_left {
            margin-top: 26px;
          }
        }
        .right_transfer {
          .checkout_box {
            padding: 24px;
          }
          :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
            color: var(--base-text-color-1) !important;
          }
        }
      }
    }
    .btn {
      display: flex;
      justify-content: flex-end;
      //padding: 8px 0 24px 0;
      box-sizing: border-box;
      margin-top: 24px;
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
}
</style>