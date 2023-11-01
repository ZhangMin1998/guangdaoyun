<template>
  <div class="link_manage_box">
    <el-tabs v-model="activeName" :class="{onlytwotabs:!isSingleShare}" @tab-click="handleClick">
      <el-tab-pane label="表单填写链接" name="write">
        <!-- 普通带序号，使用者自己table的data数据,带多选 -->
        <Table type='data' v-model:pageNum='tableData.pageNum' :tableColumns='tableColumns' :tableData='tableData.data'
               :pageTotal='tableData.pageTotal' :pageSize='tableData.pageSize' @refreshData='refreshWriteData'
               v-if="activeName === 'write'">
          <template #publishTime="{ row }">
            <span>
              {{ dayjs(row.publishTime).format('YYYY-MM-DD') }}
            </span>
          </template>
          <template #linkUrl="{ row }">
            <CopyAndOpenUrl :url="handelLink(row.linkUrl)"></CopyAndOpenUrl>
          </template>
          <template #state="{ row }">
            <el-switch v-model="row.state" @change="statusChange(row)"></el-switch>
          </template>
        </Table>
      </el-tab-pane>
      <el-tab-pane label="公开查询链接" name="search">
        <!-- 普通带序号，使用者自己table的data数据,带多选 -->
        <Table type='data' v-model:pageNum='tableData.pageNum' :tableColumns='tableColumns' :tableData='tableData.data'
               :pageTotal='tableData.pageTotal' :pageSize='tableData.pageSize' @refreshData='refreshSearchData'
               v-if="activeName === 'search'">
          <template #publishTime="{ row }">
            <span>
              {{ dayjs(row.publishTime).format('YYYY-MM-DD') }}
            </span>
          </template>
          <template #linkUrl="{ row }">
            <CopyAndOpenUrl :url="handelLink(row.linkUrl)"></CopyAndOpenUrl>
          </template>
          <template #state="{ row }">
            <el-switch v-model="row.state" @change="statusChange(row)"></el-switch>
          </template>
        </Table>
      </el-tab-pane>
      <el-tab-pane label="单条数据分享链接" name="share" v-if="isSingleShare">
        <!-- 普通带序号，使用者自己table的data数据,带多选 -->
        <Table type='data' v-model:pageNum='tableData.pageNum' :tableColumns='tableColumns' :tableData='tableData.data'
               :pageTotal='tableData.pageTotal' :pageSize='tableData.pageSize' @refreshData='refreshShareData'
               v-if="activeName === 'share'">
          <template #publishTime="{ row }">
            <span>
              {{ dayjs(row.publishTime).format('YYYY-MM-DD') }}
            </span>
          </template>
          <template #linkUrl="{ row }">
            <CopyAndOpenUrl :url="handelLink(row.linkUrl)"></CopyAndOpenUrl>
          </template>
          <template #state="{ row }">
            <el-switch v-model="row.state" @change="statusChange(row)"></el-switch>
          </template>
        </Table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import Table from '@/components/Table/index.vue'
import CopyAndOpenUrl from '@/views/home/create-form/components/CopyAndOpenUrl.vue'
import { getWriteList, getPublishList } from '@/api/homedetail'
import type { TabsPaneContext } from 'element-plus'
import { switchStatus, setReadswitchStatus } from '@/api/home'
import { dayjs } from 'element-plus'
let tableColumns = [
  { label: '采集人', prop: 'gatherUserName', minWidth: '30' },
  { label: '发布时间', prop: 'publishTime', minWidth: '60', haveSlot: true },
  { label: '链接', prop: 'linkUrl', minWidth: '200', haveSlot: true },
  { label: '状态', prop: 'state', minWidth: '90', haveSlot: true }
]
// let tableData = ref([])
const props = defineProps({
  formId: {
    type: Number
  },
  isSingleShare: {
    type: Boolean
  }
})
const tableData = reactive({
  data: [],
  pageNum: 1,
  pageSize: 5,
  pageTotal: 10
})
const activeName = ref('write')

