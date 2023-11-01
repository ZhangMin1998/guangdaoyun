<template>
  <!-- 公开查询 -->
  <div class="open_search">
    <div class="open_url_box">
      <div class="text">当设置为公开查询后，即可分享链接给外部人员查看整个表单数据。</div>
      <div class="is_open_url">
        <el-switch v-model="isOpenUrl" active-text="打开" inactive-text="关闭" @change="openUrlEvent" />
        <div class="show_url_box" v-if="isOpenUrl">
          <CopyAndOpenUrl v-model:url="openUrl"></CopyAndOpenUrl>
          <OpenWithPassword v-model:passwordSwitchStatus="passwordSwitchStatus" v-model:password="password"
                            v-model:id="readQrCodeId" :isSetReadPassword="true">
          </OpenWithPassword>
        </div>
      </div>
    </div>
    <div class="search_set_up" v-if="isOpenUrl">
      <div class="search_title">查询设置</div>
      <div class="option_box search_content">
        <span class="span_title">显示内容：</span>
        <el-select v-model="showContent" placeholder="请选择" multiple @change="optionChange"
                   no-data-text="暂无数据">
          <el-option v-for="item in options" :key="item.id" :label="item.fieldCn" :value="item.id" />
        </el-select>
      </div>
      <div class="option_box search_condition">
        <span class="span_title">查询条件：</span>
        <el-select v-model="searchCondition" placeholder="请先选择显示内容后再进行选择" multiple @change="conditionChange"
                   no-data-text="暂无数据">
          <el-option v-for="item in suboptions" :key="item.id" :label="item.fieldCn" :value="item.id" />
        </el-select>
      </div>
      <!-- <div class="wirte_with_password">
        <OpenWithPassword v-model:passwordSwitchStatus="passwordSwitchStatus" v-model:password="password"
          v-model:id="readQrCodeId">
        </OpenWithPassword>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import CopyAndOpenUrl from './CopyAndOpenUrl.vue'
import OpenWithPassword from './OpenWithPassword.vue'
import { ref, onMounted } from 'vue'
import { getOpenSearchInfo, setReadswitchStatus, searchFieldList, setFields } from '@/api/home'
import { useRoute } from 'vue-router'
// import { ElMessage } from 'element-plus'
const options: any = ref([])
const suboptions: any = ref([])
const currentRouter = useRoute()
const isOpenUrl = ref(false)
const openUrl = ref('')
const passwordSwitchStatus = ref(false)
const password = ref('')
const readQrCodeId = ref()
const showContent = ref([])
const searchCondition = ref([])
const openUrlEvent = (value) => {
  console.log(value)
  setReadswitchStatus(currentRouter.query.formId, isOpenUrl.value, readQrCodeId.value).then((res) => {
    console.log(res)
  })
}
onMounted(() => {
  searchOptionList()
  getOpenSearchInfo(currentRouter.query.formId, 'all_sharing').then((res) => {
    console.log('all_sharing',res)
    // openUrl.value = window.location.origin + res[0].linkUrl
    openUrl.value = 'http://202.105.96.110:21185' + res[0].linkUrl
    // console.log('http://202.105.96.110:21185');
    // console.log(window.location.origin);
    
    isOpenUrl.value = res[0].state
    passwordSwitchStatus.value = res[0].passwordSwitch
    password.value = res[0].password || ''
    readQrCodeId.value = res[0].id
    showContent.value = res[0].fields
    console.log('showContent',showContent.value)
    
    if (showContent.value && showContent.value.length) {
      suboptions.value = options.value.filter((item) => {
        return showContent.value.includes(item.id)
      })
    }
    searchCondition.value = res[0].conditionFields
  })
})

const optionChange = (data) => {
  // if (!data.length) {
  //   ElMessage.info('至少选择一个显示内容!')
  //   return
  // }
  suboptions.value = options.value.filter((item) => {
    return data.includes(item.id)
  })
  setFields({
    codeReadId: readQrCodeId.value,
    fields: data,
    queryConfiguration: 'setting'
  }).then(() => {
    // 如果上面的X掉了，那么下面的也要去掉
    if (searchCondition.value.length) {
      searchCondition.value = searchCondition.value.filter((item) => {
        return data.includes(item)
      })
      setFields({
        codeReadId: readQrCodeId.value,
        conditionFields: searchCondition.value,
        fields: showContent.value,
        queryConfiguration: 'setting'
      }).then(() => {
      })
    }
  })

}

const conditionChange = (data) => {
  // if (!data.length) {
  //   return
  // }
  setFields({
    codeReadId: readQrCodeId.value,
    conditionFields: data,
    fields: showContent.value,
    queryConfiguration: 'setting'
  }).then(() => {
  })
}
const searchOptionList = () => {
  searchFieldList(currentRouter.query.formId).then((res) => {
    options.value = res
  })
}
</script>

<style lang="less" scoped>
.open_search {
  .open_url_box {
    padding-top: 16px;

    .text {
      margin-bottom: 20px;
      color: @base-text-color-3;
    }

    .is_open_url {
      .show_url_box {
        margin-top: 20px;

        .password_line {
          margin-top: 20px;
          display: flex;
          align-items: center;

          .text_password {
            margin-right: 8px;
            color: @base-text-color-3;
          }

          .password_input {
            width: 203px;
            margin-left: 16px;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .search_set_up {
    margin-top: 60px;

    .search_title {
      margin-bottom: 30px;
    }

    .option_box {
      .el-select {
        width: 303px;
      }
    }

    .span_title {
      color: @base-text-color-3;
    }

    .search_content {
      margin-bottom: 20px;
    }
  }
}
</style>