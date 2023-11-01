<template>
  <div class='link_dialog'>
    <el-dialog v-model="showDialog" :show-close="true" title='数据联动设置' :width='"800px"'>
      <div class='container'>
        <div class='link_form'>
          <div class='tip'>联动表单</div>
          <el-select v-model="formValue" placeholder="请选择联动表单" no-data-text='暂无数据' @change='handleLinkForm'>
            <el-option
              v-for="item in formList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class='link_Conditions'>
          <span>满足以下</span>
          <el-select v-model="conditionValue" placeholder="请选择字段" no-data-text='暂无数据'>
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span>条件时</span>
        </div>
        <div class='add_filter_btn'>
          <div class='btn' @click='addFilter'>
            <el-icon color="#409EFC">
              <Plus />
            </el-icon>
            <span>添加过滤条件</span>
          </div>
        </div>
        <div class='link_form_field'>
          <div class='tip_head'>
            <div>联动表单</div>
            <div>当前表单</div>
          </div>
          <div
            v-for='(link, index) in linkRule'
            :key='index'
            class='field_wrap'
          >
            <div class='left'>
              <el-select v-model="link.linkFormField" placeholder="请选择字段" no-data-text='暂无数据' @change='(value) => handleFilterForm(link, value)'>
                <el-option
                  v-for="item in linkFormFieldList"
                  :key="item.fieldEn"
                  :label="item.filedCn"
                  :value="item.fieldEn"
                  @click.prevent='clickFilterSelect(link, item)'
                />
              </el-select>
              <div class='left_tip_way'>
                <el-select v-model="link.linkWay" placeholder="请选择字段" no-data-text='暂无数据'>
                  <el-option
                    v-for="item in linkWayOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class='right'>
              <el-select
                v-model="link.currentFormField"
                placeholder="请选择字段"
                no-data-text='暂无数据'
                :disabled='!link.linkFormField'
              >
                <el-option
                  v-for="item in link.currentFormList"
                  :key="item.field"
                  :label="item.title"
                  :value="item.field"
                />
              </el-select>
              <i class='iconfont icon-a-zu6211' @click='delFilter(index)'></i>
            </div>
          </div>
        </div>
        <div class='touch_link_title'>触发以下联动</div>
        <div class='touch_form_field'>
          <div class='tip_head'>
            <div>当前表单</div>
            <div>联动表单</div>
          </div>
          <div class='field_wrap'>
            <div class='left'>
              <div class='current_field'>
                {{ activeField.title }}
              </div>
              <div class='left_tip_way'>联动显示</div>
            </div>
            <div class='right'>
              <el-select v-model="touchLinkField" placeholder="请选择字段" no-data-text='暂无数据'>
                <el-option
                  v-for="item in touchFormFieldOptions"
                  :key="item.fieldEn"
                  :label="item.filedCn"
                  :value="item.fieldEn"
                />
              </el-select>
              <div class='right_tip'>的值</div>
            </div>
          </div>
        </div>
      </div>
      <div class='floor'>
        <div class='cancel_btn' @click='closeDialog'>取消</div>
        <el-button type="primary" @click='submit'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import {
  getAppFormData,
  getAppFormFieldData
} from '@/api/home'

const CONDITION_OPTIONS = [
  { label: '所有', value: 'all' },
  { label: '任一', value: 'any' }
]

