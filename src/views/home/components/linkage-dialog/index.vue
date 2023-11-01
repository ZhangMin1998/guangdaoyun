<template>
  <el-dialog v-model="showDialog" :show-close="true" title='数据联动设置'>
    <div class='container'>
      <div class='link_form'>
        <div class='tip'>联动表单</div>
        <el-select v-model="formValue" placeholder="Select">
          <el-option
            v-for="item in formList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class='link_Conditions'>
        <span>满足以下</span>
        <el-select v-model="conditionValue" placeholder="Select">
          <el-option
            v-for="item in CONDITION_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span>条件时</span>
      </div>
      <div class='add_filter_btn'>
        <el-icon color="#409EFC">
          <Plus />
        </el-icon>
        <span>添加过滤条件</span>
      </div>
      <div class='link_form_field'>
        <div class='tip_head'>
          <div>联动表单</div>
          <div>当前表单</div>
        </div>
        <div
          v-for='(item, index) in linkRule'
          :key='index'
          class='field_wrap'
        >
          <div class='left'>
            <el-select v-model="item.linkFormField" placeholder="Select">
              <el-option
                v-for="item in linkFormFieldList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="item.linkWay" placeholder="Select">
              <el-option
                v-for="item in LINK_WAY_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class='right'>
            <el-select v-model="item.currentFormField" placeholder="Select">
              <el-option
                v-for="item in currentFormFieldList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
              当前单行文本2
            </div>
            <div class='left_tip'>联动显示</div>
          </div>
          <div class='right'>
            <el-select v-model="touchLinkField" placeholder="Select">
              <el-option
                v-for="item in linkFormFieldList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class='floor'>
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang='ts'>
import { computed } from 'vue'

const CONDITION_OPTIONS = [
  { label: '所有', value: 'all' },
  { label: '任一', value: 'either' }
]
const LINK_WAY_OPTIONS = [
  { label: '等于', value: 'equal' },
  { label: '不等于', value: 'noEqual' },
  { label: '包含', value: 'contain' },
  { label: '不包含', value: 'noContain' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'noEmpty' },
  { label: '等于任意一个', value: 'any' },
  { label: '不等于任意一个', value: 'noAny' }
]

interface IProps {
  showLinkage: boolean
}

const emit = defineEmits([
  'update:showLinkage'
])

/* props */
const props = defineProps<IProps>()

/* 声明状态 */
const formValue = ref('') // 联动表单
const formList = ref([
  { label: '表单1', value: 'form1' },
  { label: '表单2', value: 'form2' }
]) // 联动表单数据
const conditionValue = ref('') // 满足条件方式
const linkRule = ref([
  { linkFormField: '', linkWay: 'equal', currentFormField: '' }
]) // 过滤条件数据
const linkFormFieldList = ref([
  { label: '联动单行文本1', value: 'input1' },
  { label: '联动单行文本2', value: 'input2' }
]) // 联动表单的表单字段
const currentFormFieldList = ref([
  { label: '当前单行文本1', value: 'input1' },
  { label: '当前单行文本2', value: 'input2' }
])
const touchLinkField = ref('')

/* 计算属性 */
const showDialog = computed<boolean>({
  get () {
    return props.showLinkage
  },
  set (value) {
    emit('update:showLinkage', value)
  }
})

/* 声明函数 */

</script>

<style lang='less' scoped>
.link_Conditions {
  display: flex;
}
.tip_head {
  display: flex;
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
  }
}
</style>