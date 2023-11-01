<template>
  <div class="home_detail">
    <div class="main_content_box">
      <div class="header">
        <div class="app_name">
          {{ currentRouter.query.appName }}
        </div>
        <div class="back" @click="backPre">
          返回
        </div>
      </div>

      <div class="main">
        <div class="left">
          <div class="left_content">
            <div class="left_top">
              <el-input id="el_input" class="input_filter" placeholder="请输入" maxlength="30"
                        v-model="filterText">
                <template #suffix>
                  <i class="iconfont icon-icon_sousuo" style="font-size:14px;color:#495770" />
                </template>
              </el-input>
              <div class="add" @click.stop="clickAdd">
                <i class="iconfont icon-icon_cebiantianjia" />
              </div>
            </div>
            <div class="add_box" v-if="addBox.show">
              <ul>
                <li @click.stop="addFormEvent(0)">新增表单</li>
                <li @click.stop="addGroup(1)">新增分组</li>
              </ul>
            </div>
            <div class="operation_box" v-if="operationInfo.show"
                 :style="{ left: operationInfo.clientX, top: operationInfo.clientY }">
              <ul>
                <li v-if="operationInfo.type === 'group'" @click.stop="addFormEvent(currentNodeData.id)">新增表单</li>
                <li v-if="operationInfo.type === 'group' && currentNodeData.groupId === 0" @click.stop="addGroup(2)">新增子分组
                </li>
                <li @click="rename(currentNodeData)">重命名</li>
                <li v-if="operationInfo.type === 'form'" @click="editForm(currentNodeData)">编辑</li>
                <li @click="clickDelete(operationInfo.type)">删除</li>
              </ul>
            </div>
            <div class="left_bottom">
              <el-tree
                class="filter-tree" 
                v-loading="treeLoading" 
                element-loading-text="数据正在加载中"
                :data="data"
                :props="defaultProps"
                @node-click="nodeClick" 
                :default-expand-all="false" 
                node-key="id"
                :filter-node-method="filterNode" 
                ref="tree" 
                empty-text="暂无数据" 
                :expand-on-click-node="true"
                highlight-current 
                draggable 
                :allow-drop="allowDrop" 
                @node-drop="handleDrop"
                :default-expanded-keys="[defaultExpandedItemId]"
                :current-node-key="defaultSelectedItemId"
              >
                <template v-slot="{ node, data }">
                  <span class="custom-tree-node">
                    <span v-if="data.type === 'form'">
                      <i class="iconfont icon-icon_weigui" style="margin-right: 8px;" />
                    </span>
                    <span v-if="data.type === 'group'">
                      <i v-if="!node.expanded" class="iconfont icon-icon_fenzu1" style="margin-right: 8px;" />
                      <i v-else class="iconfont icon-icon_fenzu" style="margin-right: 8px;" />
                    </span>
                    <EllipsisPop :class="['em-tree-text', {'active_text': data.id === currentNodeData.id } ]" :content="node.label"></EllipsisPop>
                    <span class="operation" @click.stop="operationClick(node, data, $event)">···
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="right" v-if="copyCurrentNodeData.id">
          <RightList :formId="copyCurrentNodeData.id" :isSingleShare="copyCurrentNodeData.singleReadAuth"/>
        </div>
      </div>
    </div>
    <Dialog :dialogConfig="popData">
      <div class="bulid_department">
        <div class="tips" v-if="popData.text">
          <i class="iconfont icon-icon_tishi_xiangqing"></i>
          <div class="warning_txt">{{ popData.text }}</div>
        </div>
        <div v-if="popData.title === '新建分组' || popData.title === '新建子分组' || popData.title === '重命名'">
          <div class="wirte_content">
            <span class="txt">名称：</span>
            <div class="input_department_name">
              <el-input placeholder="请输入" maxlength="30" v-model.trim="newGroup.gName"></el-input>
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

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import { ElMessage } from 'element-plus'
import { getAppFormInfoList, addGroupList, infoListSort, deleteGroupList, deleteInfoList, updateGroupList, updateInfoList,addForm } from '@/api/home'
import Dialog from '@/components/Dialog/index.vue'
import RightList from './components/RightList.vue'

const router = useRouter()
const currentRouter = useRoute()
const backPre = () => {
  router.push({ path: '/home' })
}