onMounted(() => {
  searchWriteList()

})
watch(() => props.formId, (newval) => {
  console.log(newval)
})

function searchWriteList() {
  getWriteList({
    formId: props.formId,
    pageSize: tableData.pageSize,
    pageNum: tableData.pageNum
  }).then((res: any) => {
    tableData.pageTotal = res.totalSize
    tableData.data = res.content
  })
}
function refreshWriteData(pageNum: number): void {
  tableData.pageNum = pageNum
  searchWriteList()
  defineColumns(true)
}
function refreshSearchData(pageNum: number): void {
  tableData.pageNum = pageNum
  getPublishList({
    formId: props.formId,
    pageSize: tableData.pageSize,
    pageNum: tableData.pageNum,
    readType: 'all_sharing'
  }).then((res: any) => {
    tableData.pageTotal = res.totalSize
    tableData.data = res.content
    defineColumns(false)
  })
}
function refreshShareData(pageNum: number): void {
  tableData.pageNum = pageNum
  getPublishList({
    formId: props.formId,
    pageSize: tableData.pageSize,
    pageNum: tableData.pageNum,
    readType: 'single_sharing'
  }).then((res: any) => {
    tableData.pageTotal = res.totalSize
    tableData.data = res.content
    defineColumns(false)
  })
}

const defineColumns = (haveGatherUserName) => {
  if (haveGatherUserName) {
    tableColumns = [
      { label: '采集人', prop: 'gatherUserName', minWidth: '30' },
      { label: '发布时间', prop: 'publishTime', minWidth: '60', haveSlot: true },
      { label: '链接', prop: 'linkUrl', minWidth: '200', haveSlot: true },
      { label: '状态', prop: 'state', minWidth: '90', haveSlot: true }
    ]
  } else {
    tableColumns = [
      { label: '发布时间', prop: 'publishTime', minWidth: '60', haveSlot: true },
      { label: '链接', prop: 'linkUrl', minWidth: '200', haveSlot: true },
      { label: '状态', prop: 'state', minWidth: '90', haveSlot: true }
    ]
  }
}

const statusChange = (row) => {
  const { formId, id, state } = row
  if (activeName.value === 'write') {
    switchStatus(formId, state, id).then((res) => {
      console.log(res)
    })
  } else {
    setReadswitchStatus(formId, state, id).then((res) => {
      console.log(res)
    })
  }
}
const handleClick = (tab: TabsPaneContext) => {
  setTimeout(() => {
    tableData.pageNum = 1
    tableData.pageTotal = 10
    if (tab.index === '0') {
      searchWriteList()
      defineColumns(true)
    } else if (tab.index === '1') {
      getPublishList({
        formId: props.formId,
        pageSize: tableData.pageSize,
        pageNum: tableData.pageNum,
        readType: 'all_sharing'
      }).then((res: any) => {
        tableData.pageTotal = res.totalSize
        tableData.data = res.content
        defineColumns(false)
      })
    } else if (tab.index === '2') {
      getPublishList({
        formId: props.formId,
        pageSize: tableData.pageSize,
        pageNum: tableData.pageNum,
        readType: 'single_sharing'
      }).then((res: any) => {
        tableData.pageTotal = res.totalSize
        tableData.data = res.content
        defineColumns(false)
      })
    }
  }, 0)

}

const handelLink = (link) => {
  return 'http://202.105.96.110:21185' + link
  // return window.location.origin + link
}
</script>

<style lang="less" scoped>
.link_manage_box {
  :deep(.el-tabs) {
    .el-tabs__header {
      width: 480px;
    }
    .el-tabs__item.is-top::before,.el-tabs__item.is-top::after{
      content: '';
      display: block;
      width: 20px;
    }
  }
  :deep(.onlytwotabs){
    .el-tabs__header {
      width: 288px;
    }
  }
}
</style>