const LINK_WAY_OPTIONS = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'ge' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'le' },
  { label: '包含', value: 'like' },
  { label: '不包含', value: 'notLike' },
  { label: '为空', value: 'isNull' },
  { label: '不为空', value: 'isNotNull' },
  { label: '介于', value: 'between' },
  { label: '不介于', value: 'notBetween' },
  { label: '等于任意一个', value: 'in' },
  { label: '不等于任意一个', value: 'notIn' }
]
export default {
  name: 'LinkageDialog',
  inject: ['getJson', 'designer'],
  props: {
    showLinkage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeField: {},
      formValue: '',
      formList: [], // 表单信息
      conditionValue: 'all',
      conditionOptions: Object.freeze(CONDITION_OPTIONS),
      linkRule: [
        { linkFormField: '', linkFormType: '', linkWay: 'eq', currentFormField: '', currentFormList: [] }
      ],
      linkFormFieldList: [],
      allFormFieldInfo: {},
      touchLinkField: '',
      currentFormFieldList: [], // 当前表单的所有字段
      linkWayOptions: Object.freeze(LINK_WAY_OPTIONS)
    }
  },
  computed: {
    // 弹窗是否显示
    showDialog: {
      get() {
        return this.showLinkage
      },
      set(value) {
        this.$emit('update:showLinkage', value)
      }
    },
    // 当前Appid
    appId() {
      return this.$route.query.appId
    },
    // 当前表单Id
    formId() {
      return this.$route.query.formId
    },
    // 触发联动 联动表单可选字段
    touchFormFieldOptions() {
      return this.linkFormFieldList.filter(item => item.fieldType === this.activeField.type)
    }
  },
  mounted() {
    this.activeField = this.designer.setupState.activeRule
    this.currentFormFieldList = JSON.parse(this.getJson())
    this.currentFormFieldList = this.currentFormFieldList.filter(item => item.field !== this.activeField.field)
    this.getFormInfo()
    console.log('111', this.currentFormFieldList, this.appId)
  },
  methods: {
    // 获取表单信息
    getFormInfo() {
      getAppFormData({
        appId: this.appId
      }).then(res => {
        const result = res || []
        this.formList = result
        // this.formList = result.filter(item => item.id !== +this.formId)
      })
    },
    // 切换联动表单时
    handleLinkForm(value) {
      this.linkRule = [{ linkFormField: '', linkFormType: '', linkWay: 'eq', currentFormField: '', currentFormList: [] }]
      this.touchLinkField = ''
      if (this.allFormFieldInfo[value]) {
        this.linkFormFieldList = this.allFormFieldInfo[value]
      } else {
        this.getFormFieldInfo(value)
      }
    },
    // 获取表单字段信息
    getFormFieldInfo(formId) {
      const params = new FormData()
      params.append('formId', formId)
      getAppFormFieldData(params).then(res => {
        this.allFormFieldInfo[formId] = res || []
        this.linkFormFieldList = this.allFormFieldInfo[formId]
        console.log('2222', res)
      })
    },
    // 过滤条件联动表单发生变化时
    handleFilterForm(link, value) {
      const findRule = this.linkFormFieldList.find(item.fieldEn === value)
      link.currentFormField = ''
      link.currentFormList = this.currentFormFieldList.filter(item => item.type === findRule.fieldType)
    },
    // 点击过滤条件联动表单下拉框时
    clickFilterSelect(link, opt) {
      link.linkFormType = opt.fieldType
    },
    // 添加过滤条件
    addFilter() {
      this.linkRule.push({ linkFormField: '', linkFormType: '', linkWay: 'eq', currentFormField: '', currentFormList: [] })
    },
    // 删除过滤条件
    delFilter(index) {
      this.linkRule.splice(index, 1)
    },
    // 点击取消
    closeDialog() {
      this.showDialog = false
    },
    submit() {
      if (
        !this.formValue ||
        !this.linkRule.length ||
        this.linkRule.some(item => !item.linkFormField || !item.currentFormField) ||
        !this.touchLinkField
      ) {
        ElMessage.info('请补充完整信息！')
        return
      }
      const result = {
        fieldsDTOList: [],
        filterDTOList: [],
        selectField: this.touchLinkField,
        selectFilterRel: this.conditionValue,
        selectFormId: +this.formValue,
        selectLimitType: 'single',
        selectSortField: '',
        selectSortType: ''
      }
      this.linkRule.forEach(item => {
        result.filterDTOList.push({
          method: item.linkWay,
          selectField: item.linkFormField,
          selectFieldType: item.linkFormType,
          valueConstant: '',
          valueField: item.currentFormField,
          valueType: 'form_field'
        })
      })
      this.$emit('success', result)
    }
  }
}
</script>