const tree = ref(null)
const filterText = ref('')
const treeLoading = ref(false)
const defaultProps = {
  children: 'children',
  label: 'name'
}
const data = ref([])
const addBox = ref({
  show: false,
  clientX: '',
  clientY: ''
})
const operationInfo = ref({
  show: false,
  type: '',
  clientX: '',
  clientY: ''
})
const popData = ref({
  show: false,
  title: '新建分组',
  width: '494px',
  text: '',
  key: ''
})
const newGroup = ref({
  gName: ''
})
const currentNodeData = ref({})
const copyCurrentNodeData = ref({})
const firstRender = ref(true)

const defaultExpandedItemId = ref(null)
const defaultSelectedItemId = ref(null)

watch(filterText, newVal => {
  tree.value.filter(newVal)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.name.indexOf(value) !== -1
}

// 点击表单
const nodeClick = (info) => {
  // console.log(info)
  operationInfo.value.show = false
  currentNodeData.value = info
  if(info.type!=='group'){
    // 点击分组的时候，不改变右边的内容
    copyCurrentNodeData.value = info
  }
}

const editForm = (value) => {
  const { data, appName } = currentRouter.query
  router.push({ path: '/home/createform', query: { appId: data, appName: appName, formId: value.id, formName: value.name, source: 'homedetail' } })
}

// 点击 ...
const operationClick = (node, data, e) => {
  // console.log(node, data)
  currentNodeData.value = data
  const rect = e.target.getBoundingClientRect()
  operationInfo.value.clientX = rect.x - 20 + 'px'
  if (e.clientY + 96 <= document.body.clientHeight) {
    operationInfo.value.clientY = rect.y + 15 + 'px'
  } else {
    operationInfo.value.clientY = rect.y - 100 + 'px'
  }
  addBox.value.show = false
  operationInfo.value.show = true
  operationInfo.value.type = data.type
}

// 计算树的层级
// const calculateDepth = (node) => {
//   let depth = 1
//   let parent = node.parent
//   while (parent) {
//     depth++
//     parent = parent.parent
//   }
//   return depth
// }
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // console.log(draggingNode, dropNode, type)
  // console.log(draggingNode, '----', dropNode)
  
  if (draggingNode.data.children && draggingNode.data.children.length) {
    // console.log(draggingNode.data.children.some(item => item.type === 'group'))
    if (draggingNode.data.children.some(item => item.type === 'group')) return
  }

  if (dropNode.data.type === 'form' && type === 'inner') return
  if (draggingNode.data.type === 'group' && dropNode.data.type === 'group' && dropNode.data.groupId > 0) return
  if (draggingNode.data.type === 'group' && dropNode.data.type === 'group' && draggingNode.level === 2 && dropNode.level === 2) return
  return true
}
const clickAdd = () => {
  operationInfo.value.show = false
  addBox.value.show = true
}
const bodyClick = (e: any): void => {
  const add_boxDiv = document.querySelector('.add_box')
  if (add_boxDiv && !add_boxDiv.contains(e.target)) {
    addBox.value.show = false
  }
  const cusFilterDiv = document.querySelector('.operation_box')
  if (cusFilterDiv && !cusFilterDiv.contains(e.target)) {
    operationInfo.value.show = false
  }
}
// 拖拽分组成功后的事件
const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType) => {
  // console.log(draggingNode, dropNode, dropType, ev)
  let groupId
  if (dropType === 'inner') groupId = dropNode.data.id
  else groupId = dropNode.data.groupId

  const findPreviousId = (idToFind, arr) => {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.newId === idToFind) {
        if (i > 0) {
          return arr[i - 1]
        } else {
          return null
        }
      }
      if (item.children) {
        const result = findPreviousId(idToFind, item.children)
        if (result !== null) {
          return result
        }
      }
    }
    return null
  }
  const findObj = findPreviousId(draggingNode.data.newId, data.value)
  // console.log(findObj)

  const mData = {
    before: {},
    current: {
      id: draggingNode.data.id,
      type: draggingNode.data.type
    },
    groupId: groupId
  }
  if (findObj) {
    mData.before.id = findObj.id
    mData.before.type = findObj.type
  } else {
    delete mData.before
  }

  infoListSort(mData).then((res: any) => {
    console.log(res)
  }).finally(() => {
    queryTree()
  })
}

