<template>
  <div class="home_wrap">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                :immediate-check="false">
        <div class="main_content">
          <div class="header_wrap">查询全部数据</div>
          <div class="content_wrap">
            <div class="search_wrap">
              <van-field v-model="searchParams.search" label="" placeholder="请输入" clearable
                         label-align="top"
                         right-icon="search" @click-right-icon="inputSearchEvent" @keyup.enter="inputSearchEvent"
                         @clear="inputSearchEvent('clear')" />
            </div>
            <div class="list_wrap" v-if="dataInfo.length">
              <div v-for="(item, index) in dataInfo" :key="index" class="card_warp">
                <FormInfoCard :label-info-list="item.label" :card-info="item.data" :show-detail="item.showDetail"
                              :info-index="index + 1" @click="handleCard(index)"></FormInfoCard>
              </div>
            </div>
            <div class="no_data_box" v-if="isShowNoData && !dataInfo.length">
              <img src="@/assets/img/no_data.png" alt="">
              <span class="text">没有符合筛选条件的数据</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import FormInfoCard from '../form-info-card/index.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { searchList } from '@/api/search'
const currentRoute = useRoute()
/* 定义状态 */
const dataInfo = ref([])
// const props = defineProps({
//   formInfo: {
//     type: Object
//   }
// })

const searchParams = reactive({
  pageNum: 1,
  pageSize: 10,
  search: ''
})

const tableData = {
  data: [],
  tableColumns: [],
  pageNum: 1,
  pageSize: 10,
  totalSize: 10
}

onMounted(() => {
  searchListEvent('')
})

const loading = ref(false)
const finished = ref(false)
const isLoading = ref(false)
const isShowNoData = ref(false)

const onLoad = () => {
  // 开始异步请求数据
  loading.value = true
  searchParams.pageNum++
  searchList({ formId: currentRoute.query.formId, codeUuid: currentRoute.query.uuid, ...searchParams }).then((res: any) => {
    loading.value = false
    tableData.tableColumns = forMatTableHeader(res.fieldVOList)
    isShowNoData.value = true
    if (res.page) {
      tableData.data = forMatTableContent(res.page.content)
      const newdata = forMatData(tableData.tableColumns, tableData.data)
      dataInfo.value = [...dataInfo.value, ...newdata]
      if (res.page.content.length < 10) {
        finished.value = true
      }
    } else {
      dataInfo.value = []
      finished.value = true
    }
  })


}
const onRefresh = () => {
  isLoading.value = true
  finished.value = false
  searchParams.pageNum = 1
  searchListEvent('refresh')
}

const searchListEvent = (key) => {
  searchList({ formId: currentRoute.query.formId, codeUuid: currentRoute.query.uuid, ...searchParams }).then((res: any) => {
    tableData.tableColumns = forMatTableHeader(res.fieldVOList)
    isShowNoData.value = true
    if (res.page) {
      tableData.data = forMatTableContent(res.page.content)
      dataInfo.value = forMatData(tableData.tableColumns, tableData.data)
    } else {
      dataInfo.value = []
    }
    if (key === 'refresh') {
      isLoading.value = false
    }
  })
}

const inputSearchEvent = (type) => {
  if (type === 'clear') {
    searchParams.search = ''
  }
  oldHandleCardInd.value = -1
  finished.value = false
  searchParams.pageNum = 1
  searchListEvent('')
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


const oldHandleCardInd = ref<number>(-1)

/* 声明函数 */
function handleCard(ind: number): void {
  if (oldHandleCardInd.value < 0) {
    oldHandleCardInd.value = ind
  } else if (oldHandleCardInd.value === ind) {
    oldHandleCardInd.value = -1
  } else {
    dataInfo.value[oldHandleCardInd.value].showDetail = false
    oldHandleCardInd.value = ind
  }
  dataInfo.value[ind].showDetail = !dataInfo.value[ind].showDetail
}

</script>

<style lang="less" scoped>
.home_wrap {
  width: 100%;
  height: 100%;
  background: #F6F6F8;

  // overflow: auto;
  .main_content{
    height: 100%;
  }
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
    padding: 30px 0 0 0;
    height: calc(100% - 96px);
    background: #F6F6F8;

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

    .no_data_box {
      // margin-top: 200px;
      height: calc(100vh - 260px);
      // height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 331px;
        height: 250px;
      }

      .text {
        margin-top: 48px;
        font-size: 28px;
        color: #98A3B7;
      }
    }

  }

  :deep(.van-list) .van-list__finished-text {
    background: #F6F6F8;
    // height: 40px;
    // line-height: 40px;
  }
}</style>