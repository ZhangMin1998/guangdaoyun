<template>
  <div class="table_pagination_wrap">
    <div class="table_wrap">
      <el-config-provider :locale="zhCn">
        <el-table v-loading="isLoading" element-loading-text="数据正在加载中" :data="data" :border="border"
                  :empty-text="emptyText" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
          <el-table-column v-if="multiple" type="selection" :width="selectionWidth" :resizable="true" />
          <el-table-column v-if="haveIndex" type="index" label="序号" :width="indexColWidth"
                           :index="indexFun"
                           :resizable="true" />
          <template v-if="tableColumns.length">
            <el-table-column v-for="(item, index) in (tableColumns as any)" :key="index" :prop="item.prop"
                             :label="item.label" :width="item.width" :min-width="item.minWidth" :resizable="true">
              <template v-slot="{ row }">
                <div v-if="!item.haveSlot" class="content">
                  <div class="text" v-if="item.showHtml" v-html="row[item.prop] || '--'" :title="row[item.prop] || '--'">
                  </div>
                  <div class="text" v-else-if="item.showOnlyValue" :title="deleteBracket(row[item.prop])">
                    {{ deleteBracket(row[item.prop]) }}
                  </div>
                  <div class="text" v-else :title="row[item.prop] || '--'">
                    {{ row[item.prop] || '--' }}
                  </div>
                </div>
                <slot v-else :name="item.prop" :row="row"></slot>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="btnRender && btnRender.length" label="操作" :width="btnRenderWidth" :resizable="false"
                           class-name="opt">
            <template v-slot="{ row }">
              <div class="opera_btn" v-if="!btnRenderSlot">
                <i v-for="(btnItem, btnIndex) in (btnRender as any)" :key="btnIndex" :class="[btnItem.icon, 'iconfont']"
                   :style="btnItem.style" :title="btnItem.title"
                   @click.prevent="btnItem.btnEvent && btnItem.btnEvent(row)"></i>
              </div>
              <slot v-else name="btnRenderSlot" :row="row"></slot>
            </template>
          </el-table-column>
          <!-- 适用于密码管理的操作列 操作按钮的图标每一行可能不一样 -->
          <el-table-column v-if="btnRender2 && btnRender2.length" label="操作" :width="btnRenderWidth" :resizable="false"
                           class-name="opt">
            <template v-slot="{ row }">
              <div class="opera_btn">
                <span v-for="(btnItem, btnIndex) in (btnRender2 as any)" :key="btnIndex">
                  <i v-if="btnItem.status === row.status" :class="[btnItem.icon, 'iconfont']" :title="btnItem.title"
                     @click.prevent="btnItem.btnEvent && btnItem.btnEvent(row)"></i>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-config-provider>
    </div>
    <div class="pagination_wrap" v-if="total">
      <div class="total">{{ total }}</div>
      <el-config-provider :locale="zhCn">
        <el-pagination background :layout="pageLayout" :total="total" v-model:current-page="currentPage"
                       :page-size="currentPageSize" />
      </el-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref, watch, computed, onMounted } from 'vue'
import request from '@/utils/request'

/*ts接口*/