const addFormEvent = (groupId) => {
  const { data, appName } = currentRouter.query
  addForm({ name: '未命名表单', appId: data, type: 'form', groupId }).then((res2: any) => {
    if (res2.code === 1) {
      router.push({ path: '/home/createform', query: { appId: data, appName: appName, formId: res2.data.id, formName: '未命名表单',source:'homedetail' } })
    }
  })
}

// 新建分组
const addGroup = (type) => {
  popData.value.title = type === 1 ? '新建分组' : '新建子分组'
  popData.value.show = true
  addBox.value.show = false
  newGroup.value.gName = ''
}
// 删除表单或分组
const clickDelete = (type) => {
  // console.log(type)
  if (type === 'group' && currentNodeData.value.children && currentNodeData.value.children.length) {
    ElMessage.error('非空分组不能删除！')
    return
  }
  popData.value.title = (type === 'group') ? '删除分组' : '删除表单'
  popData.value.text = (type === 'group') ? '确定删除该分组吗？' : '确定删除该表单吗？'
  popData.value.show = true
}
// 重命名
const rename = (info) => {
  // console.log(info)
  newGroup.value.gName = info.name
  popData.value.title = '重命名'
  popData.value.show = true
}

const cancleSubmit = () => {
  popData.value.show = false
  newGroup.value.gName = ''
}
const confirm = () => {
  if (popData.value.title === '新建分组' || popData.value.title === '新建子分组') {
    if (newGroup.value.gName === '') {
      ElMessage.warning('分组名称不能为空')
      return
    }
    const mData = {
      appId: Number(currentRouter.query.data),
      groupId: popData.value.title === '新建分组' ? 0 : currentNodeData.value.id,
      name: newGroup.value.gName
    }
    addGroupList(mData).then(() => {
      ElMessage.success('新增分组成功')
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      cancleSubmit()
      queryTree()
    })
  } else if (popData.value.title === '删除表单') {
    const formdata = new FormData()
    formdata.append('appId', Number(currentRouter.query.data))
    formdata.append('formId', currentNodeData.value.id)
    deleteInfoList(formdata).then(() => {
      ElMessage.success('删除表单成功')
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      popData.value.text = ''
      popData.value.show = false
      queryTree()
      // clickFirstForm()
      currentNodeData.value = {}
      copyCurrentNodeData.value = {}
    })
  } else if (popData.value.title === '删除分组') {
    const formdata = new FormData()
    formdata.append('appId', Number(currentRouter.query.data))
    formdata.append('groupId', currentNodeData.value.id)
    deleteGroupList(formdata).then(() => {
      // console.log(res)
      ElMessage.success('删除分组成功')
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      popData.value.text = ''
      popData.value.show = false
      queryTree()
    })
  } else if (popData.value.title === '重命名') {
    if (newGroup.value.gName === '') {
      ElMessage.warning('名称不能为空')
      return
    }
    const mData = {}
    let requestUrl = ''
    if (currentNodeData.value.type === 'form') {
      mData.appId = Number(currentRouter.query.data)
      mData.groupId = currentNodeData.value.groupId
      mData.id = currentNodeData.value.id
      mData.name = newGroup.value.gName
      mData.type = currentNodeData.value.type
      mData.icon = ''
      requestUrl = updateInfoList
    } else {
      mData.appId = Number(currentRouter.query.data)
      mData.groupId = currentNodeData.value.groupId
      mData.id = currentNodeData.value.id
      mData.name = newGroup.value.gName
      requestUrl = updateGroupList
    }

    requestUrl(mData).then((res: any) => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      popData.value.show = false
      queryTree()
    })
  }
}
// 查找树
const queryTree = (backCurrent?) => {
  if (firstRender.value) {
    treeLoading.value = true
  }
  getAppFormInfoList({ appId: Number(currentRouter.query.data) }).then((res: any) => {
    // console.log('res', res)
    firstRender.value = false
    treeLoading.value = false

    // if (res.length) {
    let currentId = 1
    const assignNewId = (obj) => {
      obj.newId = currentId++
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach(childObj => assignNewId(childObj))
      }
    }
    res.forEach((item) => {
      assignNewId(item)
    })

    handlerData(res, backCurrent)
    // }
  })
}
const handlerData = (res, backCurrent) => {
  treeLoading.value = false
  data.value = res
  if (res.length > 0) {
    nextTick().then(() => {
      if (backCurrent) {
        // 回到更改状态前的选中
        tree.value.setCurrentKey(currentNodeData.value !== '' ? currentNodeData.value.id : data.value[0].id)
        setTimeout(() => {
          const a: any = document.querySelector('.is-current')
          a.firstChild.click()
        }, 200)
      } else {
        const findFirstFormElement = (arr) => {
          for (const item of arr) {
            if (item.type === 'form') {
              return item
            } else if (item.children && item.children.length > 0) {
              const result = findFirstFormElement(item.children)
              if (result) {
                return result
              }
            }
          }
          return null // 如果未找到任何匹配项，则返回null
        }
        const firstForm = findFirstFormElement(res)
        if (firstForm) {
          currentNodeData.value = firstForm
          copyCurrentNodeData.value = firstForm
          defaultExpandedItemId.value = firstForm.id
          defaultSelectedItemId.value = firstForm.id
        } else {
          clickFirstForm()
        }
      }
      if (filterText.value) {
        tree.value.filter(filterText.value)
      }
    })
  }
}
// 默认点击一个表单
const clickFirstForm = () => {
  const firstNode: any = document.querySelector('.el-tree-node')
  if (firstNode) {
    firstNode.click()
  }
}
const clickHandler = (e: any) => {
  bodyClick(e)
}
onMounted(async () => {
  await queryTree()

  document.addEventListener('click', clickHandler)
  
  // 默认选中第一个
  // setTimeout(() => {
  //   const firstNode = document.querySelector('.el-tree-node')
  //   if (firstNode) {      
  //     firstNode.click()
  //   }
  // }, 200)
})
onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
})
</script>

