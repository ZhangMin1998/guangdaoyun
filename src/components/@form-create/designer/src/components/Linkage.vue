<template>
  <div class="linkage_wrap">
    <el-select v-model="value" style="width: 100%;" @change='handleLink'>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <ElButton v-if="value === 'select_data'" @click="handleLinkage" style="width: 100%;">数据联动设置</ElButton>
    <LinkageDialog v-if='showLinkage' v-model:show-linkage="showLinkage" @success='setLinkRule'></LinkageDialog>
  </div>
</template>

<script>
import LinkageDialog from './LinkageDialog.vue'
export default {
  name: 'Linkage',
  components: {
    LinkageDialog
  },
  props: {
    modelValue: Object
  },
  data () {
    return {
      value: '',
      options: [
        { label: '数据联动', value: 'select_data' },
        { label: '表联动', value: 'select_table' }
      ],
      showLinkage: false
    }
  },
  mounted() {
  },
  methods: {
    handleLink() {
      this.$emit('update:modelValue', null)
    },
    handleLinkage() {
      this.showLinkage = true
    },
    setLinkRule(rule) {
      rule.selectType = this.value
      this.$emit('update:modelValue', rule)
    }
  }
}
</script>

<style scoped>
.linkage_wrap {
    width: 100%;
}
</style>