<style lang='less' scoped>
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 24px 0 16px;
    margin: 0 24px;
    border-bottom: 1px solid #DDDDDD;
  }
  .el-dialog__title {
    font-size: 18px;
    line-height: 24px;
    color: @base-text-color-2;
  }
  .el-dialog__headerbtn {
    top: 24px;
    right: 24px;
    width: 24px;
    height: 24px;
    .el-dialog__close {
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: @base-text-color-1;
      &:hover {
        color: @active-color;
      }
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
  .el-dialog__body {
    padding: 24px;
  }
}
:deep(.el-select) {
  .el-input.is-disabled .el-input__wrapper,
  .el-input__wrapper {
    padding: 0 12px;
    box-shadow: none;
    border: 1px solid @border-color-1;
    border-radius: 2px;
    .el-input__inner {
      font-size: 14px;
      height: 30px !important;
      line-height: 30px;
      color: @base-text-color-1;
      &::placeholder {
        color: @base-text-color-3;
      }
    }
  }
}
.container {
  .link_form {
    margin-bottom: 24px;
    .tip {
      font-size: 14px;
      color: @base-text-color-1;
      line-height: 21px;
      margin-bottom: 8px;
    }
    :deep(.el-select) {
      width: 94%;
    }
  }
  .link_Conditions {
    font-size: 14px;
    color: @base-text-color-1;
    line-height: 21px;
    margin-bottom: 8px;
    :deep(.el-select) {
      width: 88px;
      .el-input__wrapper {
        box-shadow: none !important;
        border: none;
        border-radius: 2px;
        .el-input__inner {
          font-size: 14px;
          height: 21px !important;
          line-height: 21px;
          &::placeholder {
            color: @base-text-color-3;
          }
        }
      }
    }
  }
  .add_filter_btn {
    display: flex;
    font-size: 14px;
    line-height: 21px;
    color: @active-color;
    margin-bottom: 12px;
    .btn {
      cursor: pointer;
    }
    :deep(.el-icon) {
      position: relative;
      top: 2px;
      line-height: 20px;
      margin-right: 4px;
      color: @active-color;
    }
  }
  .link_form_field {
    margin-bottom: 24px;
    .field_wrap {
      margin-bottom: 12px;
    }
    .right {
      i {
        position: absolute;
        top: 4px;
        right: 0;
        font-size: 20px;
        cursor: pointer;
        color: @base-text-color-1;
      }
    }
    :deep(.el-select) {
      width: 100%;
    }
    .left_tip_way {
      :deep(.el-select) {
        width: 152px;
        .el-input__wrapper {
          box-shadow: none !important;
          border: none;
          border-radius: 2px;
          .el-input__inner {
            font-size: 14px;
            height: 32px;
            line-height: 32px;
            &::placeholder {
              color: @base-text-color-3;
            }
          }
        }
      }
    }
  }
  .touch_link_title {
    font-size: 14px;
    color: @base-text-color-1;
    line-height: 21px;
    margin-bottom: 16px;
  }
  .touch_form_field {
    .current_field {
      width: calc(100% - 152px);
      border: 1px solid @border-color-1;
      border-radius: 2px;
      padding: 0 12px;
      font-size: 14px;
      line-height: 30px;
      color: @base-text-color-1;
    }
    .left_tip_way {
      padding: 0 12px;
      color: @base-text-color-1;
      line-height: 32px;
    }
    .right {
      .right_tip {
        position: absolute;
        top: 6px;
        right: 0;
        font-size: 14px;
        line-height: 20px;
        color: @base-text-color-1;
      }
    }
  }
}
.floor {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  .cancel_btn {
    padding: 0 32px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #0052D9;
    color: @active-color;
    margin-right: 20px;
    cursor: pointer;
  }
  :deep(.el-button--small) {
    padding: 0 32px;
    height: 30px;
    border-radius: 0;
    background: @active-bg-color1;
    font-size: 14px;
    border-color: #0052D9;
  }
  :deep(.el-button:focus, .el-button:hover) {
    background: @active-bg-color1;
  }
}

.link_Conditions {
  display: flex;
}
.tip_head {
  display: flex;
  font-size: 14px;
  line-height: 21px;
  margin-bottom: 6px;
  color: @base-text-color-3;
  div {
    flex: 1;
  }
}
.field_wrap {
  display: flex;
  .left,
  .right {
    flex: 1;
  }
  .left {
    display: flex;
    width: 100%;
    .left_tip_way {
      width: 152px;
    }
  }
  .right {
    position: relative;
    :deep(.el-select) {
      width: 87%;
    }
  }
}
</style>