<style lang="less" scoped>
.home_detail {
  height: calc(100vh - 64px);
  padding: 32px;

  .main_content_box {
    height: 100%;
    width: 100%;
    padding: 0 24px 24px 24px;
    background-color: #fff;

    .header {
      height: 72px;
      line-height: 72px;
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      border-bottom: 1px solid #DDDDDD;

      .app_name {
        color: #0D162A;
      }

      .back {
        color: #98A3B7;
        cursor: pointer;
      }
    }

    .main {
      height: calc(100vh - 201px);
      display: flex;
      background-color: #F5F7FA;

      .left {
        height: 100%;
        width: 342px;
        margin-right: 20px;
        background-color: #fff;

        .left_content {
          height: 100%;
          padding: 24px 24px 24px 0;

          .left_top {
            position: relative;
            display: flex;
            align-items: center;

            .input_filter {
              width: 268px;
              height: 40px;
              font-size: 14px;
              margin: 0 0 0 11px;

              :deep(.el-input__wrapper) {
                box-shadow: 0 0 0 0 !important;
                border-radius: 0px;
                border-bottom: 1px solid #D6DBE3 !important;

                .el-input__inner {
                  color: #0D162A;
                  font-size: 16px;
                }
              }
            }

            .add {
              margin-left: 14px;

              i {
                font-size: 14px;
                color: #495770;
                cursor: pointer;
              }
            }
          }

          .add_box {
            position: absolute;
            z-index: 9999;
            left: 310px;
            top: 225px;
            border: 1px solid #D6DBE3;

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
                box-sizing: border-box;
              }

              li:hover {
                color: #3366FF;
              }
            }
          }

          .operation_box {
            position: fixed;
            border: 1px solid #D6DBE3;
            z-index: 999;

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

          .left_bottom {
            height: calc(100% - 30px);
            overflow: auto;
            margin-top: 11px;
            // background-color: pink;
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
              padding-left: 28px;
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
              .active_text{
                color: #0052D9;
              }

              .operation {
                color: #0D162A;
                cursor: pointer;
                float: right;
                font-size: 18px;
              }
            }

            :deep(.el-tree-node__content) {
              height: 32px !important;
            }

            :deep(.el-tree-node__expand-icon) {
              display: none;
            }
          }
        }
      }

      .right {
        height: 100%;
        // flex: 1;
        width: calc(100vw - 474px);
        background-color: #fff;
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
}</style>