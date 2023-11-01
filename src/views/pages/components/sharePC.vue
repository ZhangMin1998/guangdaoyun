<template>
  <div class="share_PC">
    <div class="header">
      <div class="title">{{ formInfo.appName }} / {{ formInfo.formName }}</div>
      <el-popover placement="bottom-start" trigger="click" popper-class="qrcode_popover" :offset="20">
        <template #reference>
          <i class="iconfont icon-icon_erweima"></i>
        </template>
        <template #default>
          <div class="qrcode">
            <span class="text">扫描二维码，分享此链接</span>
            <qr-code class="code_img" :value="shareOpenUrl" :size="150" id="canvasDom"></qr-code>
            <el-button class="blank" plain @click="downLoadQRcode">下载</el-button>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="divider"></div>
    <div class="main">
      <div class="form_box">
        <Table
          type="data"
          v-if="tableData.tableColumns.length"
          v-model:pageNum="tableData.pageNum"
          :table-data="tableData.data"
          :table-columns="tableData.tableColumns"
          :page-total="0"
          :page-size="tableData.pageSize"
          :indexColWidth="70"
        >
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
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router' // useRouter
import { getReadFormData, getQrcodeModule } from '@/api/pages'
// import { searchList } from '@/api/search'
// import { ElMessage } from 'element-plus'
import qrCode from '@/components/Qrcode/index.vue'
import Table from '@/components/Table/index.vue'
// import formCreate from '@form-create/element-ui'
// const FormCreate = formCreate.$form()

// // const router = useRouter()
const currentRouter = useRoute()

const formName = ref('')
const shareOpenUrl = ref('')
shareOpenUrl.value = window.location.href
// const password = ref('')

const props = defineProps({
  formInfo: {
    type: Object
  }
})

const tableData = reactive({
  data: [],
  tableColumns: [],
  pageNum: 1,
  pageSize: 10,
  totalSize: 10
})
// const isShow = ref(false)

const downLoadQRcode = (): void => {
  const canvas = document.getElementById('canvasDom') as HTMLCanvasElement
  const url = canvas.toDataURL('image/png') // 通过 toDataURL 返回一个包含图片展示的 data URI 
  const aDom = document.createElement('a')
  aDom.download = '二维码' // 设置下载的文件名
  aDom.href = url
  document.body.appendChild(aDom)
  aDom.click()
  aDom.remove()
}

const queryModule = async () => {
  const result = await getQrcodeModule({ formId: props.formInfo.formId })
  formName.value = result.formName
  
  const mData = {
    formId: props.formInfo.formId,
    codeUuid: currentRouter.query.uuid,
    pageNum: 1,
    pageSize: 10,
    search: ''
  }
  const res = await getReadFormData(mData)
  // console.log('组件', res)

  tableData.tableColumns = forMatTableHeader(res.fieldVOList)
  if(res.page){
    tableData.data = res.page.content
    tableData.totalSize = res.page.totalSize
  }else{
    tableData.data = []
    tableData.totalSize = 0
  }
}
const forMatTableHeader = (data) => {
  data.forEach((item) => {
    item.label = item.fieldCn
    item.prop = item.fieldEn
    item.minWidth = '10%'
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


onMounted(async () => {
  queryModule()
})
</script>

<style lang="less" scoped>
.share_PC{
  height: calc(100vh - 128px);
  background: #FFFFFF;
  margin: 32px 32px 0 32px;
  .header{
    height: 72px;
    padding: 24px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{
      color: #0D162A;
    }
  }
  .divider{
    height: 2px;
    margin: 0 24px;
    background: #f5f7fa;
  }
  .main{
    margin: 24px 24px 0 24px;
    .form_box{
      height: 100%;
      overflow-x: auto;
    }
  }
}
.qrcode {
  height: 256px;
  width: 190px !important;
  margin-left: -18px;
  background-color: #fff;
  user-select: none;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 1px rgba(0, 82, 217, 0.08);
  border: 1px solid #DDDDDD;
  padding: 16px;

  .text {
    font-size: 14px;
  }
  .el-button{
    background-color: #f2f6fd;
  }

  .code_img {
    margin: 12px 0;
  }
}
.dialog_box {
  box-sizing: border-box;
  padding: 0px 12px 0 4px; // 34
  .content_box {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .input_box {
      flex: 1;
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
  }
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
<style lang="less">
.qrcode_popover {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;

  .el-popper__arrow::before {
    display: none;
  }
}
</style>