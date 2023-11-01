<template>
  <div class="home_wrap">
    <div class="header_wrap">单条数据分享</div>
    <div class="content_wrap">
      <div class="list_wrap" v-if="dataInfo.length">
        <div v-for="(item, index) in dataInfo" :key="index" class="card_warp">
          <FormInfoCard 
            :label-info-list="item.label" 
            :card-info="item.data" 
            :show-detail="item.showDetail"
            :info-index="index + 1" 
            @click="handleCard(index)"
          >
          </FormInfoCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import FormInfoCard from '@/views/search/components/form-info-card/index.vue'

const currentRouter = useRoute()

const tableData = {
  data: [],
  tableColumns: [],
  pageNum: 1,
  pageSize: 10,
  totalSize: 10
}
const dataInfo = ref([])

/* 声明函数 */
function handleCard(ind: number): void {
  dataInfo.value[ind].showDetail = !dataInfo.value[ind].showDetail
}

const queryModule = async () => {
  const mData = {
    formId: currentRouter.query.formId,
    codeUuid: currentRouter.query.uuid,
    pageNum: 1,
    pageSize: 10,
    search: ''
  }
  const res = await getReadFormData(mData)
  tableData.tableColumns = forMatTableHeader(res.fieldVOList)
  if(res.page){
    tableData.data = forMatTableContent(res.page.content)
    dataInfo.value = forMatData(tableData.tableColumns, tableData.data)
  }else{
    dataInfo.value = []
  }
  console.log(dataInfo.value)
}

const forMatTableContent = (data) => {
  data.forEach((item) => {
    if (item.hasOwnProperty('founder') && item.founder) {
      item.founder = item.founder.realName || '--'
    }
    if (item.hasOwnProperty('gather_user_id') && item.gather_user_id) {
      item.gather_user_id = item.gather_user_id.realName || '--'
    }
  })
  return data
}
const forMatTableHeader = (data) => {
  data.forEach((item, index) => {
    item.label = item.fieldCn
    item.prop = item.fieldEn
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
    if (index < 4) {
      item.isSearch = true
    } else {
      item.isSearch = false
    }
  })
  return data
}
const forMatData = (label, data) => {
  const newarr = []
  data.forEach((item) => {
    const obj: any = {}
    obj.label = label
    obj.data = item
    obj.showDetail = false
    newarr.push(obj)
  })
  return newarr
}
onMounted(() => {
  queryModule()
})

</script>

<style lang="less" scoped>
.home_wrap {
  width: 100%;
  height: 100%;
  background: #F6F6F8;
  // background: pink;
  .header_wrap {
    display: flex;
    justify-content: center;
    background: #FFFFFF;
    padding: 28px 0;
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: #0D162A;
  }

  .content_wrap {
    padding: 30px 0;
    // padding: 30px 0 60px 0;
    // min-height: calc(100% - 64px) !important;

    .search_wrap {
      padding: 0 30px;
      margin-bottom: 30px;

      ::v-deep(.van-cell) {
        background: transparent;
        padding: 14px;
        line-height: 36px;
        border: 1px solid #D6DBE3;
        border-radius: 4px;
      }

      ::v-deep(.van-field__right-icon .van-icon) {
        font-size: 36px;
        font-weight: bold;
        color: #495770;
      }

      ::v-deep(.van-field__control) {
        color: #0D162A;
      }
    }

    .list_wrap {
      padding: 0 30px;
      height: calc(100% - 98px);
      overflow-y: auto;

      .card_warp {
        margin-bottom: 30px;
      }
    }
  }
}
</style>