/*声明props*/
const props = defineProps({
  // 加载条
  isLoading: {
    type: Boolean,
    default: false
  },
  // 表格使用方式，‘data’：为传递表格数据方式，‘url’：为传递url获取数据方式
  type: {
    type: String,
    default: 'url'
  },
  // 是否需要前端自行分页
  needPaging: {
    type: Boolean,
    default: false
  },
  // 表格数据
  tableData: {
    type: Array,
    default: () => []
  },
  // 是否带有纵向边框
  border: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 表头信息
  tableColumns: {
    type: Array,
    default: () => []
  },
  // 是否需要序号列
  haveIndex: {
    type: Boolean,
    default: true
  },
  // 序号列宽度
  indexColWidth: {
    type: [String, Number],
    default: 120
  },
  btnRender: {
    type: Array,
    default: () => []
  },
  btnRenderWidth: {
    type: String,
    default: '120px'
  },
  btnRender2: {
    type: Array,
    default: () => []
  },
  btnRenderSlot: {
    type: Boolean,
    default: false
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: false
  },
  selectionWidth: {
    type: [String, Number],
    default: '32'
  },
  // ‘url’：为传递url获取数据方式,url的值
  url: {
    type: String,
    default: ''
  },
  // ‘url’：为传递url获取数据方式,接口的请求方式
  reqMethod: {
    type: String,
    default: 'get'
  },
  // ‘url’：为传递url获取数据方式,接口的请求参数
  reqParams: {
    type: Object,
    default: () => { }
  },
  // 传递tableData时，需要传递
  pageTotal: {
    type: Number,
    default: 0
  },
  // 分页组件布局
  pageLayout: {
    type: String,
    default: 'prev, pager, next, jumper'
  },
  // 当前页
  pageNum: {
    type: Number,
    default: 1
  },
  // 每页显示的条目个数
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits([
  'refreshData',
  'update:pageNum',
  'select',
  'select-all',
  'getDataSuccess'
])

/*声明存储*/
const data = ref([]) // 表格数据
const urlData = ref([]) // 通过url获取数据信息
const total = ref(0) // 数据总数
const currentPageSize = ref(10) // 每页显示的条目个数

/*计算属性computed*/
// 根据是否需要前端自行分页，判断在当前页发生变化时，使用那个处理方法
const pageChangeFun = computed(() => {
  return props.needPaging ? selfPageChange : pageChange
})
const currentPage = computed<number>({
  get() {
    return props.pageNum
  },
  set(value) {
    emit('update:pageNum', value)
  }
})

/*监听watch*/
watch(currentPage, (newVal) => {
  pageChangeFun.value(newVal)
})

/*onMounted*/
onMounted(() => {
  currentPageSize.value = props.pageSize
  if (props.type === 'data') {
    total.value = props.pageTotal
    if (props.needPaging) {
      data.value = props.tableData.slice(0, props.pageSize)
    } else {
      data.value = props.tableData
    }
    // 对tableData进行监听
    watch(
      () => props.tableData,
      () => {
        total.value = props.pageTotal
        if (props.needPaging) {
          selfPageChange(currentPage.value)
        } else {
          data.value = props.tableData
        }
      }
    )
  } else if (props.type === 'url') {
    // 通过url的方式获取数据
    getUrlData()
  }
})

// 不需要前端自行分页时，当前页发生变化时
function pageChange(page: number): void {
  if (props.type === 'data') {
    // 当为传递表格数据方式时
    emit('refreshData', page)
  } else if (props.type === 'url') {
    getUrlData()
  }
}
// 需要前端自行分页时，当前页发生变化时
function selfPageChange(page: number): void {
  const updateData = []
  const start = (page - 1) * currentPageSize.value
  const end = page * currentPageSize.value
  const list = props.type === 'url' ? urlData.value : props.tableData
  list.forEach((item, index) => {
    if (index >= start && index < end) {
      updateData.push(item)
    }
  })
  data.value = updateData
}
// ‘url’：为传递url获取数据方式,获取数据的方法
function getUrlData() {
  const paramName = props.reqMethod === 'get' ? 'params' : 'data'
  const req = {
    url: props.url,
    method: props.reqMethod,
    [paramName]: {
      ...props.reqParams,
      pageSize: currentPageSize.value,
      pageNum: currentPage.value
    }
  }
  request(req).then((res: any) => {
    // 该地方等后端返回数据结构确定好后再处理
    const resultList = res ? (Array.isArray(res) ? res : res.content || []) : []
    getUrlSuccess(resultList)
    if (!props.needPaging) total.value = res && res.totalSize ? res.totalSize : 0
  })
}
// ‘url’：为传递url获取数据方式,获取数据成功之后
function getUrlSuccess(list) {
  let callback
  emit('getDataSuccess', list, (val) => {
    callback = val
  })
  if (callback === undefined) {
    urlData.value = list
  } else if (callback === false) {
    urlData.value = []
  } else {
    urlData.value = callback
  }
  if (props.needPaging) {
    selfPageChange(currentPage.value)
    total.value = urlData.value.length
  } else {
    data.value = urlData.value
  }
}

/*声明函数*/
function indexFun(index: number): number {
  ++index
  return index + (currentPage.value - 1) * props.pageSize
}
// 当用户手动勾选数据行的 Checkbox 时触发的事件
function handleSelect(selection, row) {
  emit('select', selection, row)
}
// 当用户手动勾选全选 Checkbox 时触发的事件
function handleSelectAll(selection) {
  emit('select-all', selection)
}

function deleteBracket(value) {
  if (value) {
    const newvalue = value.replace(/\[|]/g, '')
    return newvalue || '--'
  } else {
    return '--'
  }
}
</script>

<style lang="less" scoped>
.table_pagination_wrap {
  width: 100%;
  height: 100%;

  .table_wrap {
    height: calc(100% - 52px);

    :deep(.el-table) {
      height: 100%;
    }

    .content {
      cursor: pointer;
    }

    .text {
      // width: 50px;
      text-overflow: ellipsis;
      /* 溢出显示省略号 */
      overflow: hidden;
      /* 溢出隐藏 */
      white-space: nowrap;
    }
  }

  .pagination_wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 28px;
    margin-top: 24px;

    .total {
      font-size: 12px;
      color: @base-text-color-4;
      margin-right: 20px;

      &::before {
        display: inline-block;
        content: '共';
        color: @base-text-color-3;
        margin-right: 4px;
      }

      &::after {
        display: inline-block;
        content: '条';
        color: @base-text-color-3;
        margin-left: 4px;
      }
    }
  }

  .iconfont {
    color: #4a5871;
    font-size: 24px;
  }

  .opera_btn {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}
</style>
