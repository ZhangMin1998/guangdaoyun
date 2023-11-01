<template>
  <div class='demo'>
    <div class='demo_table_wrap'>
      <!-- 普通带序号，使用者自己table的data数据 -->
      <Table
        type='data'
        v-model:pageNum='pageNum'
        :tableColumns='tableColumns'
        :tableData='tableData'
        :pageTotal='20000'
        :pageSize='6'
        :btnRender='btnRender'
        @refreshData='refreshData'
      >
        <template #sex>
          aaaa
        </template>
      </Table>
    </div>
    <div class='demo_table_wrap'>
      <!-- 普通带序号，使用者自己table的data数据,带多选 -->
      <Table
        type='data'
        v-model:pageNum='pageNum'
        :tableColumns='tableColumns'
        :tableData='tableData2'
        :multiple='true'
        :pageTotal='20000'
        :pageSize='6'
        :btnRender='btnRender'
        @refreshData='refreshData'
      >
        <template #sex>
          aaaa
        </template>
      </Table>
    </div>
    <div class='demo_table_wrap'>
      <Table
        v-model:pageNum='pageNum'
        :tableColumns='tableColumns2'
        :url='"/police/monitor/config/list"'
        reqMethod='post'
      ></Table>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import Table from '@/components/Table/index.vue'

const tableColumns = [
  { label: '姓名', prop: 'name', minWidth: '90' },
  { label: '身份证', prop: 'id', minWidth: '90' },
  { label: 'xingbie', prop: 'sex', minWidth: '90', haveSlot: true }
]
const btnRender = [
  {
    label: '发送预警',
    icon: 'no-inherit',
    title: '发送预警'
  },
  {
    label: '编辑',
    icon: 'no-inherit',
    btnEvent: btnClick,
    title: '编辑'
  },
  {
    label: '删除',
    icon: 'no-inherit',
    title: '删除'
  }
]
const tableColumns2 = [
  { label: '编码', prop: 'id', minWidth: '90', haveSlot: true },
  { label: '布控名称', prop: 'name', minWidth: '90' },
  { label: '布控级别', prop: 'level', minWidth: '90', haveSlot: true },
  { label: '布控数据', prop: 'dataTypeSelectFlag', minWidth: '90', haveSlot: true },
  { label: '布控时间', prop: 'timeSelectFlag', minWidth: '90', haveSlot: true },
  { label: '布控区域', prop: 'regionSelectFlag', minWidth: '90', haveSlot: true },
  { label: '布控特征数', prop: 'featuresCount', minWidth: '90' },
  { label: '修改人', prop: 'updateOperator', minWidth: '90' }
]
const tableData = ref([
  { name: '打', id: '2', sex: '1' },
  { name: '小', id: '2', sex: '1' },
  { name: '额', id: '1', sex: '1' },
  { name: '万', id: '1', sex: '1' },
  { name: '小', id: '4', sex: '222' },
  { name: '大', id: '4', sex: '222' }
])
const tableData2 = ref([
  { name: '打2', id: '2', sex: '1' },
  { name: '小2', id: '2', sex: '1' },
  { name: '额2', id: '1', sex: '1' },
  { name: '万2', id: '1', sex: '1' },
  { name: '小2', id: '4', sex: '222' },
  { name: '大2', id: '4', sex: '222' }
])
const pageNum = ref(1)

function refreshData (pageNum: number): void {
  console.log(pageNum)
  tableData.value = [{ name: '打', id: '2', sex: '1' }]
}
function btnClick(row) {
  console.log('row', row)
}
</script>

<style lang='less' scoped>
.demo {
  padding: 0 24px;
  .demo_table_wrap {
    height: 300px;
  }
}
</style>