<template tag="not_change_rem">
  <!-- 权限复制 -->
  <div class="bulid_department_new">
    <div class="main_content_build">
      <div class="transfer_out" v-if="popTyle === '转部门'">
        <div class="transfer_out_department not_change_rem">转出部门：</div>
        <div class="out_department_name">
          {{ departmentData.orgName }}
        </div>
      </div>
      <div class="titps" v-else>
        <el-form
          size="small"
          :model="submitObj"
          label-position="left"
          :rules="rules"
          ref="ruleForm"
          label-width="95px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户账号：" prop="username">
            <el-input v-model="submitObj.username"></el-input>
          </el-form-item>
          <el-form-item label-width="60px" label="姓名：" prop="realName">
            <el-input v-model="submitObj.realName"></el-input>
          </el-form-item>
          <el-form-item label="警员编号：" prop="jobNumber">
            <el-input v-model="submitObj.jobNumber"></el-input>
          </el-form-item>
          <el-form-item label-width="60px" label="手机：" prop="mobile">
            <el-input v-model="submitObj.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="transfer_main">
        <div class="left_transfer_title not_change_rem">
          {{ popTyle === '转部门' ? '转入部门：' : '角色名称：' }}
        </div>
        <div class="transfer_box">
          <div class="left_tree">
            <div class="left_tree_header">全部</div>
            <div class="tree_box">
              <el-input placeholder="输入关键字进行过滤" maxlength="30" v-model="searchText">
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
                show-checkbox
                highlight-current
                :check-on-click-node="true"
                node-key="treeId"
                default-expand-all
                :filter-node-method="filterNode"
                :props="defaultPopTreeProps"
                :expand-on-click-node="false"
                ref="popTree"
                empty-text="暂无数据"
              >
                <template v-slot="{ node }">
                  <span class="custom-tree-node">
                    <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="center_btn" :class="{ add: popTyle === '新建' || popTyle === '编辑' }">
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
                  v-for="(item, index) in (checkTreeList as any)"
                  :label="`${item.treeName}(${item.parentName})`"
                  style="display: block"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <div class="blank_button" @click="cancleSubmit">取消</div>
      <div class="submit_btn" @click="confirm(ruleForm)">确定</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { authUserCreate, authUserUpdate, userChangeOrgBatch } from '@/api/contact'
import EllipsisPop from '@/components/EllipsisPop/index.vue'

const props = defineProps({
  editData: {
    type: Object,
    default: () => {}
  },
  popTyle: {
    type: String,
    default: ''
  },
  departmentData: {
    type: Object,
    default: () => {}
  },
  popTreeData: {
    type: Array,
    default: () => []
  },
  checkedList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'cancleSubmit',
  'confirm'
])

const checkUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('用户账号不能为空'))
  }
  setTimeout(() => {
    const url = value.match(
      /^[0-9a-zA-Z]*$/g
    )
    if (url) {
      if (value.length > 38) {
        callback(new Error('长度限制38位以内'))
      } else {
        callback()
      }
    } else {
      callback(new Error('请输入字母或者数字'))
    }
  })
}
const checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
  if (!value) {
    return callback(new Error('手机号码不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
  }, 100)
}
const checkJobNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('警员编号不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (value.length === 6 || value.length === 7) {
        callback()
      } else {
        callback(new Error('请输入6-7位纯数字的警员编号'))
      }
    }
  }, 100)
}
const ruleForm = ref<FormInstance>()
const searchText = ref('')
const checkList = ref([])
const submitObj = ref({
  id: 0,
  jobNumber: '',
  mobile: '',
  positionName: '',
  realName: '',
  roleIds: [0],
  status: '',
  username: ''
})
const rules = ref({
  username: [
    { required: true, validator: checkUsername, trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 0, max: 20, message: '请输入长度在 12 到 20 个字符', trigger: 'blur' }
  ],
  jobNumber: [
    { required: true, validator: checkJobNumber, trigger: 'blur' }
  ],
  mobile: [
    { required: true, validator: checkPhone, trigger: 'blur' }
  ]
})
const checkTreeList = ref([])
const defaultPopTreeProps = ref({
  children: 'children',
  label: 'treeName'
})
const popTree = ref(null)
watch(searchText, newVal => {
  popTree.value.filter(newVal)
})
watch(props.editData, () => {
  init()
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.treeName.indexOf(value) !== -1
}
const toRight = () => {
  const tempList = popTree.value.getCheckedNodes(true, true)
  if (!tempList.length) {
    if (!props.editData.userId) {
      ElMessage.info('请先选择角色')
    }
  } else {
    checkTreeList.value = tempList
    checkList.value = tempList.reduce((arr, cur) => {
      arr.push(cur.treeName + '(' + cur.parentName + ')')
      return arr
    }, [])
  }
}
const toLeft = () => {
  if (!checkList.value.length) {
    ElMessage.info('请先选择需要移除的角色')
  } else {
    // console.log('选中的，', checkList.value)
    // console.log('全部的', checkTreeList.value)
    checkTreeList.value = checkTreeList.value.filter((item) => {
      return !checkList.value.includes(item.treeName + '(' + item.parentName + ')')
    })
    checkList.value = checkTreeList.value.reduce((arr, cur) => {
      arr.push(cur.treeName + '(' + cur.parentName + ')')
      return arr
    }, [])
    const checkIds = checkTreeList.value.reduce((ids, cur) => {
      ids.push(cur.treeId)
      return ids
    }, [])
    popTree.value.setCheckedKeys(checkIds)
  }
}
const cancleSubmit = () => {
  // init()
  // checkTreeList.value = []
  // checkList.value = []
  // popTree.value.setCheckedKeys([], false)
  emit('cancleSubmit')
}

const confirm = async(formEl:FormInstance | undefined) => {
  if (props.popTyle === '转部门') {
    if (checkTreeList.value.length === 0) {
      ElMessage.info('请选择至少一个部门角色进行转部门')
    } else {
      const tempSubmitObj = {}
      tempSubmitObj.newRoleId = checkTreeList.value.reduce((arr, cur) => {
        arr.push(cur.treeId.split('-')[1])
        return arr
      }, [])
      tempSubmitObj.userRoles = props.checkedList
      
      userChangeOrgBatch(tempSubmitObj).then(() => {
        ElMessage.success('转部门成功')
        emit('confirm', {}, '')
      })
    }
    return
  }
  await formEl.validate(async (valid) => {
    if (valid) {
      // 获取选择的角色
      if (checkTreeList.value.length) {
        submitObj.value.roleIds = checkTreeList.value.reduce((arr, cur) => {
          arr.push(cur.treeId.split('-')[1])
          return arr
        }, [])
      } else {
        submitObj.value.roleIds = []
      }
      // 编辑或者新增
      if (props.editData.userId) {
        authUserUpdate(submitObj.value).then((res) => {
          ElMessage.success('修改成功')
          emit('confirm', res, 'edit')
        })
      } else {
        authUserCreate(submitObj.value).then((res) => {
          res.passWord = res.mobile.substring(res.mobile.length - 8)
          emit('confirm', res, 'add')
        })
      }
    } else {
      ElMessage.info('请填写完整')
      return false
    }
  })
  // cancleSubmit()
}

const init = () => {
  if (props.editData.userId) {
    submitObj.value.username = props.editData.username
    submitObj.value.realName = props.editData.realName
    submitObj.value.jobNumber = props.editData.jobNumber
    submitObj.value.mobile = props.editData.mobile
    submitObj.value.status = props.editData.status
    submitObj.value.id = props.editData.userId
    setTimeout(() => {
      popTree.value.setCheckedKeys(props.editData.treeId, true)
      toRight()
    }, 1000)
  } else {
    submitObj.value.status = 'enable'
    submitObj.value = {
      id: 0,
      jobNumber: '',
      mobile: '',
      positionName: '',
      realName: '',
      roleIds: [0],
      status: '',
      username: ''
    }
    delete submitObj.value.id
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.bulid_department_new {
  // height: 200px;
  box-sizing: border-box;
  padding-right: 21px;
  // display: flex;
  // align-items: center;
  .main_content_build {
    // height: calc(100vh - 400px);
    box-sizing: border-box;
    // padding: 0 20px;
    .transfer_out {
      font-size: 16px;
      display: flex;
      padding-left: 4px;
      margin-bottom: 16px;
      .transfer_out_department.not_change_rem {
        color: #98A3B7;
        width: 72px;
        white-space: nowrap;
        margin-right: 7px;
      }
      .out_department_name {
        color: #0D162A;
      }
    }
    .titps {
      color: #98A3B7;
      //margin-bottom: 16px;
      :deep(.el-form) {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          display: flex;
          margin-bottom: 16px !important;
          .el-form-item__label {
            width: 95px;
            font-size: 16px;
            color: #98A3B7;
            flex: none;
            padding-right: 5px !important;
            box-sizing: content-box;
          }
          .el-form-item__content {
            flex: 1;
            margin-left: 0 !important;
            .el-input__inner {
              color: #0D162A;
              height: 32px !important;
              line-height: 32px !important;
              border-radius: 2px !important;
            }
          }
        }
        .el-form-item:nth-child(2n - 1) {
          width: 51%;
        }
        .el-form-item:nth-child(2n) {
          margin-left: 16px;
          width: calc(49% - 16px);
        }
      }
    }
    .transfer_main {
      height: 100%;
      display: flex;
      .left_transfer_title.not_change_rem {
        font-size: 16px;
        color: #98A3B7;
        width: 92px;
        padding-left: 4px;
        margin-right: 7px;
      }
      .transfer_box {
        height: calc(100vh - 400px);
        display: flex;
        color: #0D162A;
        overflow: hidden;
        width: 732px;
        .left_tree {
          flex: 1;
          height: 100%;
          overflow: hidden;
          border: 1px solid #D6DBE3;
          // background-color: #f5f7fa;
          // box-shadow: 0px -1px 12px 1px var(--box-shadow-color);
          .left_tree_header {
            color: #495770;
            height: 39px;
            line-height: 40px;
            border-bottom: 1px solid #D6DBE3;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tree_box {
            height: calc(100vh - 442px);
            overflow: auto;
            padding: 10px 0;
            box-sizing: border-box;
            .custom-tree-node {
              // font-size: 16px;
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
            // :deep(.el-tree-node__expand-icon) { // fuck 你大爷
            //   padding: 8px 8px 6px 12px;
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
          // width: 285px;
          .checkout_box {
            padding: 24px;
          }
          :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
            color: var(--base-text-color-1) !important;
          }
        }
      }
      @media only screen and (min-width: 900px) and (max-width: 1400px) {
        .transfer_box {
          height: calc(100vh - 600px);
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
</style>
