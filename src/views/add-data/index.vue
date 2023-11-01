<template>
  <div class="pages">
    <div class="form_create">
      <div class="header">
        <span class="add_data">{{currentRoute.query.type==='edit' ? '编辑数据':'添加数据'}}</span>
        <span class="back" @click="backHome">返回</span>
      </div>
      <div class="main_content_box">
        <div class="form_name">
          {{ formName }}
        </div>
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
import { setFormData, editFormData } from '@/api/addData'
import formCreate from '@form-create/element-ui'
import { ElMessage } from 'element-plus'
const FormCreate = formCreate.$form()
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()
const form:any = ref({})
const rule = ref([])
const option = ref({})
const formName = ref('')
let editId = ''

onMounted(() => {
  if (typeof (currentRoute.query.rowdata) === 'string') {
    form.value = JSON.parse(currentRoute.query.rowdata)
    
    for(const key in form.value) {
      if (form.value.hasOwnProperty(key)) {
        const value = form.value[key]
        try {
          const parsedValue = JSON.parse(value)
          if (Array.isArray(parsedValue)) {
            form.value[key] = parsedValue
          }
        // eslint-disable-next-line no-empty
        } catch (err) {
          
        }
      }
    }
    editId = form.value.id
  }
  setFormJson()
})

const setFormJson = () => {
  getFormJson(currentRoute.query.formId).then((res: any) => {
    let FcDesignerRule = JSON.parse(res.moduleJson) || []
    const FcDesignerOptions = JSON.parse(res.formJson) || ''
    FcDesignerRule = FcDesignerRule.map((item) => {
      return JSON.parse(item)
    })
    rule.value = FcDesignerRule
    option.value = FcDesignerOptions
    formName.value = res.formName
  })
}
const onSubmit = (formData) => {
  console.log(formData)
  confirmSubmit()
}

const backDetail = () => {
  const { data, appName } = currentRoute.query
  router.push({ path: '/home/detail', query: { data, appName } })
}

const confirmSubmit = () => {
  if (currentRoute.query.type === 'add') {
    setFormData({
      formId: currentRoute.query.formId,
      jsonObject: form.value
    }).then(() => {
      ElMessage.success('添加成功')
      backDetail()
    })
  } else {
    // 编辑的提交
    editFormData({
      dataId:editId,
      formId: currentRoute.query.formId,
      jsonObject: form.value
    }).then(() => {
      console.log('修改成功')
      backDetail()
    })

  }


}
// const cancelSubmit = () => {
//   backDetail()
// }
const backHome = () => {
  backDetail()
}
</script>

<style lang="less" scoped>
.pages {
  min-height: calc(100vh - 64px);
  padding: 32px;

  .form_create {
    min-height: calc(100vh - 128px);
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
