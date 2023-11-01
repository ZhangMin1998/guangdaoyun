<template>
  <div class="buildNew">
    <div class="title">
      <div class='tip_info'>
        <!-- <img src='@/assets/img/title-header.png' alt=''> -->
        <div class='tip'>详情</div>
      </div>
      <i class="iconfont icon-icon_guanbi" @click="closeDetail"></i>
    </div>
    <div class="main_content">
      <div class="role_info">
        <ul>
          <li>
            <span class="qusetion">角色名称：</span>
            <span class="answer">{{ roleDetailData.roleName }}</span>
          </li>
          <li>
            <span class="qusetion">创建人：</span>
            <span class="answer">{{ roleDetailData.createBy }}</span>
          </li>
          <li>
            <span class="qusetion">创建时间：</span>
            <span class="answer">{{ roleDetailData.createTime }}</span>
          </li>
          <li>
            <span class="qusetion">用户数量：</span>
            <span class="answer"> {{ roleDetailData.userNum }} </span>
          </li>
        </ul>
      </div>
      <!-- <div class="step_box">
        <div class="step"></div>
      </div> -->
      <div class="step_content_common">
        <div class="input_box">
          <div class="feauter_module">
            <div class="feauter_header">
              <span>菜单模块</span>
              <span>权限设置</span>
            </div>
            <div class="feauter_tree">
              <el-tree
                class="el-tree-addordel set_underline"
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                key="1"
                empty-text="暂无数据"
              >
                <template v-slot="{ node, data }">
                  <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span class="operation">
                      {{ data.isPublic ? '公开' : '禁止' }}
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { listWithTreeByRoleId } from '@/api/contact'

const props = defineProps({
  roleDetailData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits([
  'closeDetail'
])
const treeData = ref([])
const defaultProps = ref({
  children: 'children',
  label: 'moduleName'
})

const searchRoleMenu = () => {
  listWithTreeByRoleId({ roleId: props.roleDetailData.id }).then((res:any) => {
    treeData.value = res
  })
}
const closeDetail = () => {
  emit('closeDetail')
}

onMounted(() => {
  if (props.roleDetailData.id) searchRoleMenu()
})
</script>

<style lang="less" scoped>
.buildNew {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tip_info {
      display: flex;
      align-items: center;
      font-size: 18px;
      line-height: 32px;
      color: #495770;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .tip {
        font-weight: bold;
      }
    }
    i {
      font-size: 24px;
      color: #495770;
      cursor: pointer;
      &:hover {
        color: #0052D9;
      }
    }
  }

  .main_content {
    margin-top: 20px;
    padding: 16px 24px 28px;
    // background-color: red;
    .role_info {
      line-height: 22px;
      ul {
        display: flex;
        li {
          margin-left: 88px;
          .qusetion {
            color: #495770;
          }
          .answer {
            color: #0D162A;
          }
        }
        li:nth-child(1) {
          margin-left: 0;
        }
      }
    }
    .step_box {
      width: 100%;
      height: 40px;
      background-color: #344055;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .step {
        width: 200px;
      }
    }
    .step_content_common {
      width: 100%;
      // height: 100%;
      margin-top: 14px;
      box-sizing: border-box;
      height: calc(100vh - 300px);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .input_box {
        flex: 1;
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
            height: calc(100vh - 400px);
            // background-color: red;
            //margin-top: 14px;
            overflow: auto;
            .custom-tree-node {
              font-size: 16px;
              color: #0D162A;
              display: inline-block;
              width: 100%;
              padding-right: 10px;
              position: relative;
            }
            .operation {
              float: right;
              margin-right: 402px;
            }
          }
        }
      }
    }
  }
}
:deep(.el-tree-node__expand-icon) {
  // padding-left: 32px;
  padding-top: 8px;
}
:deep(.set_underline > div.el-tree-node) {
  border-bottom: 1px solid #f1f2f5;
  padding-top: 6px;
  padding-bottom: 8px;
}
</style>
