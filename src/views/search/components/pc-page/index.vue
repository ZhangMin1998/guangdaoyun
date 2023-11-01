<template>
  <div class="pc_page">
    <div class="main_content_box">
      <div class="header_box">
        <div class="left_title">{{ formInfo.appName }} / {{ formInfo.formName }}</div>
        <!-- <div class="right_back">返回</div> -->
      </div>
      <div class="table_box">
        <div class="table_header">
          <!-- <el-input placeholder="请输入"></el-input> -->
          <el-input v-model="searchParams.search" placeholder="请输入" clearable @change="inputSearchEvent">
            <template #suffix>
              <i class="iconfont icon-icon_sousuo" @click="inputSearchEvent"></i>
            </template>
          </el-input>
          <!-- <el-button plain class="blank">字段设置</el-button> -->
        </div>
        <div class="main_table">
          <Table type='data' v-model:pageNum='tableData.pageNum' v-if="tableData.tableColumns.length"
                 :tableColumns='tableData.tableColumns' :tableData='tableData.data' :pageTotal='tableData.totalSize'
                 :pageSize='tableData.pageSize' @refreshData='refreshData'>
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
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { searchList } from '@/api/search'
import Table from '@/components/Table/index.vue'
const currentRoute = useRoute()
const props = defineProps({
  formInfo: {
    type: Object
  }
})
const searchParams = reactive({
  pageNum: 1,
  pageSize: 10,
  search: ''
})
const tableData = reactive({
  data: [],
  tableColumns: [],
  pageNum: 1,
  pageSize: 10,
  totalSize: 10
})

onMounted(() => {
  searchListEvent()
})

const searchListEvent = () => {
  searchList({ formId: props.formInfo.formId, codeUuid: currentRoute.query.uuid, ...searchParams }).then((res:any) => {
    tableData.tableColumns = forMatTableHeader(res.fieldVOList)
    if(res.page){
      tableData.data = res.page.content
      tableData.totalSize = res.page.totalSize
    }else{
      tableData.data = []
      tableData.totalSize = 0
    }
  })
}

const inputSearchEvent = () => {
  searchListEvent()
}

// const forMatTableHeader = (data) => {
//   data.forEach((item) => {
//     item.label = item.fieldCn
//     item.prop = item.fieldEn
//     item.minWidth = '10%'
//     if (item.moduleType === 'user') {
//       item.haveSlot = true
//     }
//   })
//   return data
// }
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

function refreshData(pageNum: number): void {
  searchParams.pageNum = pageNum
  searchListEvent()
}
</script>

<style lang="less" scoped>
.pc_page {
  min-height: calc(100vh - 64px);
  padding: 32px;
  display: flex;

  .main_content_box {
    width: 100%;
    flex: 1;
    background-color: #fff;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .header_box {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid #DDDDDD;

      .left_title {
        color: @base-text-color-2;
        font-size: 18px;
      }

      .right_back {
        color: #98A3B7;
        font-size: 18px;
      }
    }

    .table_box {
      flex: 1;
      padding-top: 24px;
      display: flex;
      flex-direction: column;

      .table_header {
        display: flex;
        justify-content: space-between;

        .el-input {
          width: 320px;
        }

        .icon-icon_sousuo {
          cursor: pointer;
        }
      }

      .main_table {
        margin-top: 20px;
        flex: 1;
      }
    }
  }
}
</style>