<template>
  <div class="card_wrap">
    <div class="base_info_wrap">
      <div class="index">{{ infoIndex }}</div>
      <div
        v-for="item in baseLabelList"
        :key="item.prop"
        class="info"
      >
        <div
          class="label"
        >
          <!-- :style="{ width: baseLabelWidth }" -->
          {{ item.label + '：' }}
        </div>
        <div class="value" v-if="item.showHtml" v-html="cardInfo[item.prop] || '--'"></div>
        <div class="value" v-else-if="item.showOnlyValue">{{ deleteBracket(cardInfo[item.prop])}}</div>
        <div class="value" v-else>{{ cardInfo[item.prop] || '--' }}</div>
      </div>
      <div class="fold">
        <van-icon
          name="arrow-down"
        />
      </div>
    </div>
    <div
      v-show="showDetail"
      class="detail_info_wrap"
    >
      <div
        v-for="item in labelInfoList"
        :key="item.prop"
        class="info"
      >
        <div
          class="label"
          
        >
          <!-- :style="{ width: detailLabelWidth }" -->
          {{ item.label + '：' }}
        </div>
        <div class="value" v-if="item.showHtml" v-html="cardInfo[item.prop] || '--'"></div>
        <div class="value" v-else-if="item.showOnlyValue">{{ deleteBracket(cardInfo[item.prop])}}</div>
        <div class="value" v-else>{{ cardInfo[item.prop] || '--' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted } from 'vue'

/* props */
const props = defineProps({
  // 字段信息
  labelInfoList: {
    type: Array<any>,
    default: () => []
  },
  // 数据
  cardInfo: {
    type: Object,
    default: () => {}
  },
  infoIndex: {
    type: Number,
    default: 0
  },
  showDetail: {
    type: Boolean,
    default: false
  }
})

/* 声明状态 */
// const baseLabelWidth = ref('')
// const detailLabelWidth = ref('')

/* 计算属性 */
const baseLabelList = computed(() => props.labelInfoList.filter(item => item.isSearch))

/* 监听 */

/* 渲染完成 */
onMounted(() => {
  // if (props.labelInfoList.length) {
  //   labelWidth()
  // }
})

function deleteBracket(value) {
  if (value) {
    const newvalue = value.replace(/\[|]/g, '')
    return newvalue || '--'
  } else {
    return '--'
  }
}

/* 方法 */
// function labelWidth(): void {
//   // const size = formatPx(14)
//   const size = 28
//   let base = 0
//   let detail = 0
//   props.labelInfoList.forEach(item => {
//     const ele = document.createElement('span')
//     ele.style.display = 'inline-block'
//     ele.style.fontSize = `${ size }px`
//     ele.innerText = `${ item.label }：`
//     document.body.appendChild(ele)
//     const width = ele.clientWidth
//     if (width > detail) detail = width
//     if (item.isSearch) base = detail
//     document.body.removeChild(ele)
//   })
//   // baseLabelWidth.value = `${ base / 192 }rem`
//   baseLabelWidth.value = `${ base }px`
//   // detailLabelWidth.value = `${ detail / 192 }rem`
//   detailLabelWidth.value = `${ detail }px`
// }

// function formatPx(num: number): number {
//   return (num * +document.documentElement.style.fontSize.split('px')[0]) / 192
// }

</script>

<style lang="less" scoped>
.card_wrap {
  background: #FFFFFF;
  padding: 32px 24px 0;
  border-radius: 16px;
  .info {
    display: flex;
    margin-bottom: 22px;
    .label {
      color: #98A3B7;
      min-width: 20px;
      margin-right: 8px;
    }
    .value {
      white-space: pre-wrap;
      flex: 1;
    }
  }
  .base_info_wrap {
    position: relative;
    padding-left: 58px;
    padding-right: 32px;
    padding-bottom: 8px;
    font-size: 28px;
    line-height: 40px;
    color: #0D162A;
    .index {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 32px;
      line-height: 40px;
    }
    .fold {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 24px;
      color: #ADADAD;
      transform: rotate(0);
    }
  }
  .detail_info_wrap {
    overflow-y: hidden;
    font-size: 28px;
    line-height: 40px;
    color: #0D162A;
    padding: 30px 0 8px 58px;
    border-top: 1px solid #EEEEEE;
  }
}
</style>