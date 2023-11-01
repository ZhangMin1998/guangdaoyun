<template>
  <div class="pages">
    <div class="form_create">
      <!-- <div class="header">
        <span class="add_data">添加数据</span>
        <span class="back" @click="backHome">返回</span>
      </div> -->
      <div class="main_content_box">
        <!-- <div class="form_name">
          机动车驾驶违规
        </div> -->
        <div class="from_content">
          <FormCreate :rule="rule" v-model="form" :option="option" @submit="onSubmit"></FormCreate>
        </div>
        <!-- <div class="btns">
          <el-button @click="cancelSubmit">取消</el-button>
          <el-button type="primary" @click="confirmSubmit">确定</el-button>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { getFormJson } from '@/api/home'
import { setFormData } from '@/api/addData'
import formCreate from '@form-create/element-ui'
import { ElMessage } from 'element-plus'
const FormCreate = formCreate.$form()
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// const router = useRouter()
const currentRoute = useRoute()
const form: any = ref({})
const rule = ref([])
const option = ref({})
let ElMessageInstance
const props = defineProps({
  formId: {
    type: Number
  }
})

onMounted(() => {
  if (typeof (currentRoute.query.rowdata) === 'string') {
    form.value = JSON.parse(currentRoute.query.rowdata)
  }
  setFormJson()
})

const setFormJson = () => {
  getFormJson(props.formId).then((res: any) => {
    let FcDesignerRule = JSON.parse(res.moduleJson) || []
    const FcDesignerOptions = JSON.parse(res.formJson) || ''
    FcDesignerRule = FcDesignerRule.map((item) => {
      return JSON.parse(item)
    })
    rule.value = FcDesignerRule
    option.value = FcDesignerOptions
  })
}
const onSubmit = () => {
  // console.log()
  confirmSubmit()
}

// const backDetail = () => {
//   const { data, appName } = currentRoute.query
//   router.push({ path: '/home/detail', query: { data, appName } })
// }

const confirmSubmit = () => {
  // if (currentRoute.query.type === 'add') {
  setFormData({
    formId: props.formId,
    jsonObject: form.value
  }).then(() => {
    if(ElMessageInstance){
      ElMessageInstance.close()
    }
    ElMessageInstance =  ElMessage.success('添加成功')
    form.value = {}
    setFormJson()
  })
  // } else {
  //   // 编辑的提交
  //   editFormData({
  //     dataId: editId,
  //     formId: props.formId,
  //     jsonObject: form.value
  //   }).then(() => {
  //     console.log('修改成功')
  //     backDetail()
  //   })

  // }


}
// const cancelSubmit = () => {
//   backDetail()
// }
</script>

<style lang="less" scoped>
.pages {
  // min-height: calc(100vh - 64px);
  padding: 32px;

  .form_create {
    min-height: calc(100vh - 248px);
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px 24px 24px;
    background-color: #fff;

    .header {
      height: 72px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #DDDDDD;

      .add_data {
        font-size: 18px;
        color: @base-text-color-2;
      }

      .back {
        cursor: pointer;
        color: @base-text-color-3;
      }
    }

    .main_content_box {
      height: 100%;
      flex: 1;
      padding: 30px 24px 24px 24px;
      display: flex;
      flex-direction: column;

      .form_name {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #DDDDDD;
      }

      .from_content {
        margin-top: 18px;
        flex: 1;
      }

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
